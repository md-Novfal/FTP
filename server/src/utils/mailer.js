/**
 * Nodemailer Email Utility
 * ========================
 * Handles all outbound email operations for the FTO.EDU platform.
 *
 * Required environment variables:
 *   SMTP_HOST     - SMTP server hostname (e.g. smtp.gmail.com)
 *   SMTP_PORT     - SMTP port (587 for TLS, 465 for SSL)
 *   SMTP_USER     - SMTP authentication username / email
 *   SMTP_PASS     - SMTP authentication password or app-specific password
 *   SMTP_FROM     - "From" address shown in outgoing emails (e.g. noreply@fto.edu)
 */

const nodemailer = require('nodemailer');
const logger = require('../config/logger');

// ---------------------------------------------------------------------------
// Transporter — created once, reused across the process lifetime.
// Falls back to a no-op in test/CI environments where SMTP is not configured.
// ---------------------------------------------------------------------------
let transporter = null;

const initTransporter = () => {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    logger.warn('SMTP credentials not configured — emails will NOT be sent.');
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT, 10) || 587,
    secure: parseInt(SMTP_PORT, 10) === 465, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  logger.info(`Nodemailer transporter initialised (host=${SMTP_HOST})`);
  return transporter;
};

// ---------------------------------------------------------------------------
// sendMail — generic helper; all specific email functions delegate here.
// ---------------------------------------------------------------------------
const sendMail = async ({ to, subject, html, text }) => {
  const t = initTransporter();
  if (!t) {
    logger.warn(`Email skipped (no SMTP config): to=${to}, subject="${subject}"`);
    return null;
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  const info = await t.sendMail({ from, to, subject, html, text });
  logger.info(`Email sent: messageId=${info.messageId}, to=${to}`);
  return info;
};

// ---------------------------------------------------------------------------
// sendWelcomeCredentialsEmail
// Sent when a super_admin creates a new admin or agency account.
// ---------------------------------------------------------------------------
const sendWelcomeCredentialsEmail = async ({ email, username, password, role }) => {
  const loginUrl = process.env.CLIENT_URL
    ? `${process.env.CLIENT_URL}/login`
    : 'http://localhost:3000/login';

  const subject = `Welcome to FTO.EDU — Your ${role.replace('_', ' ')} account is ready`;

  const html = `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #1a73e8; margin-bottom: 4px;">Welcome to FTO.EDU</h2>
      <p style="color: #555; margin-top: 0;">Your <strong>${role.replace('_', ' ')}</strong> account has been created.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p><strong>Username:</strong> ${username}</p>
      <p><strong>Temporary Password:</strong> ${password}</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p>Please log in and change your password immediately:</p>
      <a href="${loginUrl}" style="display: inline-block; padding: 10px 24px; background-color: #1a73e8; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600;">Log In Now</a>
      <p style="margin-top: 24px; font-size: 12px; color: #999;">If you did not expect this email, please contact support.</p>
    </div>
  `;

  const text = `Welcome to FTO.EDU\n\nYour ${role} account has been created.\n\nUsername: ${username}\nTemporary Password: ${password}\n\nLog in at: ${loginUrl}\n\nPlease change your password immediately.`;

  return sendMail({ to: email, subject, html, text });
};

module.exports = {
  sendMail,
  sendWelcomeCredentialsEmail,
};
