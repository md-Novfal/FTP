const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate, authorize } = require('../middlewares/auth');

router.use(authenticate, authorize('admin', 'super_admin'));

router.get('/analytics', adminController.getAnalytics);
router.get('/reports', adminController.getReports);
router.get('/audit-logs', adminController.getAuditLogs);

module.exports = router;
