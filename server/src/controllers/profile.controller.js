const { validationResult } = require('express-validator');
const Profile = require('../models/profile.model');
const logger = require('../config/logger');

const checkValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: errors.array()[0].msg });
    return false;
  }
  return true;
};

// ===========================================================================
// GET /profile  — Get current user's profile
// ===========================================================================
const getMyProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      // Return empty structure so the frontend can populate the form
      profile = { userId: req.user.id };
    }
    res.json({ profile });
  } catch (err) { next(err); }
};

// ===========================================================================
// PUT /profile  — Create or update current user's profile
// ===========================================================================
const updateMyProfile = async (req, res, next) => {
  try {
    if (!checkValidation(req, res)) return;

    const allowed = [
      'firstName', 'lastName', 'dateOfBirth', 'fatherName', 'motherName',
      'aadharNumber', 'panNumber', 'passportNumber', 'passportExpiry',
      'address', 'city', 'state', 'country', 'pincode',
      'tenthPercentage', 'twelfthPercentage', 'neetScore',
      'ugDegree', 'ugPercentage',
      'preferredCountries', 'preferredCourses',
    ];

    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      { $set: updates },
      { new: true, upsert: true, runValidators: true },
    );

    logger.info(`Profile updated for user=${req.user.id}`);
    res.json({ message: 'Profile updated.', profile });
  } catch (err) { next(err); }
};

// ===========================================================================
// GET /profile/:userId  — Admin views any user's profile
// ===========================================================================
const getProfileByUser = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId });
    res.json({ profile: profile || { userId: req.params.userId } });
  } catch (err) { next(err); }
};

module.exports = { getMyProfile, updateMyProfile, getProfileByUser };
