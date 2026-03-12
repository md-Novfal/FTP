import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Badge, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { selectUnreadCount } from '../../store/slices/notificationSlice';
import { selectCurrentUser } from '../../store/slices/authSlice';

function TopBar({ sidebarWidth }) {
  const dispatch = useDispatch();
  const unreadCount = useSelector(selectUnreadCount);
  const user = useSelector(selectCurrentUser);

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton color="inherit" edge="start" onClick={() => dispatch(toggleSidebar())} sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>FTO.EDU</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="inherit">
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Typography variant="body2" sx={{ ml: 1 }}>
            {user?.email || user?.phone}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
