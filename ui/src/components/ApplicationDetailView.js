import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Chip,
  LinearProgress, Table, TableBody, TableCell, TableRow, CircularProgress, TableHead,
  TableContainer, Paper, TablePagination, IconButton, Tooltip,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '../store/slices/uiSlice';

const STATUS_COLOR = {
  apply: 'default', under_review: 'info', college_submitted: 'info',
  offer_letter: 'primary', interview: 'warning', admission_letter: 'primary',
  ministry_order: 'secondary', vfs: 'secondary', visa: 'success',
  ticket: 'success', arrived: 'success', rejected: 'error', on_hold: 'warning',
};

function ApplicationDetailView({ application, open, onClose, onUpdate }) {
  const dispatch = useDispatch();
  const [documents, setDocuments] = useState(application?.documents || []);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create a mock document object (placeholder - no actual GCP upload)
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

      // Simulate delete delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Remove document from local state (placeholder - no actual API call)
      setDocuments(documents.filter((d) => d._id !== documentId));
      dispatch(showSnackbar({ message: 'Document deleted successfully.', severity: 'success' }));
    } catch (err) {
      dispatch(showSnackbar({ message: 'Failed to delete document.', severity: 'error' }));
    } finally {
      setDeleting(null);
    }
  };

  if (!application) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 700 }}>
        Application Details
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
          {/* Application Info */}
          <Box>
            <Typography variant="h6" fontWeight={600} mb={2}>Application Information</Typography>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell component="th"><b>University</b></TableCell>
                  <TableCell>{application.universityName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th"><b>Course</b></TableCell>
                  <TableCell>{application.courseName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th"><b>Country</b></TableCell>
                  <TableCell>{application.countryName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th"><b>Status</b></TableCell>
                  <TableCell>
                    <Chip
                      label={application.status.replace(/_/g, ' ')}
                      color={STATUS_COLOR[application.status] || 'default'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th"><b>Agency</b></TableCell>
                  <TableCell>{application.agencyId?.username || '—'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th"><b>Submitted</b></TableCell>
                  <TableCell>
                    {application.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : '—'}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>

          {/* Documents Section */}
          <Box>
            <Typography variant="h6" fontWeight={600} mb={2}>Documents</Typography>

            {/* Upload Button */}
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
                  startIcon={<CloudUploadIcon />}
                  disabled={uploading}
                  size="small"
                >
                  {uploading ? 'Uploading...' : 'Upload Document'}
                </Button>
              </label>
            </Box>

            {/* Documents List */}
            {uploading && <LinearProgress sx={{ mb: 2 }} />}
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell><b>Document Name</b></TableCell>
                    <TableCell><b>Upload Date</b></TableCell>
                    <TableCell><b>Action</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {documents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                        No documents uploaded yet
                      </TableCell>
                    </TableRow>
                  ) : documents.slice(page * pageSize, (page + 1) * pageSize).map((doc) => (
                    <TableRow key={doc._id} hover>
                      <TableCell>{doc.documentType || doc.fileName}</TableCell>
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
              {documents.length > 0 && (
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={documents.length}
                  rowsPerPage={pageSize}
                  page={page}
                  onPageChange={(_, newPage) => setPage(newPage)}
                  onRowsPerPageChange={(event) => {
                    setPageSize(parseInt(event.target.value, 10));
                    setPage(0);
                  }}
                />
              )}
            </TableContainer>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ApplicationDetailView;
