const getAll = async (req, res, next) => {
  try {
    // TODO: Paginated list of users with filters
    res.json({ users: [], total: 0 });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    // TODO: Admin creates agency or student account
    res.status(201).json({ message: 'User created' });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    // TODO: Return user profile (own or admin)
    res.json({ user: null });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    // TODO: Update profile fields
    res.json({ message: 'User updated' });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    // TODO: Soft-delete user (admin only)
    res.json({ message: 'User deleted' });
  } catch (err) { next(err); }
};

module.exports = { getAll, create, getById, update, remove };
