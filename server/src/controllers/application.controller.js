const { validationResult } = require('express-validator');
const Application = require('../models/application.model');
const Document = require('../models/document.model');
const logger = require('../config/logger');

const checkValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: errors.array()[0].msg });
    return false;
  }
  return true;
};

// ===========================================================================
// POST /applications  — Student creates a new application
// ===========================================================================
const create = async (req, res, next) => {
  try {
    if (!checkValidation(req, res)) return;

    const { universityName, courseName, countryName } = req.body;

    const application = await Application.create({
      userId: req.user.id,
      universityName,
      courseName,
      countryName,
      status: 'apply',
      submittedAt: new Date(),
    });

    logger.info(`Application created: ${application._id} by user=${req.user.id}`);

    res.status(201).json({
      message: 'Application submitted successfully.',
      application,
    });
  } catch (err) {
    next(err);
  }
};

// ===========================================================================
// GET /applications  — List applications (role-filtered)
// ===========================================================================
const getAll = async (req, res, next) => {
  try {
    const { role, id: userId } = req.user;
    const { status } = req.query;

    // Support both skip/limit and page/limit pagination styles
    let skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 20;

    if (!req.query.skip && req.query.page) {
      skip = (parseInt(req.query.page) - 1) * limit;
    }

    const filter = {};

    // Role-based filtering
    if (role === 'student') {
      filter.userId = userId;
    } else if (role === 'agency') {
      filter.agencyId = userId;
    }
    // admin / super_admin see all

    if (status) {
      filter.status = status;
    }

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .populate('userId', 'username email phone')
        .populate('agencyId', 'username email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Application.countDocuments(filter),
    ]);

    res.json({ applications, total });
  } catch (err) {
    next(err);
  }
};

// ===========================================================================
// GET /applications/:id  — Get single application with access check
// ===========================================================================
const getById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('userId', 'username email phone')
      .populate('agencyId', 'username email');

    if (!application) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    // Students can only see their own
    if (req.user.role === 'student' && application.userId._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    // Agencies can only see assigned applications
    if (req.user.role === 'agency' && application.agencyId?._id?.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    res.json({ application });
  } catch (err) {
    next(err);
  }
};

// ===========================================================================
// PUT /applications/:id  — Update application (students edit details, admin/agency update status)
// ===========================================================================
const update = async (req, res, next) => {
  try {
    if (!checkValidation(req, res)) return;

    const { universityName, courseName, countryName, status, adminNote } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    // Students can only edit their own applications (and only certain fields before submission)
    if (req.user.role === 'student') {
      if (application.userId.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Access denied.' });
      }
      // Students can update basic info
      if (universityName) application.universityName = universityName;
      if (courseName) application.courseName = courseName;
      if (countryName) application.countryName = countryName;
    } else if (req.user.role === 'agency') {
      // Agencies can only update applications assigned to them
      if (application.agencyId?.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Access denied.' });
      }
      // Agencies can update status and add notes
      if (status) application.status = status;
      if (adminNote !== undefined) application.adminNote = adminNote;
    } else if (req.user.role === 'admin' || req.user.role === 'super_admin') {
      // Admins can update anything
      if (universityName) application.universityName = universityName;
      if (courseName) application.courseName = courseName;
      if (countryName) application.countryName = countryName;
      if (status) application.status = status;
      if (adminNote !== undefined) application.adminNote = adminNote;
    }

    await application.save();

    const updated = await Application.findById(application._id)
      .populate('userId', 'username email phone')
      .populate('agencyId', 'username email');

    logger.info(`Application ${application._id} updated by user=${req.user.id}`);

    res.json({ message: 'Application updated successfully.', application: updated });
  } catch (err) {
    next(err);
  }
};

// ===========================================================================
// PUT /applications/:id/status  — Admin/Agency updates application status
// ===========================================================================
const updateStatus = async (req, res, next) => {
  try {
    if (!checkValidation(req, res)) return;

    const { status, adminNote } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    // Agencies can only update applications assigned to them
    if (req.user.role === 'agency' && application.agencyId?.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    application.status = status;
    if (adminNote !== undefined) application.adminNote = adminNote;
    await application.save();

    const updated = await Application.findById(application._id)
      .populate('userId', 'username email phone')
      .populate('agencyId', 'username email');

    logger.info(`Application ${application._id} status → ${status} by user=${req.user.id}`);

    res.json({ message: 'Status updated.', application: updated });
  } catch (err) {
    next(err);
  }
};

// ===========================================================================
// PUT /applications/:id/assign-agency  — Admin assigns agency to application
// ===========================================================================
const assignAgency = async (req, res, next) => {
  try {
    const { agencyId } = req.body;
    if (!agencyId) {
      return res.status(400).json({ error: 'Agency ID is required.' });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    application.agencyId = agencyId;
    await application.save();

    const updated = await Application.findById(application._id)
      .populate('userId', 'username email phone')
      .populate('agencyId', 'username email');

    logger.info(`Application ${application._id} assigned agency=${agencyId} by admin=${req.user.id}`);

    res.json({ message: 'Agency assigned.', application: updated });
  } catch (err) {
    next(err);
  }
};

// ===========================================================================
// GET /applications/:id/documents  — List documents for an application
// ===========================================================================
const getDocuments = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    // Access check
    if (req.user.role === 'student' && application.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const documents = await Document.find({ applicationId: req.params.id })
      .populate('uploadedBy', 'username')
      .populate('verifiedBy', 'username')
      .sort({ createdAt: -1 });

    res.json({ documents });
  } catch (err) {
    next(err);
  }
};

// ===========================================================================
// GET /dashboard  — Student dashboard stats
// ===========================================================================
const getStudentDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const totalApplications = await Application.countDocuments({ userId });
    const completedApplications = await Application.countDocuments({
      userId,
      status: { $in: ['visa', 'ticket', 'arrived'] },
    });
    const inProgressApplications = await Application.countDocuments({
      userId,
      status: { $nin: ['visa', 'ticket', 'arrived', 'rejected'] },
    });

    const recentApplications = await Application.find({ userId })
      .sort({ createdAt: -1 })
      .populate('agencyId', 'username email')
      .lean();

    res.json({
      stats: {
        totalApplications,
        completedApplications,
        inProgressApplications,
      },
      recentApplications,
      total: totalApplications,
    });
  } catch (err) {
    next(err);
  }
};

// ===========================================================================
// GET /agency/dashboard  — Agency dashboard stats
// ===========================================================================
const getAgencyDashboard = async (req, res, next) => {
  try {
    const agencyId = req.user.id;
    const students = await Application.distinct('userId', { agencyId });
    const applications = await Application.countDocuments({ agencyId });
    const completed = await Application.countDocuments({
      agencyId,
      status: { $in: ['visa', 'ticket', 'arrived'] },
    });
    const successRate = applications > 0 ? Math.round((completed / applications) * 100) : 0;

    const recentApplications = await Application.find({ agencyId })
      .sort({ createdAt: -1 })
      .populate('userId', 'username email phone')
      .lean();

    res.json({
      stats: {
        students: students.length,
        applications,
        successRate,
      },
      recentApplications,
      total: applications,
    });
  } catch (err) {
    next(err);
  }
};

// ===========================================================================
// GET /agency/applications  — List applications assigned to agency
// ===========================================================================
const getAgencyApplications = async (req, res, next) => {
  try {
    const agencyId = req.user.id;

    // Support both skip/limit and page/limit pagination styles
    let skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 20;

    if (!req.query.skip && req.query.page) {
      skip = (parseInt(req.query.page) - 1) * limit;
    }

    const [applications, total] = await Promise.all([
      Application.find({ agencyId })
        .populate('userId', 'username email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Application.countDocuments({ agencyId }),
    ]);

    res.json({ applications, total });
  } catch (err) {
    next(err);
  }
};

module.exports = { create, getAll, getById, update, updateStatus, assignAgency, getDocuments, getStudentDashboard, getAgencyDashboard, getAgencyApplications };
