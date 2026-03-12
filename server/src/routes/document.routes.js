const express = require('express');
const router = express.Router();
const documentController = require('../controllers/document.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.post('/', authenticate, upload.single('file'), documentController.upload);
router.get('/:id', authenticate, documentController.getById);
router.delete('/:id', authenticate, documentController.remove);
router.put('/:id/verify', authenticate, authorize('admin'), documentController.verify);

module.exports = router;
