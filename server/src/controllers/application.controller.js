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
    const { status, page = 1, limit = 20 } = req.query;

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

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .populate('userId', 'username email phone')
        .populate('agencyId', 'username email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
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
// PUT /applications/:id/status  — Admin updates application status
// ===========================================================================
const updateStatus = async (req, res, next) => {
  try {
    if (!checkValidation(req, res)) return;

    const { status, adminNote, agencyId } = req.body;

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    application.status = status;
    if (adminNote !== undefined) application.adminNote = adminNote;
    if (agencyId !== undefined) application.agencyId = agencyId;
    await application.save();

    const updated = await Application.findById(application._id)
      .populate('userId', 'username email phone')
      .populate('agencyId', 'username email');

    logger.info(`Application ${application._id} status → ${status} by admin=${req.user.id}`);

    res.json({ message: 'Status updated.', application: updated });
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

module.exports = { create, getAll, getById, updateStatus, getDocuments };
