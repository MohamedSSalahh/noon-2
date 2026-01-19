import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, Stack } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
    
    // Helper for footer links to keep code clean
    const FooterLink = ({ children }) => (
        <Link 
            href="#" 
            underline="none" 
            color="text.secondary" 
            sx={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                mb: 1, 
                '&:hover': { color: 'text.primary' } 
            }}
        >
            {children}
        </Link>
    );

    const FooterSection = ({ title, links }) => (
        <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: 'uppercase', mb: 2 }}>
                {title}
            </Typography>
            {links.map((link) => (
                <FooterLink key={link}>{link}</FooterLink>
            ))}
        </Box>
    );

    return (
        <Box component="footer" sx={{ bgcolor: '#081424', color: 'rgba(255,255,255,0.7)', pt: 10, pb: 4, mt: 'auto' }}>
            <Container maxWidth="xl">
                <Grid container spacing={6} sx={{ mb: 8 }}>
                    {/* Brand Column */}
                    <Grid size={{ xs: 12, md: 4 }}>
                         <Box sx={{ mb: 3 }}>
                            <img src="/assets/logo.png" alt="Twill Home" style={{ height: 40, filter: 'brightness(0) invert(1)' }} />
                         </Box>
                         <Typography variant="body2" sx={{ lineHeight: 1.8, maxWidth: 300, mb: 3 }}>
                             Elevating everyday living with premium textiles. Crafted with care, designed for comfort, and built to last a lifetime.
                         </Typography>
                    </Grid>

                    <Grid size={{ xs: 6, md: 2 }}>
                        <FooterSection 
                            title="Shop" 
                            links={["Bath Collections", "Bedroom", "Living Room", "New Arrivals", "Best Sellers"]} 
                        />
                    </Grid>
                    <Grid size={{ xs: 6, md: 2 }}>
                        <FooterSection 
                            title="Support" 
                            links={["Help Center", "Shipping & Returns", "Care Guide", "Trade Program", "Contact Us"]} 
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 700, textTransform: 'uppercase', mb: 2, letterSpacing: '0.05em' }}>
                            Stay in the Loop
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            Subscribe to receive updates, access to exclusive deals, and more.
                        </Typography>
                        <Box sx={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.3)', pb: 1 }}>
                            <input 
                                type="email" 
                                placeholder="Enter your email" 
                                style={{ background: 'transparent', border: 'none', color: 'white', flex: 1, outline: 'none' }}
                            />
                            <Typography sx={{ color: 'secondary.main', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>SUBSCRIBE</Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Box sx={{ pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                    <Typography variant="caption" sx={{ letterSpacing: '0.05em' }}>
                        © {new Date().getFullYear()} TWILL HOME. All Rights Reserved.
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <IconButton size="small" sx={{ color: 'white', '&:hover': { color: 'secondary.main' } }}><FacebookIcon fontSize="small" /></IconButton>
                        <IconButton size="small" sx={{ color: 'white', '&:hover': { color: 'secondary.main' } }}><InstagramIcon fontSize="small" /></IconButton>
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
}

export default Footer;