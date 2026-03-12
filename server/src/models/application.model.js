const mongoose = require('mongoose');

const APPLICATION_STATUSES = [
  'apply', 'under_review', 'college_submitted', 'offer_letter',
  'interview', 'admission_letter', 'ministry_order', 'vfs',
  'visa', 'ticket', 'arrived', 'rejected', 'on_hold',
];

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  agencyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  universityName: String,
  courseName: String,
  countryName: String,
  status: { type: String, enum: APPLICATION_STATUSES, default: 'apply' },
  adminNote: String,
  submittedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
