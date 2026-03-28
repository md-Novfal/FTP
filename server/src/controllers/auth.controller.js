const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const register = async (req, res, next) => {
  try {
    const { username, email, phone, password } = req.body;
    
    // Check if user already exists
    const existing = await User.findOne({ $or: [{ username }, { email }, { phone }] });
    if (existing) {
      return res.status(400).json({ error: 'User with this username, email, or phone already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      phone,
      passwordHash,
      role: 'student',
      status: 'pending', // Requires OTP verification for students
    });

    // TODO: Send OTP via Twilio
    res.status(201).json({ 
      message: 'Registration initiated. Please verify OTP.', 
      user: { id: user._id, username: user.username, role: user.role } 
    });
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { username, email, phone, password, role } = req.body;
    const requesterRole = req.user.role;

    // Role-based restrictions logic
    if (requesterRole === 'super_admin') {
      // super_admin can create 'admin' and 'agency'
      if (!['admin', 'agency'].includes(role)) {
        return res.status(403).json({ error: 'Super Admin can only create Admin or Agency roles.' });
      }
    } else if (requesterRole === 'admin') {
      // admin can only create 'agency'
      if (role !== 'agency') {
        return res.status(403).json({ error: 'Admins can only create Agency roles.' });
      }
    } else {
      return res.status(403).json({ error: 'Access denied. Unauthorized role creation.' });
    }

    // Check existing
    const existing = await User.findOne({ $or: [{ username }, { email }, { phone }] });
    if (existing) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      phone,
      passwordHash,
      role,
      status: 'active', // Direct creation by admin is active by default
    });

    res.status(201).json({
      message: `User created successfully as ${role}`,
      user: { id: user._id, username: user.username, role: user.role }
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    // Match by username
    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Account is not active.' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    next(err);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    // TODO: Verify OTP, activate user, return token
    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (err) {
    next(err);
  }
};

const resendOtp = async (req, res, next) => {
  try {
    // TODO: Resend OTP via Twilio
    res.status(200).json({ message: 'OTP resent successfully' });
  } catch (err) {
    next(err);
  }
};

const requestPasswordReset = async (req, res, next) => {
  try {
    // TODO: Send password reset email via SendGrid
    res.status(200).json({ message: 'Password reset email sent' });
  } catch (err) {
    next(err);
  }
};

const confirmPasswordReset = async (req, res, next) => {
  try {
    // TODO: Validate reset token, update password
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    // TODO: Invalidate token (blacklist or stateless)
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  createUser,
  verifyOtp,
  resendOtp,
  requestPasswordReset,
  confirmPasswordReset,
  logout,
};
