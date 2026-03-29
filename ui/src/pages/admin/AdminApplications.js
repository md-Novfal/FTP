import { useEffect, useState } from 'react';
import {
  Typography, Box, CircularProgress, Chip, MenuItem, Select, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Autocomplete, TablePagination,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '../../store/slices/uiSlice';
import api from '../../services/api';

const ALL_STATUSES = [
  'apply', 'under_review', 'college_submitted', 'offer_letter',
  'interview', 'admission_letter', 'ministry_order', 'vfs',
  'visa', 'ticket', 'arrived', 'rejected', 'on_hold',
];

const STATUS_COLOR = {
  apply: 'default', under_review: 'info', college_submitted: 'info',
  offer_letter: 'primary', interview: 'warning', admission_letter: 'primary',
  ministry_order: 'secondary', vfs: 'secondary', visa: 'success',
  ticket: 'success', arrived: 'success', rejected: 'error', on_hold: 'warning',
};

function AdminApplications() {
  const dispatch = useDispatch();
  const [apps, setApps] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [agencies, setAgencies] = useState([]);
  const [agenciesLoading, setAgenciesLoading] = useState(false);

  // Status update dialog
  const [selected, setSelected] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [updating, setUpdating] = useState(false);

  // Agency assignment dialog
  const [assignApp, setAssignApp] = useState(null);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [assigning, setAssigning] = useState(false);

  const fetchApps = (status = filterStatus) => {
    setLoading(true);
    const params = { limit: pageSize, skip: page * pageSize };
    if (status) params.status = status;
    api.get('/applications', { params })
      .then((data) => {
        setApps(data?.applications ?? []);
        setTotal(data?.total ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const fetchAgencies = () => {
    setAgenciesLoading(true);
    api.get('/users', { params: { role: 'agency', limit: 100 } })
      .then((data) => {
        setAgencies(data?.users ?? []);
      })
      .catch(() => {})
      .finally(() => setAgenciesLoading(false));
  };

  useEffect(() => { fetchApps(filterStatus); }, [filterStatus, page, pageSize]);

  useEffect(() => { fetchAgencies(); }, []);

  const handleStatusUpdate = async () => {
    try {
      setUpdating(true);
      await api.put(`/applications/${selected._id}/status`, {
        status: newStatus,
        adminNote: adminNote || undefined,
      });
      setSelected(null);
      setNewStatus('');
      setAdminNote('');
      dispatch(showSnackbar({ message: 'Application status updated successfully.', severity: 'success' }));
      fetchApps(filterStatus);
    } catch (err) {
      dispatch(showSnackbar({ message: err.response?.data?.error || 'Failed to update status.', severity: 'error' }));
    } finally {
      setUpdating(false);
    }
  };

  const handleAgencyAssignment = async () => {
    if (!selectedAgency) return;
    try {
      setAssigning(true);
      await api.put(`/applications/${assignApp._id}/assign-agency`, {
        agencyId: selectedAgency._id,
      });
      setAssignApp(null);
      setSelectedAgency(null);
      dispatch(showSnackbar({ message: 'Agency assigned successfully.', severity: 'success' }));
      fetchApps(filterStatus);
    } catch (err) {
      dispatch(showSnackbar({ message: err.response?.data?.error || 'Failed to assign agency.', severity: 'error' }));
    } finally {
      setAssigning(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: 'primary.main' }}>
            Manage Applications
          </Typography>
          {!loading && (
            <Typography variant="body2" color="text.secondary">
              Total: {total} applications
            </Typography>
          )}
        </Box>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filter Status</InputLabel>
          <Select value={filterStatus} label="Filter Status" onChange={(e) => setFilterStatus(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            {ALL_STATUSES.map((s) => (
              <MenuItem key={s} value={s}>{s.replace(/_/g, ' ')}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell><b>Student</b></TableCell>
              <TableCell><b>University</b></TableCell>
              <TableCell><b>Country</b></TableCell>
              <TableCell><b>Course</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Agency</b></TableCell>
              <TableCell><b>Submitted</b></TableCell>
              <TableCell><b>Action</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center"><CircularProgress size={24} /></TableCell>
              </TableRow>
            ) : apps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">No applications found.</TableCell>
              </TableRow>
            ) : apps.map((app) => (
              <TableRow key={app._id} hover>
                <TableCell>{app.userId?.username ?? '—'}</TableCell>
                <TableCell>{app.universityName}</TableCell>
                <TableCell>{app.countryName}</TableCell>
                <TableCell>{app.courseName}</TableCell>
                <TableCell>
                  <Chip label={app.status.replace(/_/g, ' ')} color={STATUS_COLOR[app.status] || 'default'} size="small" />
                </TableCell>
                <TableCell>{app.agencyId?.username ?? '—'}</TableCell>
                <TableCell>{app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : '—'}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setSelected(app);
                        setNewStatus(app.status);
                        setAdminNote(app.adminNote || '');
                      }}
                    >
                      Update
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color={app.agencyId ? 'info' : 'warning'}
                      onClick={() => {
                        setAssignApp(app);
                        setSelectedAgency(app.agencyId || null);
                      }}
                    >
                      {app.agencyId ? 'Change' : 'Assign'}
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

      {/* Status Update Dialog */}
      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 700 }}>
          Update Application — {selected?.userId?.username ?? ''}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {selected?.universityName} — {selected?.courseName} ({selected?.countryName})
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={newStatus} label="Status" onChange={(e) => setNewStatus(e.target.value)}>
                {ALL_STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>{s.replace(/_/g, ' ')}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Admin Note (optional)"
              multiline rows={2}
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleStatusUpdate} disabled={updating}>
            {updating ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Agency Assignment Dialog */}
      <Dialog open={!!assignApp} onClose={() => setAssignApp(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ bgcolor: 'success.main', color: 'white', fontWeight: 700 }}>
          Assign Agency — {assignApp?.userId?.username ?? ''}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {assignApp?.universityName} — {assignApp?.courseName} ({assignApp?.countryName})
            </Typography>
            <Autocomplete
              options={agencies}
              getOptionLabel={(option) => option?.username || ''}
              value={selectedAgency}
              onChange={(e, newValue) => setSelectedAgency(newValue)}
              loading={agenciesLoading}
              renderInput={(params) => (
                <TextField {...params} label="Select Agency" />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignApp(null)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAgencyAssignment}
            disabled={assigning || !selectedAgency}
          >
            {assigning ? 'Assigning...' : 'Assign'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminApplications;
