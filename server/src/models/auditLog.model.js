const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: String,
  resource: String,
  resourceId: mongoose.Schema.Types.ObjectId,
  ipAddress: String,
  userAgent: String,
}, { timestamps: { createdAt: true, updatedAt: false } });

module.exports = mongoose.model('AuditLog', auditLogSchema);
