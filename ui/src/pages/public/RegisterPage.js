import React from 'react';
import { Container, Box, Typography, TextField, Button, Paper, Alert, Link as MuiLink } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
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
      navigate('/verify-otp', { state: { phone: data.phone.trim() } });
    }
  };

  const formFields = [
    {
      name: 'username',
      label: 'Username',
      placeholder: 'Choose your username',
      validation: {
        required: 'Username is required',
        minLength: { value: 3, message: 'Username must be at least 3 characters' },
        maxLength: { value: 30, message: 'Username must be at most 30 characters' },
        pattern: { value: /^[a-zA-Z0-9_]+$/, message: 'Only letters, numbers, and underscores allowed' },
      },
    },
    {
      name: 'phone',
      label: 'Phone Number',
      placeholder: '+919876543210',
      validation: {
        required: 'Phone number is required',
        pattern: { value: /^\+?[0-9]{7,15}$/, message: 'Enter a valid phone number (7–15 digits)' },
      },
    },
    {
      name: 'email',
      label: 'Email (optional)',
      type: 'email',
      placeholder: 'your.email@example.com',
      validation: {
        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
      },
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Minimum 8 characters',
      validation: {
        required: 'Password is required',
        minLength: { value: 8, message: 'Password must be at least 8 characters' },
      },
    },
    {
      name: 'confirmPassword',
      label: 'Confirm Password',
      type: 'password',
      placeholder: 'Re-enter your password',
      validation: {
        required: 'Please confirm your password',
        validate: (value) => value === password || 'Passwords do not match',
      },
    },
  ];

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 4,
          mb: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: 'calc(100vh - 64px)',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
            background: 'linear-gradient(135deg, #ffffff 0%, rgba(5, 150, 105, 0.02) 100%)',
          }}
        >
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography
              variant="h4"
              fontWeight={700}
              mb={1}
              sx={{
                color: 'primary.main',
                letterSpacing: '-0.01em',
              }}
            >
              Create Your Account
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
              Join thousands of students achieving their dreams
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                color: '#991b1b',
                '& .MuiAlert-icon': {
                  color: '#ef4444',
                },
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {formFields.map((field) => (
              <Box key={field.name}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
                  {field.label}
                </Typography>
                <TextField
                  type={field.type || 'text'}
                  placeholder={field.placeholder}
                  {...register(field.name, field.validation)}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]?.message}
                  fullWidth
                  autoFocus={field.name === 'username'}
                  variant="outlined"
                  size="medium"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                    },
                  }}
                />
              </Box>
            ))}

            <Button
              type="submit"
              variant="contained"
              color="secondary"
              fullWidth
              disabled={loading}
              size="large"
              endIcon={!loading && <ArrowForwardIcon />}
              sx={{
                mt: 2,
                py: 1.5,
                fontWeight: 600,
                fontSize: '1rem',
                boxShadow: '0 8px 24px rgba(5, 150, 105, 0.25)',
                '&:hover': {
                  boxShadow: '0 12px 32px rgba(5, 150, 105, 0.35)',
                },
              }}
            >
              {loading ? 'Registering...' : 'Create Account'}
            </Button>
          </Box>

          <Box mt={4} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <MuiLink
                component={Link}
                to="/login"
                sx={{
                  color: 'secondary.main',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: 'secondary.dark',
                  },
                }}
              >
                Sign In
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default RegisterPage;
