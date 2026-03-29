import React, { useEffect, useState } from 'react';
import {
  Typography, Grid, Card, CardContent, Box, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, TablePagination,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
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

function AgencyDashboard() {
  const [stats, setStats] = useState(null);
  const [apps, setApps] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    api.get('/agency/dashboard')
      .then((data) => {
        setStats(data?.stats ?? null);
        setApps(data?.recentApplications ?? []);
        setTotal(data?.total ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const cards = [
    { label: 'Total Students', value: stats?.students ?? '—', icon: <PeopleIcon fontSize="inherit" />, color: '#1a73e8' },
    { label: 'My Applications', value: stats?.applications ?? '—', icon: <AssignmentIcon fontSize="inherit" />, color: '#34a853' },
    { label: 'Success Rate', value: stats?.successRate ? `${stats.successRate}%` : '—', icon: <TrendingUpIcon fontSize="inherit" />, color: '#fbbc04' },
  ];

  const displayedApps = apps.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} sx={{ color: 'primary.main' }}>Agency Dashboard</Typography>
        <Typography variant="body2" color="text.secondary">Monitor your students and applications</Typography>
      </Box>

      <Grid container spacing={3} mb={4}>
        {cards.map((s) => (
          <Grid item xs={12} sm={6} md={4} key={s.label}>
            <StatCard {...s} loading={loading} />
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" fontWeight={600} mb={2}>Recent Applications</Typography>
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell><b>Student</b></TableCell>
              <TableCell><b>University</b></TableCell>
              <TableCell><b>Course</b></TableCell>
              <TableCell><b>Country</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Submitted</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center"><CircularProgress size={24} /></TableCell>
              </TableRow>
            ) : apps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No applications yet</TableCell>
              </TableRow>
            ) : displayedApps.map((app) => (
              <TableRow key={app._id} hover>
                <TableCell>{app.userId?.username ?? '—'}</TableCell>
                <TableCell>{app.universityName}</TableCell>
                <TableCell>{app.courseName}</TableCell>
                <TableCell>{app.countryName}</TableCell>
                <TableCell>
                  <Chip
                    label={app.status.replace(/_/g, ' ')}
                    color={STATUS_COLOR[app.status] || 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {apps.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={total}
            rowsPerPage={pageSize}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        )}
      </TableContainer>
    </Box>
  );
}

export default AgencyDashboard;
