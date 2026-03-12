const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  roomId: { type: String, required: true, index: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: String,
  readAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
