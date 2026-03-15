import React, { useEffect, useState } from 'react';
import {
  Typography, Grid, Card, CardContent, Box, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BusinessIcon from '@mui/icons-material/Business';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import api from '../../services/api';

const STATUS_COLOR = {
  apply: 'default', under_review: 'info', college_submitted: 'info',
  offer_letter: 'primary', interview: 'warning', admission_letter: 'primary',
  ministry_order: 'secondary', vfs: 'secondary', visa: 'success',
  ticket: 'success', arrived: 'success', rejected: 'error', on_hold: 'warning',
};

function StatCard({ label, value, icon, color, loading }) {
  return (
    <Card elevation={1}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ color, display: 'flex', fontSize: 40 }}>{icon}</Box>
        <Box>
          {loading
            ? <CircularProgress size={24} />
            : <Typography variant="h5" fontWeight={700}>{value}</Typography>}
          <Typography variant="body2" color="text.secondary">{label}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/analytics')
      .then((data) => {
        setStats(data?.stats ?? null);
        setRecent(data?.recentApplications ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Total Students', value: stats?.students ?? '—', icon: <PeopleIcon fontSize="inherit" />, color: '#1a73e8' },
    { label: 'Total Agencies', value: stats?.agencies ?? '—', icon: <BusinessIcon fontSize="inherit" />, color: '#34a853' },
    { label: 'Applications', value: stats?.applications ?? '—', icon: <AssignmentIcon fontSize="inherit" />, color: '#fbbc04' },
    { label: 'Commission (₹)', value: stats ? `₹${stats.commissionTotal.toLocaleString()}` : '—', icon: <MonetizationOnIcon fontSize="inherit" />, color: '#ea4335' },
  ];

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>Admin Dashboard</Typography>

      <Grid container spacing={3} mb={4}>
        {cards.map((s) => (
          <Grid item xs={12} sm={6} md={3} key={s.label}>
            <StatCard {...s} loading={loading} />
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" fontWeight={600} mb={2}>Recent Applications</Typography>
      <TableContainer component={Paper} elevation={1}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><b>Student</b></TableCell>
              <TableCell><b>University</b></TableCell>
              <TableCell><b>Country</b></TableCell>
              <TableCell><b>Course</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Agency</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center"><CircularProgress size={24} /></TableCell>
              </TableRow>
            ) : recent.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No applications yet</TableCell>
              </TableRow>
            ) : recent.map((app) => (
              <TableRow key={app._id} hover>
                <TableCell>{app.userId?.email ?? '—'}</TableCell>
                <TableCell>{app.universityName}</TableCell>
                <TableCell>{app.countryName}</TableCell>
                <TableCell>{app.courseName}</TableCell>
                <TableCell>
                  <Chip
                    label={app.status.replace(/_/g, ' ')}
                    color={STATUS_COLOR[app.status] || 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{app.agencyId?.email ?? '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default AdminDashboard;
