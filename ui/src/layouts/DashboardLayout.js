import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectSidebarOpen } from '../store/slices/uiSlice';
import Sidebar from '../components/common/Sidebar';
import TopBar from '../components/common/TopBar';
import Snackbar from '../components/common/AppSnackbar';

const SIDEBAR_WIDTH = 260;

function DashboardLayout() {
  const sidebarOpen = useSelector(selectSidebarOpen);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <TopBar sidebarWidth={SIDEBAR_WIDTH} />
      <Sidebar width={SIDEBAR_WIDTH} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: sidebarOpen ? 0 : `-${SIDEBAR_WIDTH}px`,
          transition: 'margin 0.2s',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
      <Snackbar />
    </Box>
  );
}

export default DashboardLayout;
