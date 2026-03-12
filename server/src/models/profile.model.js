const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
  fatherName: String,
  motherName: String,
  aadharNumber: String,
  panNumber: String,
  passportNumber: String,
  passportExpiry: Date,
  address: String,
  city: String,
  state: String,
  country: String,
  pincode: String,
  // Academic
  tenthPercentage: Number,
  twelfthPercentage: Number,
  neetScore: Number,
  ugDegree: String,
  ugPercentage: Number,
  // Preferences
  preferredCountries: [String],
  preferredCourses: [String],
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
