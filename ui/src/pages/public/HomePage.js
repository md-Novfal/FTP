import React from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import PublicIcon from '@mui/icons-material/Public';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const FEATURES = [
  {
    icon: <SchoolIcon />,
    title: 'Top Universities',
    desc: 'Apply to leading medical universities abroad with expert guidance.',
    color: '#3b82f6',
  },
  {
    icon: <PublicIcon />,
    title: 'Multiple Countries',
    desc: 'Explore opportunities across Russia, Kazakhstan, Georgia, and more.',
    color: '#059669',
  },
  {
    icon: <AssignmentTurnedInIcon />,
    title: 'Easy Application',
    desc: 'Track your application status at every step of the process.',
    color: '#f59e0b',
  },
];

function HomePage() {
  return (
    <Box sx={{ backgroundColor: '#ffffff' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #059669 100%)',
          color: 'white',
          py: { xs: 8, md: 14 },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            right: '-50%',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 3,
              fontSize: { xs: '2rem', md: '3.5rem' },
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            Your Gateway to Global Medical Education
          </Typography>
          <Typography
            variant="h5"
            sx={{
              opacity: 0.9,
              mb: 5,
              fontSize: { xs: '1rem', md: '1.25rem' },
              fontWeight: 400,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Apply to top universities abroad. Track status. Get expert support.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              component={Link}
              to="/register"
              endIcon={<ArrowForwardIcon />}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: '0 8px 24px rgba(5, 150, 105, 0.3)',
                '&:hover': {
                  boxShadow: '0 12px 32px rgba(5, 150, 105, 0.4)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              component={Link}
              to="/login"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'white',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Sign In
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            textAlign: 'center',
            mb: 2,
            letterSpacing: '-0.01em',
            color: 'primary.main',
          }}
        >
          Why FTO.EDU?
        </Typography>
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            color: 'text.secondary',
            mb: 8,
            maxWidth: '500px',
            mx: 'auto',
            fontSize: '1rem',
          }}
        >
          Comprehensive platform for aspiring medical students seeking international education
        </Typography>

        <Grid container spacing={4}>
          {FEATURES.map((feature, idx) => (
            <Grid item xs={12} md={4} key={feature.title}>
              <Card
                sx={{
                  h: '100%',
                  borderRadius: 3,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: feature.color,
                  },
                  '&:hover': {
                    boxShadow: '0 12px 24px rgba(15, 23, 42, 0.08)',
                    borderColor: feature.color,
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box
                    sx={{
                      mb: 3,
                      display: 'inline-flex',
                      p: 2,
                      borderRadius: '12px',
                      backgroundColor: `rgba(${
                        feature.color === '#3b82f6'
                          ? '59, 130, 246'
                          : feature.color === '#059669'
                          ? '5, 150, 105'
                          : '245, 158, 11'
                      }, 0.1)`,
                      color: feature.color,
                      fontSize: '2.5rem',
                      lineHeight: 1,
                    }}
                  >
                    {React.cloneElement(feature.icon, { sx: { fontSize: '2.5rem' } })}
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: 'primary.main',
                      letterSpacing: '-0.005em',
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', lineHeight: 1.7, fontSize: '0.95rem' }}>
                    {feature.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)',
          borderTop: '1px solid #e2e8f0',
          borderBottom: '1px solid #e2e8f0',
          py: 8,
        }}
      >
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: 'primary.main',
              letterSpacing: '-0.01em',
            }}
          >
            Ready to Start Your Journey?
          </Typography>
          <Typography sx={{ color: 'text.secondary', mb: 4, fontSize: '1rem' }}>
            Join thousands of students who have successfully gained admission to top universities worldwide.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={Link}
            to="/register"
            sx={{
              px: 6,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              boxShadow: '0 8px 24px rgba(5, 150, 105, 0.3)',
            }}
          >
            Get Started Today
          </Button>
        </Container>
      </Box>
    </Box>
  );
}

export default HomePage;
