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
      <TopBar />
      <Sidebar width={SIDEBAR_WIDTH} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: sidebarOpen ? 0 : `-${SIDEBAR_WIDTH}px`,
          transition: 'margin 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          backgroundColor: '#f9fafb',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar />
        <Box sx={{ px: 3, py: 2.5, flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Box>
      <Snackbar />
    </Box>
  );
}

export default DashboardLayout;
