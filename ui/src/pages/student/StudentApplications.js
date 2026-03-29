import { useEffect, useState } from 'react';
import {
  Typography, Box, Button, CircularProgress, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, TablePagination,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '../../store/slices/uiSlice';
import ApplicationDetailView from '../../components/ApplicationDetailView';
import api from '../../services/api';

const STATUS_COLOR = {
  apply: 'default', under_review: 'info', college_submitted: 'info',
  offer_letter: 'primary', interview: 'warning', admission_letter: 'primary',
  ministry_order: 'secondary', vfs: 'secondary', visa: 'success',
  ticket: 'success', arrived: 'success', rejected: 'error', on_hold: 'warning',
};

const STATUS_STEPS = [
  'apply', 'under_review', 'college_submitted', 'offer_letter',
  'interview', 'admission_letter', 'ministry_order', 'vfs',
  'visa', 'ticket', 'arrived',
];

function StatusPipeline({ currentStatus }) {
  const idx = STATUS_STEPS.indexOf(currentStatus);
  const isRejected = currentStatus === 'rejected';
  const isOnHold = currentStatus === 'on_hold';

  if (isRejected) {
    return <Chip label="Rejected" color="error" size="small" variant="filled" sx={{ fontWeight: 500 }} />;
  }
  if (isOnHold) {
    return <Chip label="On Hold" color="warning" size="small" variant="filled" sx={{ fontWeight: 500 }} />;
  }

  return (
    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
      {STATUS_STEPS.map((step, i) => (
        <Box
          key={step}
          sx={{
            width: 20,
            height: 6,
            borderRadius: 2,
            bgcolor: i <= idx ? '#059669' : '#e2e8f0',
            transition: 'all 0.2s ease',
          }}
          title={step.replace(/_/g, ' ')}
        />
      ))}
      <Typography variant="caption" sx={{ ml: 1.5, fontWeight: 500, color: 'text.secondary' }}>
        {idx + 1}/{STATUS_STEPS.length}
      </Typography>
    </Box>
  );
}

function StudentApplications() {
  const dispatch = useDispatch();
  const [apps, setApps] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchApps = () => {
    setLoading(true);
    const params = { limit: pageSize, skip: page * pageSize };
    api.get('/applications', { params })
      .then((data) => {
        setApps(data?.applications ?? []);
        setTotal(data?.total ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchApps(); }, [page, pageSize]);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      await api.post('/applications', data);
      setOpen(false);
      reset();
      dispatch(showSnackbar({ message: 'Application submitted successfully.', severity: 'success' }));
      setPage(0);
      fetchApps();
    } catch (err) {
      dispatch(showSnackbar({ message: err.response?.data?.error || 'Failed to submit application.', severity: 'error' }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography
            variant="h3"
            fontWeight={800}
            sx={{
              color: 'primary.main',
              letterSpacing: '-0.02em',
              mb: 1,
            }}
          >
            My Applications
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem', fontWeight: 400 }}>
            Track and manage your university applications
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          size="large"
          sx={{
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
            '&:hover': {
              boxShadow: '0 8px 20px rgba(5, 150, 105, 0.35)',
            },
          }}
        >
          New Application
        </Button>
      </Box>

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
              <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Progress</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Agency</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Submitted</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : apps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No applications yet. Click "New Application" to get started.
                </TableCell>
              </TableRow>
            ) : (
              apps.map((app) => (
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
                  <TableCell><StatusPipeline currentStatus={app.status} /></TableCell>
                  <TableCell>{app.agencyId?.username ?? '—'}</TableCell>
                  <TableCell>{app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : '—'}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<VisibilityIcon />}
                      onClick={() => {
                        setSelectedApp(app);
                        setEditMode(false);
                        setDetailOpen(true);
                      }}
                      sx={{
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(59, 130, 246, 0.08)',
                        },
                      }}
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      startIcon={<EditIcon />}
                      onClick={() => {
                        setSelectedApp(app);
                        setEditMode(true);
                        setDetailOpen(true);
                      }}
                      sx={{
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(5, 150, 105, 0.08)',
                        },
                      }}
                    >
                      Edit
                    </Button>
                  </Box>
                </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={total}
          rowsPerPage={pageSize}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(evt) => {
            setPageSize(parseInt(evt.target.value, 10));
            setPage(0);
          }}
          sx={{
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
          }}
        />
      </TableContainer>

      {/* Application Detail View */}
      <ApplicationDetailView
        application={selectedApp}
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setEditMode(false);
        }}
        onUpdate={fetchApps}
        initialMode={editMode ? 'edit' : 'view'}
      />

      {/* Create Application Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #0f172a 0%, #059669 100%)', color: 'white', fontWeight: 700 }}>New Application</DialogTitle>
        <DialogContent>
          <Box component="form" id="new-app-form" onSubmit={handleSubmit(onSubmit)}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="University Name"
              {...register('universityName', { required: 'University name is required' })}
              error={!!errors.universityName}
              helperText={errors.universityName?.message}
              fullWidth
            />
            <TextField
              label="Course Name"
              {...register('courseName', { required: 'Course name is required' })}
              error={!!errors.courseName}
              helperText={errors.courseName?.message}
              fullWidth
            />
            <TextField
              label="Country"
              {...register('countryName', { required: 'Country is required' })}
              error={!!errors.countryName}
              helperText={errors.countryName?.message}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpen(false); reset(); }}>Cancel</Button>
          <Button type="submit" form="new-app-form" variant="contained" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default StudentApplications;
