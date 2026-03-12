const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOtp);
router.post('/resend-otp', authController.resendOtp);
router.post('/password-reset', authController.requestPasswordReset);
router.post('/password-reset/confirm', authController.confirmPasswordReset);
router.post('/logout', authenticate, authController.logout);

module.exports = router;
