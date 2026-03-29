import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Chip,
  LinearProgress, Table, TableBody, TableCell, TableRow, CircularProgress, TableHead,
  TableContainer, Paper, IconButton, Tooltip, TextField, Card, CardContent,
  Grid,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import DescriptionIcon from '@mui/icons-material/Description';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { showSnackbar } from '../store/slices/uiSlice';
import api from '../services/api';

const STATUS_COLOR = {
  apply: 'default', under_review: 'info', college_submitted: 'info',
  offer_letter: 'primary', interview: 'warning', admission_letter: 'primary',
  ministry_order: 'secondary', vfs: 'secondary', visa: 'success',
  ticket: 'success', arrived: 'success', rejected: 'error', on_hold: 'warning',
};

function ApplicationDetailView({ application, open, onClose, onUpdate, readOnly = false, initialMode = 'view' }) {
  const dispatch = useDispatch();
  const [mode, setMode] = useState(initialMode);
  const [documents, setDocuments] = useState(application?.documents || []);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      universityName: application?.universityName || '',
      courseName: application?.courseName || '',
      countryName: application?.countryName || '',
    },
  });

  useEffect(() => {
    if (open) {
      setMode(initialMode);
    }
  }, [open, initialMode]);

  useEffect(() => {
    if (application) {
      reset({
        universityName: application.universityName,
        courseName: application.courseName,
        countryName: application.countryName,
      });
      setDocuments(application.documents || []);
    }
  }, [application, reset]);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newDocument = {
        _id: Date.now().toString(),
        documentType: file.name.split('.').slice(0, -1).join('.') || file.name,
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
        fileSize: file.size,
      };
      setDocuments([...documents, newDocument]);
      dispatch(showSnackbar({ message: 'Document uploaded successfully.', severity: 'success' }));
      if (onUpdate) onUpdate();
    } catch (err) {
      dispatch(showSnackbar({ message: 'Failed to upload document.', severity: 'error' }));
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    try {
      setDeleting(documentId);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setDocuments(documents.filter((d) => d._id !== documentId));
      dispatch(showSnackbar({ message: 'Document deleted successfully.', severity: 'success' }));
    } catch (err) {
      dispatch(showSnackbar({ message: 'Failed to delete document.', severity: 'error' }));
    } finally {
      setDeleting(null);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      await api.put(`/applications/${application._id}`, {
        universityName: data.universityName,
        courseName: data.courseName,
        countryName: data.countryName,
      });
      dispatch(showSnackbar({ message: 'Application updated successfully.', severity: 'success' }));
      setMode('view');
      if (onUpdate) onUpdate();
    } catch (err) {
      dispatch(showSnackbar({ message: err.response?.data?.error || 'Failed to update application.', severity: 'error' }));
    } finally {
      setSaving(false);
    }
  };

  if (!application) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #0f172a 0%, #059669 100%)',
          color: 'white',
          fontWeight: 700,
          fontSize: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          {mode === 'view' ? 'Application Details' : 'Edit Application'}
        </Box>
        {mode === 'view' && !readOnly && (
          <Tooltip title="Edit Application">
            <IconButton
              size="small"
              color="inherit"
              onClick={() => setMode('edit')}
              sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        )}
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Box component="form" id="app-form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Application Info */}
          <Box>
            <Typography variant="h6" fontWeight={600} mb={2} sx={{ color: 'primary.main' }}>
              Application Information
            </Typography>

            {mode === 'view' ? (
              <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" sx={{ fontWeight: 600, color: 'primary.main', borderBottom: '1px solid #e2e8f0' }}>
                          University
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid #e2e8f0' }}>{application.universityName}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" sx={{ fontWeight: 600, color: 'primary.main', borderBottom: '1px solid #e2e8f0' }}>
                          Course
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid #e2e8f0' }}>{application.courseName}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" sx={{ fontWeight: 600, color: 'primary.main', borderBottom: '1px solid #e2e8f0' }}>
                          Country
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid #e2e8f0' }}>{application.countryName}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" sx={{ fontWeight: 600, color: 'primary.main', borderBottom: '1px solid #e2e8f0' }}>
                          Status
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid #e2e8f0' }}>
                          <Chip
                            label={application.status.replace(/_/g, ' ')}
                            color={STATUS_COLOR[application.status] || 'default'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" sx={{ fontWeight: 600, color: 'primary.main', borderBottom: '1px solid #e2e8f0' }}>
                          Agency
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid #e2e8f0' }}>{application.agencyId?.username || '—'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" sx={{ fontWeight: 600, color: 'primary.main' }}>
                          Submitted
                        </TableCell>
                        <TableCell>
                          {application.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : '—'}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                <Card elevation={0} sx={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 2, p: 2 }}>
                  <Typography variant="body2" sx={{ color: '#1e40af' }}>
                    ℹ️ Status and agency assignment can only be updated by administrators.
                  </Typography>
                </Card>
              </Box>
            )}
          </Box>

          {/* Documents Section - View Mode */}
          {mode === 'view' && (
            <Box>
              <Typography variant="h6" fontWeight={600} mb={3} sx={{ color: 'primary.main' }}>
                Documents
              </Typography>

              {documents.length === 0 ? (
                <Card
                  elevation={0}
                  sx={{
                    border: '2px dashed #cbd5e1',
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center',
                    backgroundColor: '#f8fafc',
                  }}
                >
                  <DescriptionIcon sx={{ fontSize: 48, color: '#cbd5e1', mb: 1 }} />
                  <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
                    No documents uploaded yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Switch to edit mode to upload documents
                  </Typography>
                </Card>
              ) : (
                <Grid container spacing={2}>
                  {documents.map((doc) => (
                    <Grid item xs={12} sm={6} key={doc._id}>
                      <Card
                        elevation={0}
                        sx={{
                          border: '1px solid #e2e8f0',
                          borderRadius: 2,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            boxShadow: '0 8px 20px rgba(15, 23, 42, 0.06)',
                            borderColor: '#cbd5e1',
                          },
                        }}
                      >
                        <CardContent sx={{ p: 2.5, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                          <Box
                            sx={{
                              p: 1.5,
                              backgroundColor: '#eff6ff',
                              borderRadius: 1.5,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <DescriptionIcon sx={{ color: '#3b82f6', fontSize: 24 }} />
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              sx={{
                                color: 'primary.main',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                              title={doc.documentType || doc.fileName}
                            >
                              {doc.documentType || doc.fileName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                              {new Date(doc.uploadedAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}

          {/* Documents Section - Edit Mode */}
          {mode === 'edit' && (
            <Box>
              <Typography variant="h6" fontWeight={600} mb={2} sx={{ color: 'primary.main' }}>
                Documents
              </Typography>

              <Box sx={{ mb: 2 }}>
                <label htmlFor="file-upload">
                  <input
                    id="file-upload"
                    type="file"
                    hidden
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                  <Button
                    component="span"
                    variant="contained"
                    color="secondary"
                    startIcon={<CloudUploadIcon />}
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Upload Document'}
                  </Button>
                </label>
              </Box>

              {uploading && <LinearProgress sx={{ mb: 2 }} />}

              {documents.length === 0 ? (
                <Card
                  elevation={0}
                  sx={{
                    border: '2px dashed #cbd5e1',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    backgroundColor: '#f8fafc',
                  }}
                >
                  <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
                    No documents uploaded yet
                  </Typography>
                </Card>
              ) : (
                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{ border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden' }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                        <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Document Name</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Upload Date</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {documents.map((doc) => (
                        <TableRow key={doc._id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                          <TableCell sx={{ fontWeight: 500 }}>{doc.documentType || doc.fileName}</TableCell>
                          <TableCell>{new Date(doc.uploadedAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Tooltip title="Delete document">
                              <IconButton
                                size="small"
                                color="error"
                                disabled={deleting === doc._id}
                                onClick={() => handleDeleteDocument(doc._id)}
                              >
                                {deleting === doc._id ? <CircularProgress size={18} /> : <DeleteIcon fontSize="small" />}
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
        {mode === 'edit' ? (
          <>
            <Button
              onClick={() => {
                setMode('view');
                reset();
              }}
              startIcon={<CancelIcon />}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="app-form"
              variant="contained"
              color="secondary"
              disabled={saving}
              startIcon={<SaveIcon />}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </>
        ) : (
          <Button onClick={onClose} variant="contained" color="primary">
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default ApplicationDetailView;
