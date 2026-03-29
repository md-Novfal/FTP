import React from 'react';
import { Container, Box, Typography, TextField, Button, Paper, Link as MuiLink, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { login, selectAuthLoading, selectAuthError } from '../../store/slices/authSlice';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    // Send username + password to the backend
    const result = await dispatch(login({ username: data.username.trim(), password: data.password }));
    if (login.fulfilled.match(result)) {
      const role = result.payload?.user?.role;
      if (role) navigate(role === 'super_admin' ? '/admin' : `/${role}`);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper sx={{ p: 4, width: '100%' }}>
          <Typography variant="h5" fontWeight={700} mb={3} textAlign="center">Sign In</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Username"
              {...register('username', { required: 'Username is required' })}
              error={!!errors.username}
              helperText={errors.username?.message}
              fullWidth
              autoComplete="username"
              autoFocus
            />
            <TextField
              label="Password"
              type="password"
              {...register('password', { required: 'Password is required' })}
              error={!!errors.password}
              helperText={errors.password?.message}
              fullWidth
              autoComplete="current-password"
            />
            <Button type="submit" variant="contained" fullWidth disabled={loading} size="large">
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Box>
          <Box mt={2} textAlign="center">
            <MuiLink component={Link} to="/register" variant="body2">Don't have an account? Register</MuiLink>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default LoginPage;
