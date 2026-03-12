const mongoose = require('mongoose');

const commissionSchema = new mongoose.Schema({
  agencyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  amount: Number,
  status: { type: String, enum: ['pending', 'approved', 'paid'], default: 'pending' },
  approvedAt: Date,
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Commission', commissionSchema);
