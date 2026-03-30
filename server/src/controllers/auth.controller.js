const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/user.model");
const { sendWelcomeCredentialsEmail } = require("../utils/mailer");
const logger = require("../config/logger");

const JWT_SECRET = process.env.JWT_SECRET || "changeme";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const SALT_ROUNDS = 10;

// ---------------------------------------------------------------------------
// Helper: return first validation error (if any) from express-validator
// ---------------------------------------------------------------------------
const checkValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: errors.array()[0].msg });
    return false;
  }
  return true;
};

// ---------------------------------------------------------------------------
// Helper: generate a signed JWT for a user
// ---------------------------------------------------------------------------
const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

// ===========================================================================
// POST /auth/register  — Student self-registration
// ===========================================================================
const register = async (req, res, next) => {
  try {
    if (!checkValidation(req, res)) return;

    const { username, email, phone, password } = req.body;

    // Check if username, email, or phone is already taken
    const existing = await User.findOne({
      $or: [
        { username: username.toLowerCase() },
        ...(email ? [{ email: email.toLowerCase() }] : []),
        ...(phone ? [{ phone }] : []),
      ],
    });

    if (existing) {
      if (existing.username === username.toLowerCase()) {
        return res.status(409).json({ error: "Username is already taken." });
      }
      if (email && existing.email === email.toLowerCase()) {
        return res.status(409).json({ error: "Email is already registered." });
      }
      if (phone && existing.phone === phone) {
        return res
          .status(409)
          .json({ error: "Phone number is already registered." });
      }
      return res.status(409).json({ error: "User already exists." });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      username: username.toLowerCase(),
      email: email ? email.toLowerCase() : undefined,
      phone: phone || undefined,
      passwordHash,
      role: "student",
      status: "pending", // Stays pending until phone OTP verification via Firebase on the frontend
    });

    logger.info(`Student registered: ${user.username} (id=${user._id})`);

    res.status(201).json({
      message:
        "Registration successful. Please verify your phone number via OTP.",
      user: {
        id: user._id,
        username: user.username,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(409).json({ error: `${field} is already taken.` });
    }
    logger.error("Registration error:", err);
    next(err);
  }
};

// ===========================================================================
// POST /auth/login  — Username + password authentication
// ===========================================================================
const login = async (req, res, next) => {
  try {
    if (!checkValidation(req, res)) return;

    const { username, password } = req.body;

    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    if (user.status !== "active") {
      return res
        .status(403)
        .json({
          error:
            "Account is not active. Please verify your phone number or contact support.",
        });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = signToken(user);

    logger.info(`Login: ${user.username} (role=${user.role})`);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ===========================================================================
// POST /auth/create-user  — Super Admin creates admin / agency accounts
// ===========================================================================
const createUser = async (req, res, next) => {
  try {
    if (!checkValidation(req, res)) return;

    const { username, email, phone, password, role } = req.body;
    const requesterRole = req.user.role;

    // --- Role-based access control ---
    if (requesterRole === "super_admin") {
      if (!["admin", "agency"].includes(role)) {
        return res
          .status(403)
          .json({
            error: "Super Admin can only create Admin or Agency roles.",
          });
      }
    } else if (requesterRole === "admin") {
      if (role !== "agency") {
        return res
          .status(403)
          .json({ error: "Admins can only create Agency roles." });
      }
    } else {
      return res
        .status(403)
        .json({ error: "Access denied. Unauthorized role creation." });
    }

    // --- Check for existing user ---
    const existing = await User.findOne({
      $or: [
        { username: username.toLowerCase() },
        ...(email ? [{ email: email.toLowerCase() }] : []),
        ...(phone ? [{ phone }] : []),
      ],
    });
    console.log(existing);
    if (existing) {
      if (existing.username === username.toLowerCase()) {
        return res.status(409).json({ error: "Username already exists." });
      }

      if (email && existing.email === email.toLowerCase()) {
        return res.status(409).json({ error: "Email already registered." });
      }

      if (phone && existing.phone === phone) {
        return res
          .status(409)
          .json({ error: "Mobile number already registered." });
      }
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      username: username.toLowerCase(),
      email: email ? email.toLowerCase() : undefined,
      phone: phone || undefined,
      passwordHash,
      role,
      status: "active", // Admin-created accounts are active immediately
    });

    // --- Send welcome/credentials email via Nodemailer ---
    if (email) {
      try {
        await sendWelcomeCredentialsEmail({ email, username, password, role });
        logger.info(`Welcome email sent to ${email} for new ${role} account.`);
      } catch (emailErr) {
        // Email failure should NOT block account creation
        logger.error(`Failed to send welcome email to ${email}:`, emailErr);
      }
    }

    logger.info(
      `User created: ${user.username} (role=${role}) by ${requesterRole}`,
    );

    res.status(201).json({
      message: `${role.replace("_", " ")} account created successfully.${email ? " Welcome email sent." : ""}`,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(409).json({ error: `${field} is already taken.` });
    }
    next(err);
  }
};

// ===========================================================================
// POST /auth/verify-otp  — Activate user after frontend Firebase OTP success
// ===========================================================================
//
// OTP FLOW (entirely frontend ↔ Firebase, NO backend involvement in OTP):
//
//   1. Frontend calls signInWithPhoneNumber() via Firebase JS SDK → Firebase sends SMS.
//   2. User enters the 6-digit code on the frontend.
//   3. Frontend calls confirmationResult.confirm(code) → Firebase verifies directly.
//   4. On success, frontend calls this endpoint with { phone } to activate the account.
//   5. Backend looks up the pending user by phone and sets status = 'active'.
//   6. Backend returns a JWT so the user is logged in immediately.
//
// Security note: This endpoint trusts that the frontend has completed Firebase
// phone verification. For additional server-side assurance, you can optionally
// pass the Firebase ID token and verify it with firebase-admin (see comments below).
// ===========================================================================
const verifyOtp = async (req, res, next) => {
  try {
    if (!checkValidation(req, res)) return;

    const { phone, otp } = req.body;

    // -----------------------------------------------------------------
    // DEV STATIC OTP — Remove this block when Firebase OTP is enabled.
    // Accepts "12345" as a valid OTP for development/testing purposes.
    // -----------------------------------------------------------------
    const DEV_STATIC_OTP = "123456";
    if (otp !== DEV_STATIC_OTP) {
      return res.status(400).json({ error: "Invalid OTP code." });
    }
    // -----------------------------------------------------------------

    // Find the pending user by phone number
    const user = await User.findOne({ phone });

    if (!user) {
      return res
        .status(404)
        .json({ error: "No account found for this phone number." });
    }

    if (user.status === "active") {
      return res.status(400).json({ error: "Account is already verified." });
    }

    // -----------------------------------------------------------------
    // [OPTIONAL FIREBASE SERVER-SIDE VERIFICATION]
    //
    // If you want the backend to also verify the Firebase ID token for
    // extra security (defense in depth), you can:
    //   1. npm install firebase-admin (in server/)
    //   2. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in server .env
    //   3. Uncomment the block below and remove the DEV STATIC OTP block above.
    //
    // const admin = require('firebase-admin');
    // const { firebaseIdToken } = req.body;
    // if (!firebaseIdToken) {
    //   return res.status(400).json({ error: 'Firebase ID token is required.' });
    // }
    // const decoded = await admin.auth().verifyIdToken(firebaseIdToken);
    // if (decoded.phone_number !== phone) {
    //   return res.status(400).json({ error: 'Phone number mismatch.' });
    // }
    // user.firebaseUid = decoded.uid;
    // -----------------------------------------------------------------

    // Activate the user
    user.status = "active";
    await user.save();

    const token = signToken(user);

    logger.info(
      `Phone verified and account activated: ${user.username} (phone=${phone})`,
    );

    res.status(200).json({
      message: "Phone verified successfully. Account is now active.",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: "active",
      },
    });
  } catch (err) {
    next(err);
  }
};

// ===========================================================================
// POST /auth/resend-otp
// ===========================================================================
//
// OTP resend is handled entirely on the frontend via Firebase JS SDK.
// The frontend simply calls signInWithPhoneNumber() again.
// This endpoint exists for future audit logging / rate-limiting.
// ===========================================================================
const resendOtp = async (req, res, next) => {
  try {
    res.status(200).json({
      message:
        "OTP resend is handled on the frontend via Firebase. Call signInWithPhoneNumber() again.",
    });
  } catch (err) {
    next(err);
  }
};

// ===========================================================================
// POST /auth/password-reset
// ===========================================================================
const requestPasswordReset = async (req, res, next) => {
  try {
    // TODO: Implement password reset — send reset link via Nodemailer
    res.status(501).json({ message: "Password reset is not yet implemented." });
  } catch (err) {
    next(err);
  }
};

// ===========================================================================
// POST /auth/password-reset/confirm
// ===========================================================================
const confirmPasswordReset = async (req, res, next) => {
  try {
    // TODO: Validate reset token, update password
    res
      .status(501)
      .json({ message: "Password reset confirmation is not yet implemented." });
  } catch (err) {
    next(err);
  }
};

// ===========================================================================
// POST /auth/logout
// ===========================================================================
const logout = async (req, res, next) => {
  try {
    // Stateless JWT — client simply discards the token.
    res.status(200).json({ message: "Logged out successfully." });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  createUser,
  verifyOtp,
  resendOtp,
  requestPasswordReset,
  confirmPasswordReset,
  logout,
};
