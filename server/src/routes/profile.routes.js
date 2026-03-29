const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const { authenticate, authorize } = require('../middlewares/auth');

// Validation rules for profile fields
const aadharRule = body('aadharNumber')
  .optional({ values: 'falsy' })
  .trim()
  .matches(/^\d{12}$/)
  .withMessage('Aadhar number must be exactly 12 digits.');

const panRule = body('panNumber')
  .optional({ values: 'falsy' })
  .trim()
  .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
  .withMessage('PAN number format is invalid (e.g., ABCDE1234F).');

const passportRule = body('passportNumber')
  .optional({ values: 'falsy' })
  .trim()
  .isLength({ min: 5, max: 20 })
  .withMessage('Passport number must be 5-20 characters.');

const pincodeRule = body('pincode')
  .optional({ values: 'falsy' })
  .trim()
  .matches(/^\d{6}$/)
  .withMessage('Pincode must be exactly 6 digits.');

router.get('/', authenticate, profileController.getMyProfile);
router.put(
  '/',
  authenticate,
  [aadharRule, panRule, passportRule, pincodeRule],
  profileController.updateMyProfile
);
router.get('/:userId', authenticate, authorize('admin', 'super_admin'), profileController.getProfileByUser);

module.exports = router;
