const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const applicationController = require('../controllers/application.controller');
const { authenticate, authorize } = require('../middlewares/auth');

const APPLICATION_STATUSES = [
  'apply', 'under_review', 'college_submitted', 'offer_letter',
  'interview', 'admission_letter', 'ministry_order', 'vfs',
  'visa', 'ticket', 'arrived', 'rejected', 'on_hold',
];

router.post(
  '/',
  authenticate,
  [
    body('universityName').trim().notEmpty().withMessage('University name is required.'),
    body('courseName').trim().notEmpty().withMessage('Course name is required.'),
    body('countryName').trim().notEmpty().withMessage('Country name is required.'),
  ],
  applicationController.create,
);

router.get('/', authenticate, applicationController.getAll);
router.get('/:id', authenticate, applicationController.getById);

router.put(
  '/:id/status',
  authenticate,
  authorize('admin', 'super_admin', 'agency'),
  [
    body('status').isIn(APPLICATION_STATUSES).withMessage('Invalid status.'),
  ],
  applicationController.updateStatus,
);

router.put(
  '/:id/assign-agency',
  authenticate,
  authorize('admin', 'super_admin'),
  applicationController.assignAgency,
);

router.put(
  '/:id',
  authenticate,
  [
    body('universityName').optional().trim().notEmpty().withMessage('University name cannot be empty.'),
    body('courseName').optional().trim().notEmpty().withMessage('Course name cannot be empty.'),
    body('countryName').optional().trim().notEmpty().withMessage('Country name cannot be empty.'),
    body('status').optional().isIn(APPLICATION_STATUSES).withMessage('Invalid status.'),
  ],
  applicationController.update,
);

router.get('/:id/documents', authenticate, applicationController.getDocuments);

module.exports = router;
