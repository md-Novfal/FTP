const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const register = async (req, res, next) => {
  try {
    // TODO: Validate input, create student user, send OTP
    res.status(201).json({ message: 'Registration initiated. Please verify OTP.' });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Identifier and password are required.' });
    }

    // Match by email or phone
    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { phone: identifier }],
    });

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
  verifyOtp,
  resendOtp,
  requestPasswordReset,
  confirmPasswordReset,
  logout,
};
