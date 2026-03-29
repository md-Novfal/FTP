import { useEffect, useState } from 'react';
import {
  Typography, Box, Button, CircularProgress, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, TablePagination,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import VisibilityIcon from '@mui/icons-material/Visibility';
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

function AgencyApplications() {
  const dispatch = useDispatch();
  const [apps, setApps] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedApp, setSelectedApp] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchApps = () => {
    setLoading(true);
    const params = { limit: pageSize, skip: page * pageSize };
    api.get('/agency/applications', { params })
      .then((data) => {
        setApps(data?.applications ?? []);
        setTotal(data?.total ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchApps(); }, [page, pageSize]);

  const handleUpdateStatus = async () => {
    if (!selectedApp || !updateStatus) return;
    try {
      setUpdating(true);
      await api.put(`/applications/${selectedApp._id}`, { status: updateStatus });
      setUpdateOpen(false);
      setUpdateStatus('');
      dispatch(showSnackbar({ message: 'Application status updated successfully.', severity: 'success' }));
      fetchApps();
    } catch (err) {
      dispatch(showSnackbar({ message: err.response?.data?.error || 'Failed to update status.', severity: 'error' }));
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: 'primary.main' }}>Agency Applications</Typography>
          <Typography variant="body2" color="text.secondary">Manage student applications assigned to you</Typography>
        </Box>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell><b>Student</b></TableCell>
              <TableCell><b>University</b></TableCell>
              <TableCell><b>Course</b></TableCell>
              <TableCell><b>Country</b></TableCell>
              <TableCell><b>Progress</b></TableCell>
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
                <TableCell colSpan={7} align="center">No applications assigned to you yet.</TableCell>
              </TableRow>
            ) : apps.map((app) => (
              <TableRow key={app._id} hover>
                <TableCell>{app.userId?.username ?? '—'}</TableCell>
                <TableCell>{app.universityName}</TableCell>
                <TableCell>{app.courseName}</TableCell>
                <TableCell>{app.countryName}</TableCell>
                <TableCell><StatusPipeline currentStatus={app.status} /></TableCell>
                <TableCell>{app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : '—'}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
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
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<AssignmentIcon />}
                      onClick={() => {
                        setSelectedApp(app);
                        setUpdateStatus(app.status);
                        setUpdateOpen(true);
                      }}
                    >
                      Update
                    </Button>
                  </Box>
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

      {/* Update Status Dialog */}
      <Dialog open={updateOpen} onClose={() => setUpdateOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 700 }}>Update Application Status</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              select
              label="Status"
              value={updateStatus}
              onChange={(e) => setUpdateStatus(e.target.value)}
              fullWidth
              SelectProps={{
                native: true,
              }}
            >
              <option value="">Select Status</option>
              {STATUS_STEPS.map((s) => (
                <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
              ))}
              <option value="rejected">Rejected</option>
              <option value="on_hold">On Hold</option>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateOpen(false)}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={updating || !updateStatus} onClick={handleUpdateStatus}>
            {updating ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AgencyApplications;
