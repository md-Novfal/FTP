import React from 'react';
import { Container, Box, Typography, TextField, Button, Paper, Alert, Link as MuiLink } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { register as registerAction, selectAuthLoading, selectAuthError } from '../../store/slices/authSlice';

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    const result = await dispatch(registerAction({
      username: data.username.trim(),
      phone: data.phone.trim(),
      email: data.email?.trim() || undefined,
      password: data.password,
    }));
    if (registerAction.fulfilled.match(result)) {
      // Navigate to OTP verification with the phone number
      navigate('/verify-otp', { state: { phone: data.phone.trim() } });
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper sx={{ p: 4, width: '100%' }}>
          <Typography variant="h5" fontWeight={700} mb={3} textAlign="center">Student Registration</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Username"
              {...register('username', {
                required: 'Username is required',
                minLength: { value: 3, message: 'Username must be at least 3 characters' },
                maxLength: { value: 30, message: 'Username must be at most 30 characters' },
                pattern: { value: /^[a-zA-Z0-9_]+$/, message: 'Only letters, numbers, and underscores allowed' },
              })}
              error={!!errors.username}
              helperText={errors.username?.message}
              fullWidth
              autoFocus
            />
            <TextField
              label="Phone Number"
              {...register('phone', {
                required: 'Phone number is required',
                pattern: { value: /^\+?[0-9]{7,15}$/, message: 'Enter a valid phone number (7–15 digits)' },
              })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
              fullWidth
              placeholder="+919876543210"
            />
            <TextField
              label="Email (optional)"
              type="email"
              {...register('email', {
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              fullWidth
            />
            <TextField
              label="Confirm Password"
              type="password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              fullWidth
            />
            <Button type="submit" variant="contained" fullWidth disabled={loading} size="large">
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </Box>
          <Box mt={2} textAlign="center">
            <MuiLink component={Link} to="/login" variant="body2">Already have an account? Sign In</MuiLink>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default RegisterPage;
