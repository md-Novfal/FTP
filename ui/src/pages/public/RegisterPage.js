import React from 'react';
import { Container, Box, Typography, TextField, Button, Paper, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { register as registerAction, selectAuthLoading, selectAuthError } from '../../store/slices/authSlice';

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const result = await dispatch(registerAction(data));
    if (registerAction.fulfilled.match(result)) {
      navigate('/verify-otp', { state: { phone: data.phone } });
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper sx={{ p: 4, width: '100%' }}>
          <Typography variant="h5" fontWeight={700} mb={3} textAlign="center">Student Registration</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Phone Number" {...register('phone', { required: true })} fullWidth />
            <TextField label="Email" type="email" {...register('email')} fullWidth />
            <TextField label="Password" type="password" {...register('password', { required: true })} fullWidth />
            <TextField label="Confirm Password" type="password" {...register('confirmPassword', { required: true })} fullWidth />
            <Button type="submit" variant="contained" fullWidth disabled={loading} size="large">
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default RegisterPage;
