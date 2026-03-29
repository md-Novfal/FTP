import { useEffect, useState } from 'react';
import {
  Typography, Box, TextField, Button, Paper, Grid, Card, CardContent,
  CircularProgress, Tabs, Tab, LinearProgress, Alert, Chip,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '../../store/slices/uiSlice';
import api from '../../services/api';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';

const TABS = [
  { label: 'Personal Info', icon: <PersonIcon />, id: 'personal' },
  { label: 'Academic Details', icon: <SchoolIcon />, id: 'academic' },
  { label: 'Passport & Address', icon: <AssignmentIcon />, id: 'passport' },
];

function StudentProfile() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [completionData, setCompletionData] = useState({
    personal: 0,
    academic: 0,
    passport: 0,
  });

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const formValues = watch();

  useEffect(() => {
    api.get('/profile')
      .then((data) => {
        if (data?.profile) {
          const p = data.profile;
          if (p.dateOfBirth) p.dateOfBirth = p.dateOfBirth.slice(0, 10);
          if (p.passportExpiry) p.passportExpiry = p.passportExpiry.slice(0, 10);
          reset(p);
          calculateCompletion(p);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [reset]);

  const calculateCompletion = (data) => {
    const personal = [
      data?.firstName,
      data?.lastName,
      data?.dateOfBirth,
      data?.fatherName,
      data?.motherName,
    ].filter(Boolean).length / 5;

    const academic = [
      data?.tenthPercentage,
      data?.twelfthPercentage,
      data?.neetScore,
      data?.ugDegree,
      data?.ugPercentage,
    ].filter(Boolean).length / 5;

    const passport = [
      data?.passportNumber,
      data?.passportExpiry,
      data?.address,
      data?.city,
      data?.state,
      data?.country,
      data?.pincode,
    ].filter(Boolean).length / 7;

    setCompletionData({
      personal: Math.round(personal * 100),
      academic: Math.round(academic * 100),
      passport: Math.round(passport * 100),
    });
  };

  useEffect(() => {
    calculateCompletion(formValues);
  }, [formValues]);

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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const completionPercentage = Math.round((completionData.personal + completionData.academic + completionData.passport) / 3);
  const isComplete = completionPercentage === 100;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight={800} sx={{ color: 'primary.main', letterSpacing: '-0.02em', mb: 1 }}>
          My Profile
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem' }}>
          Complete your information to unlock all features
        </Typography>
      </Box>

      {/* Overall Completion Card */}
      <Card
        elevation={0}
        sx={{
          mb: 4,
          border: '1px solid #e2e8f0',
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, rgba(5, 150, 105, 0.02) 100%)',
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h6" fontWeight={600} sx={{ color: 'primary.main' }}>
                Profile Completion
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {completionPercentage}% complete
              </Typography>
            </Box>
            {isComplete && (
              <Chip
                icon={<CheckCircleIcon />}
                label="Complete"
                color="success"
                sx={{ fontWeight: 600 }}
              />
            )}
          </Box>
          <LinearProgress
            variant="determinate"
            value={completionPercentage}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: '#e2e8f0',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: 'linear-gradient(90deg, #059669 0%, #10b981 100%)',
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Tabs Navigation */}
      <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3, mb: 0 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{
            borderBottom: '2px solid #e2e8f0',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '0.95rem',
              fontWeight: 500,
              color: 'text.secondary',
              py: 2,
              px: 3,
              minWidth: 'auto',
              transition: 'all 0.2s ease',
              '&:hover': {
                color: 'secondary.main',
                backgroundColor: 'rgba(5, 150, 105, 0.05)',
              },
            },
            '& .Mui-selected': {
              color: 'secondary.main',
              fontWeight: 600,
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'secondary.main',
              height: 3,
              borderRadius: 2,
            },
          }}
        >
          {TABS.map((tab, idx) => (
            <Tab
              key={tab.id}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ display: 'flex', color: 'inherit' }}>{tab.icon}</Box>
                  <Box>
                    <Box>{tab.label}</Box>
                    <Box sx={{ fontSize: '0.7rem', fontWeight: 400, color: 'text.secondary' }}>
                      {completionData[tab.id]}%
                    </Box>
                  </Box>
                </Box>
              }
            />
          ))}
        </Tabs>

        {/* Tab Content */}
        <CardContent sx={{ p: 4 }}>
          <Box component="form" id="profile-form" onSubmit={handleSubmit(onSubmit)}>
            {/* Personal Info Tab */}
            {activeTab === 0 && (
              <Box>
                <Typography variant="h6" fontWeight={600} sx={{ color: 'primary.main', mb: 3 }}>
                  Personal Information
                </Typography>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
                      First Name *
                    </Typography>
                    <TextField
                      placeholder="Enter your first name"
                      {...register('firstName', { required: 'First name is required' })}
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                      fullWidth
                      variant="outlined"
                      size="medium"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
                      Last Name *
                    </Typography>
                    <TextField
                      placeholder="Enter your last name"
                      {...register('lastName', { required: 'Last name is required' })}
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                      fullWidth
                      variant="outlined"
                      size="medium"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
                      Date of Birth
                    </Typography>
                    <TextField
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      {...register('dateOfBirth')}
                      fullWidth
                      variant="outlined"
                      size="medium"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
                      Father's Name
                    </Typography>
                    <TextField
                      placeholder="Enter father's name"
                      {...register('fatherName')}
                      fullWidth
                      variant="outlined"
                      size="medium"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
                      Mother's Name
                    </Typography>
                    <TextField
                      placeholder="Enter mother's name"
                      {...register('motherName')}
                      fullWidth
                      variant="outlined"
                      size="medium"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
                      Aadhar Number
                    </Typography>
                    <TextField
                      placeholder="12-digit Aadhar number"
                      {...register('aadharNumber')}
                      fullWidth
                      variant="outlined"
                      size="medium"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
                      PAN Number
                    </Typography>
                    <TextField
                      placeholder="10-character PAN"
                      {...register('panNumber')}
                      fullWidth
                      variant="outlined"
                      size="medium"
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Academic Details Tab */}
            {activeTab === 1 && (
              <Box>
                <Typography variant="h6" fontWeight={600} sx={{ color: 'primary.main', mb: 3 }}>
                  Academic Details
                </Typography>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
                      10th Grade Percentage
                    </Typography>
                    <TextField
                      type="number"
                      inputProps={{ step: 0.01, min: 0, max: 100 }}
                      placeholder="Enter percentage (0-100)"
                      {...register('tenthPercentage')}
                      fullWidth
                      variant="outlined"
                      size="medium"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
                      12th Grade Percentage
                    </Typography>
                    <TextField
                      type="number"
                      inputProps={{ step: 0.01, min: 0, max: 100 }}
                      placeholder="Enter percentage (0-100)"
                      {...register('twelfthPercentage')}
                      fullWidth
                      variant="outlined"
                      size="medium"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
                      NEET Score
                    </Typography>
                    <TextField
                      type="number"
                      inputProps={{ min: 0, max: 720 }}
                      placeholder="Enter NEET score (0-720)"
                      {...register('neetScore')}
                      fullWidth
                      variant="outlined"
                      size="medium"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
                      UG Degree
                    </Typography>
                    <TextField
                      placeholder="e.g., MBBS, BAMS, BDS"
                      {...register('ugDegree')}
                      fullWidth
                      variant="outlined"
                      size="medium"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
                      UG Percentage
                    </Typography>
                    <TextField
                      type="number"
                      inputProps={{ step: 0.01, min: 0, max: 100 }}
                      placeholder="Enter percentage (0-100)"
                      {...register('ugPercentage')}
                      fullWidth
                      variant="outlined"
                      size="medium"
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Passport & Address Tab */}
            {activeTab === 2 && (
              <Box>
                <Typography variant="h6" fontWeight={600} sx={{ color: 'primary.main', mb: 3 }}>
                  Passport & Address
                </Typography>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
                      Passport Number
                    </Typography>
                    <TextField
                      placeholder="Enter passport number"
                      {...register('passportNumber')}
                      fullWidth
                      variant="outlined"
                      size="medium"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
                      Passport Expiry Date
                    </Typography>
                    <TextField
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      {...register('passportExpiry')}
                      fullWidth
                      variant="outlined"
                      size="medium"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
                      Address
                    </Typography>
                    <TextField
                      placeholder="Enter your full address"
                      {...register('address')}
                      fullWidth
                      multiline
                      rows={2}
                      variant="outlined"
                      size="medium"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
                      City
                    </Typography>
                    <TextField
                      placeholder="Enter city name"
                      {...register('city')}
                      fullWidth
                      variant="outlined"
                      size="medium"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
                      State
                    </Typography>
                    <TextField
                      placeholder="Enter state name"
                      {...register('state')}
                      fullWidth
                      variant="outlined"
                      size="medium"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
                      Country
                    </Typography>
                    <TextField
                      placeholder="Enter country name"
                      {...register('country')}
                      fullWidth
                      variant="outlined"
                      size="medium"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
                      Pincode
                    </Typography>
                    <TextField
                      placeholder="Enter pincode"
                      {...register('pincode')}
                      fullWidth
                      variant="outlined"
                      size="medium"
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </CardContent>

        {/* Action Buttons */}
        <Box
          sx={{
            p: 3,
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={() => setActiveTab(Math.max(0, activeTab - 1))}
            disabled={activeTab === 0}
            sx={{
              borderColor: '#cbd5e1',
              color: 'text.primary',
              '&:hover': {
                borderColor: '#94a3b8',
                backgroundColor: '#f1f5f9',
              },
            }}
          >
            Previous
          </Button>
          {activeTab < TABS.length - 1 ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setActiveTab(Math.min(TABS.length - 1, activeTab + 1))}
              sx={{
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
              }}
            >
              Next Section
            </Button>
          ) : (
            <Button
              type="submit"
              form="profile-form"
              variant="contained"
              color="secondary"
              disabled={saving}
              startIcon={<SaveIcon />}
              sx={{
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
              }}
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </Button>
          )}
        </Box>
      </Card>
    </Box>
  );
}

export default StudentProfile;
