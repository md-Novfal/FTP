const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const documentController = require('../controllers/document.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const VALID_DOC_TYPES = [
  'aadhar', 'pan', 'passport', 'birth_certificate',
  'tenth_marksheet', 'twelfth_marksheet', 'neet_scorecard', 'ug_degree', 'other',
];

// Upload a document (file + metadata)
router.post(
  '/',
  authenticate,
  upload.single('file'),
  [
    body('applicationId').isMongoId().withMessage('Valid application ID is required.'),
    body('docType').isIn(VALID_DOC_TYPES).withMessage(`docType must be one of: ${VALID_DOC_TYPES.join(', ')}`),
  ],
  documentController.upload,
);

// Get document metadata + signed download URL
router.get('/:id', authenticate, documentController.getById);

// List all documents for an application
router.get(
  '/application/:applicationId',
  authenticate,
  documentController.getByApplication,
);

// Delete a document
router.delete('/:id', authenticate, documentController.remove);

// Admin verifies a document
router.put(
  '/:id/verify',
  authenticate,
  authorize('admin', 'super_admin'),
  documentController.verify,
);

module.exports = router;
