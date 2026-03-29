/**
 * Firebase JS SDK — Client-Side Configuration
 * =============================================
 *
 * This file initialises the Firebase app and exports the auth instance
 * used for phone OTP verification (frontend ↔ Firebase directly).
 *
 * SETUP INSTRUCTIONS:
 *   1. Install the Firebase JS SDK:
 *        cd ui && npm install firebase
 *
 *   2. Go to Firebase Console → Project Settings → General → Your apps → Web app.
 *      Copy the firebaseConfig values.
 *
 *   3. Add these environment variables to ui/.env:
 *        REACT_APP_FIREBASE_API_KEY=your_api_key
 *        REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
 *        REACT_APP_FIREBASE_PROJECT_ID=your_project_id
 *        REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
 *        REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
 *        REACT_APP_FIREBASE_APP_ID=your_app_id
 *
 *   4. Enable "Phone" sign-in method in Firebase Console → Authentication → Sign-in method.
 *
 *   5. Uncomment all code below and the [FIREBASE_ENABLE] blocks in VerifyOtpPage.js.
 */

// ---------------------------------------------------------------------------
// [FIREBASE_ENABLE] Uncomment everything below once Firebase credentials are set
// ---------------------------------------------------------------------------

// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
//
// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
// };
//
// const firebaseApp = initializeApp(firebaseConfig);
// const firebaseAuth = getAuth(firebaseApp);
//
// export { firebaseApp, firebaseAuth };

// Placeholder exports so imports don't break while Firebase is disabled.
// Remove these once you uncomment the real exports above.
export const firebaseApp = null;
export const firebaseAuth = null;
