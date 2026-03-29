import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Divider } from '@mui/material';
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
        '& .MuiDrawer-paper': { width, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Divider />
      <List>
        {items.map((item) => (
          <ListItem
            button
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default Sidebar;
