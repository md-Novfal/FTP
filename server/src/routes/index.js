const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const applicationRoutes = require('./application.routes');
const documentRoutes = require('./document.routes');
const notificationRoutes = require('./notification.routes');
const adminRoutes = require('./admin.routes');
const commissionRoutes = require('./commission.routes');
const chatRoutes = require('./chat.routes');
const profileRoutes = require('./profile.routes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/profile', profileRoutes);
router.use('/applications', applicationRoutes);
router.use('/documents', documentRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);
router.use('/commissions', commissionRoutes);
router.use('/chat', chatRoutes);

module.exports = router;
