import React from 'react';
import { Typography, Grid, Card, CardContent, Box } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BusinessIcon from '@mui/icons-material/Business';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const STATS = [
  { label: 'Total Students', value: '—', icon: <PeopleIcon />, color: '#1a73e8' },
  { label: 'Total Agencies', value: '—', icon: <BusinessIcon />, color: '#34a853' },
  { label: 'Applications', value: '—', icon: <AssignmentIcon />, color: '#fbbc04' },
  { label: 'Commissions', value: '—', icon: <MonetizationOnIcon />, color: '#ea4335' },
];

function AdminDashboard() {
  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>Admin Dashboard</Typography>
      <Grid container spacing={3}>
        {STATS.map((s) => (
          <Grid item xs={12} sm={6} md={3} key={s.label}>
            <Card elevation={1}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ color: s.color, display: 'flex' }}>{s.icon}</Box>
                <Box>
                  <Typography variant="h5" fontWeight={700}>{s.value}</Typography>
                  <Typography variant="body2" color="text.secondary">{s.label}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* TODO: Charts — application trend, FMGE pass rate, country distribution */}
    </Box>
  );
}

export default AdminDashboard;
