const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller');
const { authenticate, authorize } = require('../middlewares/auth');

// Agency dashboard - GET /agency/dashboard
router.get('/dashboard', authenticate, authorize('agency'), applicationController.getAgencyDashboard);

// Agency applications - GET /agency/applications
router.get('/applications', authenticate, authorize('agency'), applicationController.getAgencyApplications);

module.exports = router;
