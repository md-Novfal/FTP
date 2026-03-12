const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const { authenticate } = require('../middlewares/auth');

router.post('/messages', authenticate, chatController.sendMessage);
router.get('/messages', authenticate, chatController.getMessages);

module.exports = router;
