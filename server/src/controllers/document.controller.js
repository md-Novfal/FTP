const upload = async (req, res, next) => {
  try {
    // TODO: Upload file to S3, save record to DB
    res.status(201).json({ message: 'Document uploaded' });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    res.json({ document: null });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    // TODO: Delete from S3 and DB
    res.json({ message: 'Document deleted' });
  } catch (err) { next(err); }
};

const verify = async (req, res, next) => {
  try {
    // TODO: Admin marks document as verified
    res.json({ message: 'Document verified' });
  } catch (err) { next(err); }
};

module.exports = { upload, getById, remove, verify };
