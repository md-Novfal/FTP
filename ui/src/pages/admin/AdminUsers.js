import { useEffect, useState } from 'react';
import {
  Typography, Box, CircularProgress, Chip, MenuItem, Select, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TextField, InputAdornment, IconButton, Tooltip, Button, Dialog, DialogTitle, DialogContent, DialogActions, TablePagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BlockIcon from '@mui/icons-material/Block';
import AddIcon from '@mui/icons-material/Add';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { showSnackbar } from '../../store/slices/uiSlice';
import { selectCurrentUser } from '../../store/slices/authSlice';
import api from '../../services/api';

const ROLE_COLOR = {
  super_admin: 'error',
  admin: 'primary',
  agency: 'secondary',
  student: 'default',
};

const STATUS_COLOR = {
  active: 'success',
  pending: 'warning',
  inactive: 'default',
};

function AdminUsers() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [openDialog, setOpenDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const allowedRoles = currentUser?.role === 'super_admin'
    ? ['admin', 'agency']
    : ['agency'];

  const fetchUsers = (role = filterRole, searchTerm = search) => {
    setLoading(true);
    const params = { limit: pageSize, skip: page * pageSize };
    if (role) params.role = role;
    if (searchTerm) params.search = searchTerm;
    api.get('/users', { params })
      .then((data) => {
        setUsers(data?.users ?? []);
        setTotal(data?.total ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(filterRole, search); }, [filterRole, search, page, pageSize]);

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(0);
  };

  const handleDeactivate = async (userId) => {
    if (!window.confirm('Deactivate this user?')) return;
    try {
      await api.delete(`/users/${userId}`);
      fetchUsers(filterRole, search);
      dispatch(showSnackbar({ message: 'User deactivated successfully.', severity: 'success' }));
    } catch (err) {
      dispatch(showSnackbar({ message: err.response?.data?.error || 'Failed to deactivate user.', severity: 'error' }));
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      await api.post('/auth/create-user', data);
      setOpenDialog(false);
      reset();
      dispatch(showSnackbar({ message: `${data.role} account created successfully!`, severity: 'success' }));
      fetchUsers(filterRole, search);
    } catch (err) {
      dispatch(showSnackbar({ message: err.response?.data?.error || 'Failed to create user.', severity: 'error' }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: 'primary.main' }}>
            Manage Users
          </Typography>
          {!loading && (
            <Typography variant="body2" color="text.secondary">
              Total: {total} users
            </Typography>
          )}
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)} size="large">
          Create User
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          size="small"
          placeholder="Search by username, email, phone..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          sx={{ flex: 1, maxWidth: 360 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleSearch}><SearchIcon /></IconButton>
              </InputAdornment>
            ),
          }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Role</InputLabel>
          <Select value={filterRole} label="Role" onChange={(e) => { setFilterRole(e.target.value); setPage(0); }}>
            <MenuItem value="">All Roles</MenuItem>
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="agency">Agency</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="super_admin">Super Admin</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell><b>Username</b></TableCell>
              <TableCell><b>Email</b></TableCell>
              <TableCell><b>Phone</b></TableCell>
              <TableCell><b>Role</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Created</b></TableCell>
              <TableCell><b>Action</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center"><CircularProgress size={24} /></TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No users found.</TableCell>
              </TableRow>
            ) : users.map((user) => (
              <TableRow key={user._id} hover>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email ?? '—'}</TableCell>
                <TableCell>{user.phone ?? '—'}</TableCell>
                <TableCell>
                  <Chip label={user.role.replace(/_/g, ' ')} color={ROLE_COLOR[user.role] || 'default'} size="small" />
                </TableCell>
                <TableCell>
                  <Chip label={user.status} color={STATUS_COLOR[user.status] || 'default'} size="small" variant="outlined" />
                </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  {user.status === 'active' && user.role !== 'super_admin' && (
                    <Tooltip title="Deactivate user">
                      <IconButton size="small" color="error" onClick={() => handleDeactivate(user._id)}>
                        <BlockIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
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

      {/* Create User Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 700 }}>
          Create New User
        </DialogTitle>
        <DialogContent>
          <Box component="form" id="create-user-form" onSubmit={handleSubmit(onSubmit)}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Username"
              {...register('username', {
                required: 'Username is required',
                minLength: { value: 3, message: 'Username must be at least 3 characters' },
                pattern: { value: /^[a-zA-Z0-9_]+$/, message: 'Only letters, numbers, and underscores allowed' },
              })}
              error={!!errors.username}
              helperText={errors.username?.message}
              fullWidth
              size="small"
            />
            <TextField
              label="Email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
              size="small"
            />
            <TextField
              label="Phone"
              {...register('phone', {
                required: 'Phone is required',
                pattern: { value: /^\+?[0-9]{7,15}$/, message: 'Enter a valid phone number' },
              })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
              fullWidth
              size="small"
              placeholder="+919876543210"
            />
            <TextField
              label="Password"
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              fullWidth
              size="small"
            />
            <FormControl fullWidth size="small">
              <InputLabel>Role</InputLabel>
              <Select
                {...register('role', { required: 'Role is required' })}
                label="Role"
                defaultValue=""
              >
                {allowedRoles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role.replace('_', ' ').toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button type="submit" form="create-user-form" variant="contained" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create User'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminUsers;
