const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller');
const { authenticate, authorize } = require('../middlewares/auth');

router.post('/', authenticate, applicationController.create);
router.get('/', authenticate, applicationController.getAll);
router.get('/:id', authenticate, applicationController.getById);
router.put('/:id/status', authenticate, authorize('admin'), applicationController.updateStatus);
router.get('/:id/documents', authenticate, applicationController.getDocuments);

module.exports = router;
