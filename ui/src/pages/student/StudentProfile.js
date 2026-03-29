import { useEffect, useState } from 'react';
import {
  Typography, Box, TextField, Button, Paper, Grid, Divider,
  CircularProgress, Stepper, Step, StepLabel,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '../../store/slices/uiSlice';
import api from '../../services/api';

const STEPS = ['Personal Info', 'Academic Details', 'Passport & Address'];

function StudentProfile() {
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    api.get('/profile')
      .then((data) => {
        if (data?.profile) {
          const p = data.profile;
          // Format date for input[type=date]
          if (p.dateOfBirth) p.dateOfBirth = p.dateOfBirth.slice(0, 10);
          if (p.passportExpiry) p.passportExpiry = p.passportExpiry.slice(0, 10);
          reset(p);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      await api.put('/profile', data);
      dispatch(showSnackbar({ message: 'Profile saved successfully.', severity: 'success' }));
    } catch (err) {
      dispatch(showSnackbar({ message: err.response?.data?.error || 'Failed to save profile.', severity: 'error' }));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} sx={{ color: 'primary.main' }}>My Profile</Typography>
        <Typography variant="body2" color="text.secondary">Complete your personal and academic information</Typography>
      </Box>

      <Paper sx={{ p: 4, backgroundColor: '#fafafa', borderRadius: 2 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ minHeight: 400 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>

          {/* Step 0: Personal Info */}
          {activeStep === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" fontWeight={600} mb={1}>Personal Information</Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  {...register('firstName', { required: 'First name is required' })}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  {...register('lastName', { required: 'Last name is required' })}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date of Birth"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...register('dateOfBirth')}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Father's Name" {...register('fatherName')} fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Mother's Name" {...register('motherName')} fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Aadhar Number" {...register('aadharNumber')} fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="PAN Number" {...register('panNumber')} fullWidth />
              </Grid>
            </Grid>
          )}

          {/* Step 1: Academic Details */}
          {activeStep === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" fontWeight={600} mb={1}>Academic Details</Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="10th Percentage"
                  type="number"
                  inputProps={{ step: 0.01, min: 0, max: 100 }}
                  {...register('tenthPercentage')}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="12th Percentage"
                  type="number"
                  inputProps={{ step: 0.01, min: 0, max: 100 }}
                  {...register('twelfthPercentage')}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="NEET Score"
                  type="number"
                  inputProps={{ min: 0, max: 720 }}
                  {...register('neetScore')}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="UG Degree" {...register('ugDegree')} fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="UG Percentage"
                  type="number"
                  inputProps={{ step: 0.01, min: 0, max: 100 }}
                  {...register('ugPercentage')}
                  fullWidth
                />
              </Grid>
            </Grid>
          )}

          {/* Step 2: Passport & Address */}
          {activeStep === 2 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" fontWeight={600} mb={1}>Passport & Address</Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Passport Number" {...register('passportNumber')} fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Passport Expiry"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...register('passportExpiry')}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Address" {...register('address')} fullWidth multiline rows={2} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="City" {...register('city')} fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="State" {...register('state')} fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Country" {...register('country')} fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Pincode" {...register('pincode')} fullWidth />
              </Grid>
            </Grid>
          )}

            {/* Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={() => setActiveStep((s) => s - 1)}
                variant="outlined"
              >
                Back
              </Button>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {activeStep < STEPS.length - 1 ? (
                  <Button variant="contained" onClick={() => setActiveStep((s) => s + 1)}>
                    Next
                  </Button>
                ) : (
                  <Button type="submit" variant="contained" disabled={saving} size="large">
                    {saving ? 'Saving...' : 'Save Profile'}
                  </Button>
                )}
              </Box>
            </Box>
          </Box>

        </Box>
      </Paper>
    </Box>
  );
}

export default StudentProfile;
