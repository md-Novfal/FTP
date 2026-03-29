const User = require('../models/user.model');
const logger = require('../config/logger');

// ===========================================================================
// GET /users  — Paginated user list (admin / super_admin)
// ===========================================================================
const getAll = async (req, res, next) => {
  try {
    const { role, status, search, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (role) filter.role = role;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-passwordHash -otpCode -otpExpiry')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(filter),
    ]);

    res.json({ users, total });
  } catch (err) { next(err); }
};

// ===========================================================================
// POST /users  — Admin creates a user (delegate to auth/create-user ideally)
// ===========================================================================
const create = async (req, res, next) => {
  try {
    res.status(501).json({ message: 'Use POST /auth/create-user instead.' });
  } catch (err) { next(err); }
};

// ===========================================================================
// GET /users/:id  — Get user profile
// ===========================================================================
const getById = async (req, res, next) => {
  try {
    // Students can only view their own profile
    if (req.user.role === 'student' && req.params.id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const user = await User.findById(req.params.id)
      .select('-passwordHash -otpCode -otpExpiry');

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ user });
  } catch (err) { next(err); }
};

// ===========================================================================
// PUT /users/:id  — Update user profile
// ===========================================================================
const update = async (req, res, next) => {
  try {
    // Students can only update themselves
    if (req.user.role === 'student' && req.params.id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const allowed = ['email', 'phone'];
    // Admin/super_admin can also update role and status
    if (['admin', 'super_admin'].includes(req.user.role)) {
      allowed.push('role', 'status');
    }

    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true })
      .select('-passwordHash -otpCode -otpExpiry');

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    logger.info(`User updated: ${user.username} by ${req.user.id}`);
    res.json({ message: 'User updated.', user });
  } catch (err) { next(err); }
};

// ===========================================================================
// DELETE /users/:id  — Deactivate user (soft delete)
// ===========================================================================
const remove = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    user.status = 'inactive';
    await user.save();

    logger.info(`User deactivated: ${user.username} by admin=${req.user.id}`);
    res.json({ message: 'User deactivated.' });
  } catch (err) { next(err); }
};

module.exports = { getAll, create, getById, update, remove };
