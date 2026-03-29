import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Divider, Box, useTheme } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';

import { selectCurrentUser } from '../../store/slices/authSlice';
import { selectSidebarOpen } from '../../store/slices/uiSlice';

const MENU = {
  super_admin: [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { label: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
    { label: 'Applications', icon: <AssignmentIcon />, path: '/admin/applications' },
  ],
  admin: [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { label: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
    { label: 'Applications', icon: <AssignmentIcon />, path: '/admin/applications' },
  ],
  agency: [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/agency' },
    { label: 'Applications', icon: <AssignmentIcon />, path: '/agency/applications' },
  ],
  student: [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/student' },
    { label: 'My Profile', icon: <PersonIcon />, path: '/student/profile' },
    { label: 'Applications', icon: <AssignmentIcon />, path: '/student/applications' },
  ],
};

function Sidebar({ width }) {
  const theme = useTheme();
  const user = useSelector(selectCurrentUser);
  const open = useSelector(selectSidebarOpen);
  const navigate = useNavigate();
  const location = useLocation();

  const items = MENU[user?.role] || [];

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          boxShadow: '2px 0 8px rgba(15, 23, 42, 0.04)',
        },
      }}
    >
      <Toolbar />
      <Divider sx={{ margin: '8px 0', borderColor: '#e2e8f0' }} />
      <Box sx={{ px: 1.5, py: 2 }}>
        <List sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
          {items.map((item) => {
            const isSelected = location.pathname === item.path;
            return (
              <ListItem
                button
                key={item.path}
                selected={isSelected}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 10,
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  margin: '4px 0',
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(5, 150, 105, 0.12)',
                    color: 'secondary.main',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'rgba(5, 150, 105, 0.18)',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'secondary.main',
                    },
                  },
                  '&:hover:not(.Mui-selected)': {
                    backgroundColor: 'rgba(15, 23, 42, 0.05)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isSelected ? 'secondary.main' : 'text.secondary',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    sx: {
                      fontSize: '0.95rem',
                      fontWeight: isSelected ? 600 : 500,
                      color: isSelected ? 'secondary.main' : 'text.primary',
                    },
                  }}
                />
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
}

export default Sidebar;
