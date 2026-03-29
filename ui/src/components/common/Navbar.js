import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, logout } from '../../store/slices/authSlice';

function Navbar() {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar sx={{ py: 1.5 }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'primary.main',
            fontWeight: 700,
            fontSize: '1.3rem',
            letterSpacing: '-0.01em',
            background: 'linear-gradient(135deg, #0f172a 0%, #059669 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            transition: 'all 0.3s ease',
            '&:hover': {
              opacity: 0.8,
            },
          }}
        >
          FTO.EDU
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {user ? (
            <>
              <Button
                color="inherit"
                component={Link}
                to={`/${user.role}`}
                sx={{
                  color: 'text.primary',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  '&:hover': {
                    color: 'secondary.main',
                    backgroundColor: 'rgba(5, 150, 105, 0.05)',
                  },
                }}
              >
                Dashboard
              </Button>
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{
                  color: 'text.primary',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  '&:hover': {
                    color: 'error.main',
                    backgroundColor: 'rgba(239, 68, 68, 0.05)',
                  },
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/login"
                sx={{
                  color: 'text.primary',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                color="secondary"
                component={Link}
                to="/register"
                sx={{
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
                  '&:hover': {
                    boxShadow: '0 8px 20px rgba(5, 150, 105, 0.35)',
                  },
                }}
              >
                Get Started
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
