import api from './api';

const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (credentials) => api.post('/auth/login', credentials),
  verifyOtp: (data) => api.post('/auth/verify-otp', data),
  resendOtp: (data) => api.post('/auth/resend-otp', data),
  requestPasswordReset: (data) => api.post('/auth/password-reset', data),
  confirmPasswordReset: (data) => api.post('/auth/password-reset/confirm', data),
  logout: () => api.post('/auth/logout'),
};

export default authService;
