// Auth Controller — implement service logic in services/auth.service.js

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
    // TODO: Validate credentials, return JWT token
    res.status(200).json({ message: 'Login successful', token: '' });
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
