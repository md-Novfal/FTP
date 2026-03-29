import React, { useEffect, useState } from 'react';
import {
  Typography, Grid, Card, CardContent, Box, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, TablePagination,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import api from '../../services/api';

const STATUS_COLOR = {
  apply: 'default', under_review: 'info', college_submitted: 'info',
  offer_letter: 'primary', interview: 'warning', admission_letter: 'primary',
  ministry_order: 'secondary', vfs: 'secondary', visa: 'success',
  ticket: 'success', arrived: 'success', rejected: 'error', on_hold: 'warning',
};

function StatCard({ label, value, icon, color, loading }) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: '1px solid #e2e8f0',
        background: 'linear-gradient(135deg, #ffffff 0%, rgba(5, 150, 105, 0.02) 100%)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: color,
        },
        '&:hover': {
          boxShadow: '0 12px 24px rgba(15, 23, 42, 0.08)',
          borderColor: color,
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 3 }}>
        <Box
          sx={{
            color,
            display: 'flex',
            fontSize: 40,
            p: 1.5,
            backgroundColor: `rgba(${
              color === '#1a73e8' ? '59, 130, 246' : color === '#34a853' ? '5, 150, 105' : '245, 158, 11'
            }, 0.1)`,
            borderRadius: 2,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ flex: 1 }}>
          {loading ? (
            <CircularProgress size={20} />
          ) : (
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{ color: 'primary.main', letterSpacing: '-0.01em' }}
            >
              {value}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 500 }}>
            {label}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

function StudentDashboard() {
  const [stats, setStats] = useState(null);
  const [apps, setApps] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    api.get('/dashboard')
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
    { label: 'Total Applications', value: stats?.totalApplications ?? '—', icon: <AssignmentIcon fontSize="inherit" />, color: '#1a73e8' },
    { label: 'Completed', value: stats?.completedApplications ?? '—', icon: <CheckCircleIcon fontSize="inherit" />, color: '#34a853' },
    { label: 'In Progress', value: stats?.inProgressApplications ?? '—', icon: <PendingActionsIcon fontSize="inherit" />, color: '#fbbc04' },
  ];

  const displayedApps = apps.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h3"
          fontWeight={800}
          sx={{
            color: 'primary.main',
            letterSpacing: '-0.02em',
            mb: 1,
          }}
        >
          My Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem', fontWeight: 400 }}>
          Track your applications and profile progress
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} mb={6}>
        {cards.map((s) => (
          <Grid item xs={12} sm={6} md={4} key={s.label}>
            <StatCard {...s} loading={loading} />
          </Grid>
        ))}
      </Grid>

      {/* Applications Table */}
      <Box>
        <Typography
          variant="h5"
          fontWeight={600}
          mb={3}
          sx={{ color: 'primary.main', letterSpacing: '-0.005em' }}
        >
          Recent Applications
        </Typography>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            border: '1px solid #e2e8f0',
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>University</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Course</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Country</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Submitted</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : apps.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    No applications yet. Start your journey now!
                  </TableCell>
                </TableRow>
              ) : (
                displayedApps.map((app) => (
                  <TableRow
                    key={app._id}
                    sx={{
                      '&:last-child td': { borderBottom: 0 },
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>{app.universityName}</TableCell>
                    <TableCell>{app.courseName}</TableCell>
                    <TableCell>{app.countryName}</TableCell>
                    <TableCell>
                      <Chip
                        label={app.status.replace(/_/g, ' ')}
                        color={STATUS_COLOR[app.status] || 'default'}
                        size="small"
                        variant="filled"
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell>{app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : '—'}</TableCell>
                  </TableRow>
                ))
              )}
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
              sx={{
                borderTop: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
              }}
            />
          )}
        </TableContainer>
      </Box>
    </Box>
  );
}

export default StudentDashboard;
