import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0f172a',      // Deep navy - premium, authoritative
      light: '#1e293b',
      dark: '#020617',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#059669',      // Emerald green - sophisticated, aspirational
      light: '#10b981',
      dark: '#047857',
      contrastText: '#ffffff',
    },
    accent: {
      main: '#3b82f6',      // Vibrant blue - for highlights
    },
    background: {
      default: '#f9fafb',   // Very subtle gray - refined, not bright white
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
      disabled: '#cbd5e1',
    },
    divider: '#e2e8f0',
    success: {
      main: '#10b981',
    },
    warning: {
      main: '#f59e0b',
    },
    error: {
      main: '#ef4444',
    },
    info: {
      main: '#3b82f6',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Trebuchet MS", "Roboto", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '-0.005em',
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 600,
      letterSpacing: 0,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 600,
      letterSpacing: '0.01em',
      lineHeight: 1.6,
    },
    body1: {
      fontSize: '0.95rem',
      fontWeight: 400,
      letterSpacing: '0.005em',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.85rem',
      fontWeight: 400,
      letterSpacing: '0.005em',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      letterSpacing: '0.005em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    // Premium Button Styling
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 10,
          padding: '10px 20px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          fontSize: '0.95rem',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 10px 20px rgba(15, 23, 42, 0.08)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
          '&:hover': {
            boxShadow: '0 12px 24px rgba(15, 23, 42, 0.12)',
          },
        },
        outlined: {
          borderColor: '#e2e8f0',
          '&:hover': {
            borderColor: '#cbd5e1',
            backgroundColor: '#f1f5f9',
          },
        },
      },
    },
    // Premium Card Styling
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 8px 20px rgba(15, 23, 42, 0.06)',
            borderColor: '#cbd5e1',
          },
          backgroundColor: '#ffffff',
        },
      },
    },
    // Premium TextField Styling
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            fontSize: '0.95rem',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '& fieldset': {
              borderColor: '#e2e8f0',
              borderWidth: 1,
            },
            '&:hover fieldset': {
              borderColor: '#cbd5e1',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#3b82f6',
              borderWidth: 1.5,
              boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
            },
          },
          '& .MuiInputBase-input::placeholder': {
            color: '#94a3b8',
            opacity: 1,
          },
        },
      },
    },
    // Premium Chip Styling
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          fontSize: '0.8rem',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.02)',
          },
        },
        filled: {
          backgroundColor: '#f1f5f9',
          color: '#0f172a',
        },
      },
    },
    // Premium Table Styling
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: 'collapse',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: '#e2e8f0',
          padding: '14px 16px',
          fontSize: '0.9rem',
        },
        head: {
          backgroundColor: '#f8fafc',
          fontWeight: 600,
          color: '#0f172a',
          borderBottom: '1px solid #e2e8f0',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.15s ease',
          '&:hover': {
            backgroundColor: '#f8fafc',
          },
        },
      },
    },
    // Premium AppBar Styling
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.06)',
          backgroundColor: '#ffffff',
          color: '#0f172a',
          borderBottom: '1px solid #e2e8f0',
        },
      },
    },
    // Premium Drawer Styling
    MuiDrawer: {
      styleOverrides: {
        root: {
          '& .MuiDrawer-paper': {
            borderRight: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            boxShadow: '2px 0 8px rgba(15, 23, 42, 0.04)',
          },
        },
      },
    },
    // Premium ListItem Styling
    MuiListItem: {
      styleOverrides: {
        root: {
          transition: 'all 0.15s ease',
          borderRadius: 8,
          margin: '0 8px',
          '&:hover': {
            backgroundColor: '#f1f5f9',
          },
          '&.Mui-selected': {
            backgroundColor: '#eff6ff',
            color: '#0f172a',
            '&:hover': {
              backgroundColor: '#e0f2fe',
            },
          },
        },
      },
    },
    // Premium Paper Styling
    MuiPaper: {
      styleOverrides: {
        root: {
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
        },
      },
    },
  },
});

export default theme;
