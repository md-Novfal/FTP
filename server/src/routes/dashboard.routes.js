const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller');
const { authenticate, authorize } = require('../middlewares/auth');

// Student dashboard - GET /dashboard
router.get('/', authenticate, authorize('student'), applicationController.getStudentDashboard);

module.exports = router;
