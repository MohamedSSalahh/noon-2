import React, { useState } from "react";
import LeftHeader from "./LeftHeader";
import RightHeader from "./RightHeader";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Box, InputBase, IconButton, Paper, Button, Typography } from '@mui/material';
import { useLanguage } from "../../context/LanguageContext.jsx";

const Header = () => {
  const navigate = useNavigate();
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'primary.main', boxShadow: 'none' }}>
      <Toolbar sx={{ 
          maxWidth: '1440px', 
          width: '100%', 
          mx: 'auto', 
          px: { xs: 2, lg: 4 }, 
          gap: { xs: 2, lg: 4 },
          minHeight: { xs: '80px', lg: '90px' } // Taller header for luxury feel
      }}>
        {/* Logo Section */}
        <Box 
            sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                cursor: 'pointer' 
            }} 
            onClick={() => navigate('/')}
        >
            {/* Circular W Icon */}
            <Box sx={{
                width: 45,
                height: 45,
                borderRadius: '50%',
                border: '2px solid white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Playfair Display',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'white'
            }}>
                W
            </Box>
            
            {/* TWILL HOME Text */}
            <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <Typography 
                    sx={{ 
                        fontFamily: 'Playfair Display',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        color: 'white',
                        letterSpacing: '0.15em'
                    }}
                >
                    TWILL
                </Typography>
                <Typography 
                    sx={{ 
                        fontFamily: 'Inter',
                        fontSize: '0.65rem',
                        fontWeight: 400,
                        color: 'white',
                        letterSpacing: '0.2em',
                        mt: -0.3
                    }}
                >
                    HOME
                </Typography>
            </Box>
        </Box>

        {/* Desktop Navigation Links */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4, ml: 6, flexGrow: 1, justifyContent: 'center' }}>
            {['shop', 'bath', 'bedroom', 'living', 'trade', 'contact'].map((key) => (
                <Box 
                    component="a" 
                    href={key === 'shop' ? '/' : '#'} 
                    key={key}
                    sx={{ 
                        color: 'white', 
                        textDecoration: 'none', 
                        fontSize: '0.85rem', 
                        fontWeight: 500, 
                        letterSpacing: '0.1em',
                        transition: 'color 0.2s',
                        '&:hover': { color: 'secondary.main' },
                        position: 'relative'
                    }}
                >
                    {t(key)}
                </Box>
            ))}
        </Box>
        
        {/* Language Switcher */}
        <Button 
            onClick={toggleLanguage}
            sx={{ 
                color: 'white', 
                minWidth: 'auto', 
                ml: 2,
                fontFamily: 'inherit',
                fontSize: '0.85rem'
            }}
        >
            {language === 'en' ? 'AR' : 'EN'}
        </Button>

        <RightHeader />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
