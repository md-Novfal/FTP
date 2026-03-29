const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate, authorize } = require('../middlewares/auth');

// ---------------------------------------------------------------------------
// Validation chains — reusable per-field validators
// ---------------------------------------------------------------------------
const usernameRule = body('username')
  .trim()
  .notEmpty().withMessage('Username is required.')
  .isLength({ min: 3, max: 30 }).withMessage('Username must be 3–30 characters.')
  .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username may only contain letters, numbers, and underscores.');

const passwordRule = body('password')
  .notEmpty().withMessage('Password is required.')
  .isLength({ min: 8 }).withMessage('Password must be at least 8 characters.');

const emailRule = body('email')
  .optional({ values: 'falsy' })
  .trim()
  .isEmail().withMessage('Invalid email address.')
  .normalizeEmail();

const phoneRule = body('phone')
  .optional({ values: 'falsy' })
  .trim()
  .matches(/^\+?[0-9]{7,15}$/).withMessage('Phone must be 7–15 digits, optionally prefixed with +.');

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

// Student self-registration
router.post(
  '/register',
  [
    usernameRule,
    emailRule,
    phoneRule,
    passwordRule,
    body('phone').notEmpty().withMessage('Phone number is required for student registration.'),
  ],
  authController.register,
);

// Login (username + password)
router.post(
  '/login',
  [
    body('username').trim().notEmpty().withMessage('Username is required.'),
    body('password').notEmpty().withMessage('Password is required.'),
  ],
  authController.login,
);

// Admin / Agency creation by super_admin (or admin for agency)
router.post(
  '/create-user',
  authenticate,
  authorize('super_admin', 'admin'),
  [
    usernameRule,
    emailRule,
    phoneRule,
    passwordRule,
    body('role')
      .notEmpty().withMessage('Role is required.')
      .isIn(['admin', 'agency']).withMessage('Role must be admin or agency.'),
  ],
  authController.createUser,
);

// Activate user after frontend Firebase OTP verification
router.post(
  '/verify-otp',
  [
    body('phone').trim().notEmpty().withMessage('Phone number is required.'),
  ],
  authController.verifyOtp,
);

// OTP resend (handled on frontend via Firebase JS SDK)
router.post('/resend-otp', authController.resendOtp);

// Password reset
router.post('/password-reset', authController.requestPasswordReset);
router.post('/password-reset/confirm', authController.confirmPasswordReset);

// Logout (authenticated)
router.post('/logout', authenticate, authController.logout);

module.exports = router;
