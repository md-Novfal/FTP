const getAnalytics = async (req, res, next) => {
  try {
    // TODO: Aggregate counts — students, agencies, applications, commissions
    res.json({ analytics: {} });
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
