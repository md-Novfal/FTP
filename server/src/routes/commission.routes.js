const express = require('express');
const router = express.Router();
const commissionController = require('../controllers/commission.controller');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/', authenticate, authorize('admin', 'agency'), commissionController.getAll);
router.get('/reports', authenticate, authorize('admin', 'agency'), commissionController.getReports);

module.exports = router;
