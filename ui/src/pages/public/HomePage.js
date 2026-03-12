import React from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import PublicIcon from '@mui/icons-material/Public';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

const FEATURES = [
  { icon: <SchoolIcon fontSize="large" color="primary" />, title: 'Top Universities', desc: 'Apply to leading medical universities abroad with expert guidance.' },
  { icon: <PublicIcon fontSize="large" color="primary" />, title: 'Multiple Countries', desc: 'Explore opportunities across Russia, Kazakhstan, Georgia, and more.' },
  { icon: <AssignmentTurnedInIcon fontSize="large" color="primary" />, title: 'Easy Application', desc: 'Track your application status at every step of the process.' },
];

function HomePage() {
  return (
    <Box>
      {/* Hero */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 10, textAlign: 'center' }}>
        <Container>
          <Typography variant="h3" fontWeight={700} gutterBottom>Your Gateway to Global Medical Education</Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>Apply to top universities abroad. Track status. Get expert support.</Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant="contained" color="secondary" size="large" component={Link} to="/register">Get Started</Button>
            <Button variant="outlined" color="inherit" size="large" component={Link} to="/login">Sign In</Button>
          </Box>
        </Container>
      </Box>

      {/* Features */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>Why FTO.EDU?</Typography>
        <Grid container spacing={4} mt={2}>
          {FEATURES.map((f) => (
            <Grid item xs={12} md={4} key={f.title}>
              <Card elevation={2} sx={{ textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Box mb={2}>{f.icon}</Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>{f.title}</Typography>
                  <Typography color="text.secondary">{f.desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default HomePage;
