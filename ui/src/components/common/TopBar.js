import { AppBar, Toolbar, IconButton, Typography, Badge, Box, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { selectUnreadCount } from '../../store/slices/notificationSlice';
import { selectCurrentUser, logout } from '../../store/slices/authSlice';

function TopBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const unreadCount = useSelector(selectUnreadCount);
  const user = useSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppBar position="fixed" elevation={0} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ py: 1.5 }}>
        <Tooltip title="Toggle Sidebar" placement="bottom">
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => dispatch(toggleSidebar())}
            sx={{
              mr: 2,
              color: 'text.primary',
              '&:hover': {
                backgroundColor: 'rgba(5, 150, 105, 0.1)',
                color: 'secondary.main',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        </Tooltip>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            fontSize: '1.1rem',
            background: 'linear-gradient(135deg, #0f172a 0%, #059669 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          FTO.EDU
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title={`${unreadCount} unread notifications`} placement="bottom">
            <IconButton
              color="inherit"
              sx={{
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'rgba(5, 150, 105, 0.1)',
                  color: 'secondary.main',
                },
              }}
            >
              <Badge badgeContent={unreadCount} color="error" overlap="circular">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Typography
            variant="body2"
            sx={{
              color: 'text.primary',
              fontWeight: 500,
              maxWidth: 200,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {user?.username || user?.email || user?.phone}
          </Typography>
          <Tooltip title="Logout" placement="bottom">
            <IconButton
              color="inherit"
              onClick={handleLogout}
              sx={{
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: 'error.main',
                },
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
