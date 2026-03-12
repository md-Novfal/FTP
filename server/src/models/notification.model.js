const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: String,
  message: String,
  readAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
