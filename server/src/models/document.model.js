const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  docType: {
    type: String,
    enum: ['aadhar', 'pan', 'passport', 'birth_certificate',
           'tenth_marksheet', 'twelfth_marksheet', 'neet_scorecard', 'ug_degree', 'other'],
    required: true,
  },
  fileName: String,
  s3Key: String,
  mimeType: String,
  verifiedByAdmin: { type: Boolean, default: false },
  verifiedAt: Date,
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
