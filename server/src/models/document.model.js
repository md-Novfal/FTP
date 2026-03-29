const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  docType: {
    type: String,
    enum: ['aadhar', 'pan', 'passport', 'birth_certificate',
           'tenth_marksheet', 'twelfth_marksheet', 'neet_scorecard', 'ug_degree', 'other'],
    required: true,
  },
  fileName: { type: String, required: true },
  gcsKey: { type: String, required: true },
  mimeType: { type: String, required: true },
  fileSize: { type: Number, required: true },
  verifiedByAdmin: { type: Boolean, default: false },
  verifiedAt: Date,
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

documentSchema.index({ applicationId: 1, docType: 1 });
documentSchema.index({ uploadedBy: 1 });

module.exports = mongoose.model('Document', documentSchema);
