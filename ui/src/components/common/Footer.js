import React from 'react';
import { Box, Typography, Container, Grid, Link } from '@mui/material';

function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: 'About', href: '#' },
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Contact', href: '#' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        py: 6,
        px: 2,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                mb: 2,
                fontSize: '1.1rem',
                letterSpacing: '-0.01em',
              }}
            >
              FTO.EDU
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, fontSize: '0.9rem' }}>
              Gateway to global medical education for aspiring students.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={9}>
            <Grid container spacing={4}>
              <Grid item xs={6} sm={4} md={3}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: 'primary.main',
                    mb: 2,
                    fontSize: '0.9rem',
                  }}
                >
                  Product
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {['Features', 'Pricing', 'Security'].map((item) => (
                    <Link
                      key={item}
                      href="#"
                      sx={{
                        color: 'text.secondary',
                        textDecoration: 'none',
                        fontSize: '0.85rem',
                        transition: 'color 0.2s ease',
                        '&:hover': {
                          color: 'secondary.main',
                        },
                      }}
                    >
                      {item}
                    </Link>
                  ))}
                </Box>
              </Grid>

              <Grid item xs={6} sm={4} md={3}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: 'primary.main',
                    mb: 2,
                    fontSize: '0.9rem',
                  }}
                >
                  Company
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {['About', 'Blog', 'Careers'].map((item) => (
                    <Link
                      key={item}
                      href="#"
                      sx={{
                        color: 'text.secondary',
                        textDecoration: 'none',
                        fontSize: '0.85rem',
                        transition: 'color 0.2s ease',
                        '&:hover': {
                          color: 'secondary.main',
                        },
                      }}
                    >
                      {item}
                    </Link>
                  ))}
                </Box>
              </Grid>

              <Grid item xs={6} sm={4} md={3}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: 'primary.main',
                    mb: 2,
                    fontSize: '0.9rem',
                  }}
                >
                  Legal
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {['Privacy', 'Terms', 'Cookies'].map((item) => (
                    <Link
                      key={item}
                      href="#"
                      sx={{
                        color: 'text.secondary',
                        textDecoration: 'none',
                        fontSize: '0.85rem',
                        transition: 'color 0.2s ease',
                        '&:hover': {
                          color: 'secondary.main',
                        },
                      }}
                    >
                      {item}
                    </Link>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Box
          sx={{
            pt: 4,
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
            © {currentYear} FTO.EDU. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: 'secondary.main',
                  },
                }}
              >
                {link.label}
              </Link>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
