import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { selectSnackbar, hideSnackbar } from '../../store/slices/uiSlice';

function AppSnackbar() {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector(selectSnackbar);

  return (
    <Snackbar open={open} autoHideDuration={4000} onClose={() => dispatch(hideSnackbar())}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <Alert severity={severity} onClose={() => dispatch(hideSnackbar())} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default AppSnackbar;
