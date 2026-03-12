const getAll = async (req, res, next) => {
  try {
    // TODO: Agency sees own commissions; admin sees all
    res.json({ commissions: [], total: 0 });
  } catch (err) { next(err); }
};

const getReports = async (req, res, next) => {
  try {
    res.json({ report: {} });
  } catch (err) { next(err); }
};

module.exports = { getAll, getReports };
