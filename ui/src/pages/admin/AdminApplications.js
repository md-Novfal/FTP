import React from 'react';
import { Typography, Box } from '@mui/material';

function AdminApplications() {
  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>Manage Applications</Typography>
      {/* TODO: Table with filters, status update, bulk actions */}
    </Box>
  );
}

export default AdminApplications;
