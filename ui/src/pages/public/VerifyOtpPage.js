import React from 'react';
import { Container, Box, Typography, TextField, Button, Paper, Alert } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp, selectAuthLoading, selectAuthError } from '../../store/slices/authSlice';

function VerifyOtpPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const { register, handleSubmit } = useForm();
  const phone = location.state?.phone || '';

  const onSubmit = async (data) => {
    const result = await dispatch(verifyOtp({ phone, otp: data.otp }));
    if (verifyOtp.fulfilled.match(result)) {
      navigate('/login');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 10 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={700} mb={1} textAlign="center">Verify OTP</Typography>
          <Typography variant="body2" color="text.secondary" mb={3} textAlign="center">
            Enter the OTP sent to {phone}
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="OTP" {...register('otp', { required: true })} fullWidth inputProps={{ maxLength: 6 }} />
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
