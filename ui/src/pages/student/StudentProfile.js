import React from 'react';
import { Typography, Box } from '@mui/material';

function StudentProfile() {
  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>My Profile</Typography>
      {/* TODO: Multi-step form — personal info, education, passport, preferences */}
    </Box>
  );
}

export default StudentProfile;
