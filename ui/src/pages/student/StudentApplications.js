import { useEffect, useState } from 'react';
import {
  Typography, Box, Button, CircularProgress, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, TablePagination,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
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
    return <Chip label="Rejected" color="error" size="small" />;
  }
  if (isOnHold) {
    return <Chip label="On Hold" color="warning" size="small" />;
  }

  return (
    <Box sx={{ display: 'flex', gap: 0.3, alignItems: 'center' }}>
      {STATUS_STEPS.map((step, i) => (
        <Box
          key={step}
          sx={{
            width: 18, height: 6, borderRadius: 1,
            bgcolor: i <= idx ? '#1a73e8' : '#e0e0e0',
          }}
          title={step.replace(/_/g, ' ')}
        />
      ))}
      <Typography variant="caption" sx={{ ml: 1 }}>
        {currentStatus.replace(/_/g, ' ')}
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: 'primary.main' }}>My Applications</Typography>
          <Typography variant="body2" color="text.secondary">Track and manage your university applications</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)} size="large">
          New Application
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell><b>University</b></TableCell>
              <TableCell><b>Course</b></TableCell>
              <TableCell><b>Country</b></TableCell>
              <TableCell><b>Progress</b></TableCell>
              <TableCell><b>Agency</b></TableCell>
              <TableCell><b>Submitted</b></TableCell>
              <TableCell><b>Action</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center"><CircularProgress size={24} /></TableCell>
              </TableRow>
            ) : apps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No applications yet. Click "New Application" to get started.</TableCell>
              </TableRow>
            ) : apps.map((app) => (
              <TableRow key={app._id} hover>
                <TableCell>{app.universityName}</TableCell>
                <TableCell>{app.courseName}</TableCell>
                <TableCell>{app.countryName}</TableCell>
                <TableCell><StatusPipeline currentStatus={app.status} /></TableCell>
                <TableCell>{app.agencyId?.username ?? '—'}</TableCell>
                <TableCell>{app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : '—'}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<VisibilityIcon />}
                    onClick={() => {
                      setSelectedApp(app);
                      setDetailOpen(true);
                    }}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={total}
          rowsPerPage={pageSize}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setPageSize(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

      {/* Application Detail View */}
      <ApplicationDetailView
        application={selectedApp}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onUpdate={fetchApps}
      />

      {/* Create Application Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 700 }}>New Application</DialogTitle>
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
