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
        <Box component="footer" sx={{ bgcolor: 'background.paper', pt: 6, pb: 3, mt: 'auto', borderTop: '1px solid', borderColor: 'divider' }}>
            <Container maxWidth="xl">
                <Grid container spacing={4} sx={{ mb: 6 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                        <FooterSection 
                            title="We're Always Here To Help" 
                            links={["Help Center", "Contact Us"]} 
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                        <FooterSection 
                            title="Fabrics" 
                            links={["Cotton", "Silk", "Wool", "Linen", "Velvet"]} 
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                        <FooterSection 
                            title="Yarns & Threads" 
                            links={["Embroidery", "Knitting", "Crochet", "Sewing Threads"]} 
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                        <FooterSection 
                            title="Sewing Essentials" 
                            links={["Machines", "Needles", "Scissors", "Measuring Tools"]} 
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                        <FooterSection 
                            title="Accessories" 
                            links={["Buttons", "Zippers", "Ribbons", "Lace & Trims"]} 
                        />
                    </Grid>
                </Grid>

                <Box sx={{ pt: 4, borderTop: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                    <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Connect with us</Typography>
                        <Stack direction="row" spacing={1}>
                            <IconButton color="default" sx={{ bgcolor: 'action.hover', '&:hover': { bgcolor: 'primary.main' } }}><FacebookIcon /></IconButton>
                            <IconButton color="default" sx={{ bgcolor: 'action.hover', '&:hover': { bgcolor: 'primary.main' } }}><TwitterIcon /></IconButton>
                            <IconButton color="default" sx={{ bgcolor: 'action.hover', '&:hover': { bgcolor: 'primary.main' } }}><InstagramIcon /></IconButton>
                            <IconButton color="default" sx={{ bgcolor: 'action.hover', '&:hover': { bgcolor: 'primary.main' } }}><LinkedInIcon /></IconButton>
                        </Stack>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                        © {new Date().getFullYear()} Lyver for Textiles. All Rights Reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}

export default Footer;