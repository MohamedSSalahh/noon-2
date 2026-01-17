import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  IconButton, 
  Link,
  Drawer,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook'; // Using Facebook as placeholder for TikTok/Social
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';

const TwillHome = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  const navLinks = [
    { name: 'BATH', href: '#' },
    { name: 'BEDROOM', href: '#' },
    { name: 'LIVING', href: '#' },
    { name: 'TRADE', href: '#' },
    { name: 'CONTACT', href: '#' },
  ];

  return (
    <Box sx={{ bgcolor: '#F9F8F6', minHeight: '100vh', fontFamily: 'serif' }}>
      
      {/* Navigation */}
      <Box component="nav" sx={{ bgcolor: '#0B1C33', color: 'white', py: 2 }}> {/* Midnight Navy */}
        <Container maxWidth="xl" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
             <img src="/assets/logo.png" alt="Twill Home" style={{ height: 50, filter: 'brightness(0) invert(1)' }} /> 
             {/* Using filter to invert logo to white if it's dark, or just rely on the design provided which had navy bg */}
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4 }}>
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                underline="none" 
                color="inherit" 
                sx={{ fontSize: '0.9rem', letterSpacing: '0.1em', fontWeight: 500, '&:hover': { color: '#D4AF37' } }} // Champagne Gold hover
              >
                {link.name}
              </Link>
            ))}
          </Box>

          {/* Icons/Mobile Toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
             <IconButton color="inherit">
                <ShoppingBagOutlinedIcon />
             </IconButton>
             <IconButton 
              color="inherit" 
              onClick={toggleDrawer}
              sx={{ display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Container>
      </Box>

       {/* Hero Section */}
       <Box sx={{ position: 'relative', height: '85vh', overflow: 'hidden', bgcolor: '#EBE9E4' }}> {/* Off-white beige bg */}
          <Box 
            component="img"
            src="/assets/hero.png"
            alt="Luxury Towels"
            sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                filter: 'brightness(0.95)'
            }}
          />
          <Box sx={{ 
              position: 'absolute', 
              top: '40%', 
              left: { xs: '5%', md: '10%' }, 
              transform: 'translateY(-50%)',
              maxWidth: 600
          }}>
              <Typography variant="h2" component="h1" sx={{ 
                  color: '#0B1C33', 
                  fontFamily: '"Playfair Display", serif', 
                  fontWeight: 400,
                  mb: 2,
                  lineHeight: 1.1,
                  fontSize: { xs: '2.5rem', md: '4rem' }
              }}>
                  Wrapped in <br/>
                  <span style={{ fontWeight: 'bold' }}>Quality.</span>
              </Typography>
              <Button 
                variant="contained" 
                sx={{ 
                    bgcolor: '#0B1C33', 
                    color: 'white', 
                    px: 4, 
                    py: 1.5,
                    borderRadius: 0,
                    letterSpacing: '0.1em',
                    '&:hover': { bgcolor: '#1a2e4d' }
                }}
            >
                EXPLORE COLLECTIONS
            </Button>
          </Box>
       </Box>

       {/* Collections Grid */}
       <Container maxWidth="lg" sx={{ py: 10 }}>
           <Typography align="center" variant="h6" sx={{ letterSpacing: '0.15em', color: '#0B1C33', mb: 6, textTransform: 'uppercase' }}>
               Premium Weaves For Every Home
           </Typography>
           
           <Grid container spacing={4}>
               {['Luxury Towels', 'Heirloom Blankets', 'Fine Linens'].map((item, index) => (
                   <Grid item xs={12} md={4} key={item}>
                       <Box sx={{ textAlign: 'center', cursor: 'pointer', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)' } }}>
                           <Box sx={{ 
                               height: 350, 
                               bgcolor: '#DDD', 
                               mb: 2,
                               backgroundImage: index === 0 ? 'url(/assets/hero.png)' : 'none', // Placeholder logic reuse hero
                               backgroundSize: 'cover'
                            }} /> 
                           <Typography variant="subtitle1" sx={{ letterSpacing: '0.1em', color: '#333' }}>{item.toUpperCase()}</Typography>
                       </Box>
                   </Grid>
               ))}
           </Grid>
       </Container>

       {/* The Twill Difference */}
       <Box sx={{ bgcolor: '#0B1C33', color: 'white', py: 10 }}>
           <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
               <Typography variant="h4" sx={{ fontFamily: '"Playfair Display", serif', mb: 8 }}>The Twill Difference</Typography>
               
               <Grid container spacing={4} justifyContent="center">
                   <Grid item xs={12} md={4}>
                         <Box sx={{ border: '1px solid rgba(255,255,255,0.2)', p: 4, borderRadius: '50%', width: 200, height: 200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="h2" sx={{ fontFamily: '"Playfair Display", serif' }}>W</Typography>
                         </Box>
                         <Typography variant="overline" display="block" sx={{ mt: 2 }}>High GSM for Absorbency</Typography>
                   </Grid>
                   {/* More items would go here */}
               </Grid>
           </Container>
       </Box>

       {/* Footer */}
       <Box sx={{ bgcolor: '#081424', color: 'rgba(255,255,255,0.6)', py: 6 }}>
           <Container maxWidth="lg">
               <Grid container justifyContent="space-between" alignItems="center">
                   <Grid item>
                        <img src="/assets/logo.png" alt="Twill Home" style={{ height: 40, filter: 'brightness(0) invert(1)' }} />
                   </Grid>
                   <Grid item>
                       <Box sx={{ display: 'flex', gap: 2 }}>
                           <InstagramIcon />
                           <FacebookIcon />
                       </Box>
                   </Grid>
               </Grid>
           </Container>
       </Box>

       {/* Mobile Drawer */}
       <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={toggleDrawer}
       >
         <Box sx={{ width: 250, pt: 4 }} role="presentation" onClick={toggleDrawer}>
            <List>
                {navLinks.map((text) => (
                    <ListItem button key={text.name}>
                        <ListItemText primary={text.name} />
                    </ListItem>
                ))}
            </List>
         </Box>
       </Drawer>

    </Box>
  );
};

export default TwillHome;
