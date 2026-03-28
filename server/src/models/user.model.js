const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, trim: true, lowercase: true },
  email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  phone: { type: String, unique: true, sparse: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['super_admin', 'admin', 'agency', 'student'], required: true },
  status: { type: String, enum: ['pending', 'active', 'inactive'], default: 'pending' },
  otpCode: String,
  otpExpiry: Date,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
