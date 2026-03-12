const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  phone: { type: String, required: true, unique: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'agency', 'student'], required: true },
  status: { type: String, enum: ['pending', 'active', 'inactive'], default: 'pending' },
  otpCode: String,
  otpExpiry: Date,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
