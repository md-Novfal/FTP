const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, trim: true, lowercase: true },
  email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  phone: { type: String, unique: true, sparse: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['super_admin', 'admin', 'agency', 'student'], required: true },
  status: { type: String, enum: ['pending', 'active', 'inactive'], default: 'pending' },

  // Legacy OTP fields (kept for backward compatibility; Firebase OTP is the primary flow)
  otpCode: String,
  otpExpiry: Date,

  // [FIREBASE_ENABLE] Stores the Firebase UID after successful phone verification.
  // This links the local user to their Firebase Auth identity.
  firebaseUid: { type: String, sparse: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
