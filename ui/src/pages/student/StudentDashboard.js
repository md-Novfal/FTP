import React from 'react';
import { Typography, Box } from '@mui/material';

function StudentDashboard() {
  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>My Dashboard</Typography>
      {/* TODO: Application status, profile completion %, notifications */}
    </Box>
  );
}

export default StudentDashboard;
