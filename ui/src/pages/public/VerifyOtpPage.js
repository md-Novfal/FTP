import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Paper, Alert } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp, selectAuthLoading, selectAuthError } from '../../store/slices/authSlice';

// ---------------------------------------------------------------------------
// [FIREBASE_ENABLE] Uncomment the imports below when Firebase is configured.
//
// Prerequisites:
//   1. cd ui && npm install firebase
//   2. Configure ui/src/config/firebase.js (see that file for full instructions)
//   3. Set REACT_APP_FIREBASE_* env vars in ui/.env
//   4. Enable Phone auth in Firebase Console → Authentication → Sign-in method
//   5. Uncomment all [FIREBASE_ENABLE] blocks in this file
// ---------------------------------------------------------------------------
// import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
// import { firebaseAuth } from '../../config/firebase';

function VerifyOtpPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const phone = location.state?.phone || '';

  // eslint-disable-next-line no-unused-vars
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [localError, setLocalError] = useState('');

  // ---------------------------------------------------------------------------
  // [FIREBASE_ENABLE] Uncomment to store the Firebase confirmation result.
  // signInWithPhoneNumber() returns this; it's used to verify the code.
  // ---------------------------------------------------------------------------
  // const [confirmationResult, setConfirmationResult] = useState(null);

  // ---------------------------------------------------------------------------
  // [FIREBASE_ENABLE] Uncomment this function to send OTP via Firebase.
  //
  // FLOW: Frontend → Firebase (no backend involved)
  //   1. Create an invisible RecaptchaVerifier (required by Firebase Phone Auth).
  //   2. Call signInWithPhoneNumber() — Firebase sends the SMS directly.
  //   3. Store the confirmationResult for use when verifying the code.
  // ---------------------------------------------------------------------------
  // const handleSendOtp = async () => {
  //   try {
  //     setSendingOtp(true);
  //     setLocalError('');
  //
  //     // Invisible reCAPTCHA — attaches to the send-otp button element
  //     if (!window.recaptchaVerifier) {
  //       window.recaptchaVerifier = new RecaptchaVerifier(firebaseAuth, 'send-otp-button', {
  //         size: 'invisible',
  //         callback: () => {
  //           // reCAPTCHA solved — signInWithPhoneNumber will proceed
  //         },
  //         'expired-callback': () => {
  //           setLocalError('reCAPTCHA expired. Please try again.');
  //         },
  //       });
  //     }
  //
  //     const result = await signInWithPhoneNumber(firebaseAuth, phone, window.recaptchaVerifier);
  //     setConfirmationResult(result);
  //     setOtpSent(true);
  //   } catch (err) {
  //     console.error('Firebase OTP send error:', err);
  //
  //     // User-friendly error messages for common Firebase errors
  //     const messages = {
  //       'auth/invalid-phone-number': 'Invalid phone number format. Use E.164 format (e.g. +919876543210).',
  //       'auth/too-many-requests': 'Too many attempts. Please wait a few minutes and try again.',
  //       'auth/quota-exceeded': 'SMS quota exceeded. Please try again later.',
  //     };
  //     setLocalError(messages[err.code] || err.message || 'Failed to send OTP. Please try again.');
  //
  //     // Reset reCAPTCHA on failure so the user can retry
  //     if (window.recaptchaVerifier) {
  //       window.recaptchaVerifier.clear();
  //       window.recaptchaVerifier = null;
  //     }
  //   } finally {
  //     setSendingOtp(false);
  //   }
  // };

  // ---------------------------------------------------------------------------
  // [FIREBASE_ENABLE] Uncomment this function to verify the OTP code.
  //
  // FLOW: Frontend → Firebase → then Frontend → Backend (activate account)
  //   1. User enters the 6-digit code from SMS.
  //   2. confirmationResult.confirm(code) — Firebase verifies the code directly.
  //   3. On success, we call our backend POST /auth/verify-otp with { phone }
  //      to activate the user account and get a JWT.
  //   4. No Firebase token is sent to the backend — verification is frontend-only.
  // ---------------------------------------------------------------------------
  // const handleVerifyOtp = async (data) => {
  //   try {
  //     setLocalError('');
  //
  //     if (!confirmationResult) {
  //       setLocalError('Please send the OTP first.');
  //       return;
  //     }
  //
  //     // Step 1: Verify OTP code with Firebase (frontend ↔ Firebase)
  //     await confirmationResult.confirm(data.otp);
  //
  //     // Step 2: Tell backend to activate the user (frontend → backend)
  //     const result = await dispatch(verifyOtp({ phone }));
  //
  //     if (verifyOtp.fulfilled.match(result)) {
  //       // verifyOtp returns a JWT + user — authSlice stores them automatically.
  //       // Navigate to the user's dashboard.
  //       const role = result.payload?.user?.role;
  //       navigate(role ? `/${role}` : '/login');
  //     }
  //   } catch (err) {
  //     console.error('OTP verification error:', err);
  //
  //     const messages = {
  //       'auth/invalid-verification-code': 'Invalid OTP code. Please check and try again.',
  //       'auth/code-expired': 'OTP has expired. Please request a new one.',
  //       'auth/session-expired': 'Session expired. Please request a new OTP.',
  //     };
  //     setLocalError(messages[err.code] || err.message || 'Verification failed. Please try again.');
  //   }
  // };

  // ---------------------------------------------------------------------------
  // Placeholder submit — used until Firebase is enabled.
  // When Firebase is configured, replace the form below with the commented-out
  // JSX block at the bottom of this component.
  // ---------------------------------------------------------------------------
  const onSubmit = async (data) => {
    const result = await dispatch(verifyOtp({ phone, otp: data.otp }));
    if (verifyOtp.fulfilled.match(result)) {
      const role = result.payload?.user?.role;
      navigate(role ? (role === 'super_admin' ? '/admin' : `/${role}`) : '/login');
    }
  };

  // Redirect if no phone was passed from registration
  if (!phone) {
    return (
      <Container maxWidth="xs">
        <Box sx={{ mt: 10 }}>
          <Alert severity="warning">No phone number provided. Please register first.</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 10 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={700} mb={1} textAlign="center">
            Verify OTP
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3} textAlign="center">
            {otpSent
              ? `Enter the 6-digit code sent to ${phone}`
              : `We will send a verification code to ${phone}`}
          </Typography>

          {(error || localError) && (
            <Alert severity="error" sx={{ mb: 2 }}>{localError || error}</Alert>
          )}

          {/* ================================================================ */}
          {/* [FIREBASE_ENABLE]                                                */}
          {/* When Firebase is configured, DELETE the placeholder form below   */}
          {/* and UNCOMMENT this entire JSX block:                             */}
          {/*                                                                  */}
          {/* {!otpSent ? (                                                    */}
          {/*   <Button                                                        */}
          {/*     id="send-otp-button"                                         */}
          {/*     variant="contained"                                          */}
          {/*     fullWidth                                                    */}
          {/*     size="large"                                                 */}
          {/*     onClick={handleSendOtp}                                      */}
          {/*     disabled={sendingOtp}                                        */}
          {/*   >                                                              */}
          {/*     {sendingOtp ? 'Sending OTP...' : 'Send OTP'}                 */}
          {/*   </Button>                                                      */}
          {/* ) : (                                                            */}
          {/*   <Box component="form"                                          */}
          {/*        onSubmit={handleSubmit(handleVerifyOtp)}                   */}
          {/*        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} */}
          {/*   >                                                              */}
          {/*     <TextField                                                   */}
          {/*       label="OTP Code"                                           */}
          {/*       {...register('otp', {                                      */}
          {/*         required: 'OTP is required',                             */}
          {/*         pattern: {                                                */}
          {/*           value: /^[0-9]{6}$/,                                   */}
          {/*           message: 'Enter a 6-digit code',                       */}
          {/*         },                                                       */}
          {/*       })}                                                        */}
          {/*       error={!!errors.otp}                                       */}
          {/*       helperText={errors.otp?.message}                           */}
          {/*       fullWidth                                                  */}
          {/*       inputProps={{ maxLength: 6, inputMode: 'numeric' }}        */}
          {/*       autoFocus                                                  */}
          {/*     />                                                           */}
          {/*     <Button type="submit" variant="contained" fullWidth          */}
          {/*             disabled={loading} size="large"                      */}
          {/*     >                                                            */}
          {/*       {loading ? 'Verifying...' : 'Verify OTP'}                  */}
          {/*     </Button>                                                    */}
          {/*     <Button variant="text" onClick={handleSendOtp}              */}
          {/*             disabled={sendingOtp} size="small"                   */}
          {/*     >                                                            */}
          {/*       {sendingOtp ? 'Sending...' : 'Resend OTP'}                 */}
          {/*     </Button>                                                    */}
          {/*   </Box>                                                         */}
          {/* )}                                                               */}
          {/* ================================================================ */}

          {/* DEV placeholder form — remove when Firebase is enabled */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Alert severity="info" sx={{ mb: 1 }}>
              Dev mode: enter <strong>123456</strong> as the OTP code.
            </Alert>
            <TextField
              label="OTP Code"
              {...register('otp', {
                required: 'OTP is required',
                pattern: { value: /^[0-9]{5,6}$/, message: 'Enter a 5 or 6-digit code' },
              })}
              error={!!errors.otp}
              helperText={errors.otp?.message}
              fullWidth
              inputProps={{ maxLength: 6, inputMode: 'numeric' }}
              autoFocus
            />
            <Button type="submit" variant="contained" fullWidth disabled={loading} size="large">
              {loading ? 'Verifying...' : 'Verify'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default VerifyOtpPage;
