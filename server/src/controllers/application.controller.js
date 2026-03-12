const create = async (req, res, next) => {
  try {
    // TODO: Create application with status 'apply'
    res.status(201).json({ message: 'Application submitted' });
  } catch (err) { next(err); }
};

const getAll = async (req, res, next) => {
  try {
    // TODO: Filtered by role (admin sees all, agency sees own, student sees own)
    res.json({ applications: [], total: 0 });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    res.json({ application: null });
  } catch (err) { next(err); }
};

const updateStatus = async (req, res, next) => {
  try {
    // TODO: Admin updates application status along workflow pipeline
    res.json({ message: 'Status updated' });
  } catch (err) { next(err); }
};

const getDocuments = async (req, res, next) => {
  try {
    res.json({ documents: [] });
  } catch (err) { next(err); }
};

module.exports = { create, getAll, getById, updateStatus, getDocuments };
