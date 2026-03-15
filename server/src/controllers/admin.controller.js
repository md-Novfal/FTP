const User = require('../models/user.model');
const Application = require('../models/application.model');
const Commission = require('../models/commission.model');

const getAnalytics = async (req, res, next) => {
  try {
    const [students, agencies, applications, commissions, recentApplications] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'agency' }),
      Application.countDocuments(),
      Commission.aggregate([
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),
      Application.find()
        .sort({ createdAt: -1 })
        .limit(8)
        .populate('userId', 'email')
        .populate('agencyId', 'email'),
    ]);

    const commissionTotal = commissions[0]?.total || 0;

    res.json({
      stats: { students, agencies, applications, commissionTotal },
      recentApplications,
    });
  } catch (err) { next(err); }
};

const getReports = async (req, res, next) => {
  try {
    res.json({ reports: [] });
  } catch (err) { next(err); }
};

const getAuditLogs = async (req, res, next) => {
  try {
    res.json({ logs: [], total: 0 });
  } catch (err) { next(err); }
};

module.exports = { getAnalytics, getReports, getAuditLogs };
