import React, { useState } from "react";
import LeftHeader from "./LeftHeader";
import RightHeader from "./RightHeader";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Box, InputBase, IconButton, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const Header = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?keyword=${keyword}`);
    }
  };

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
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src="/assets/logo.png" alt="Twill Home" style={{ height: 50, filter: 'brightness(0) invert(1)' }} />
        </Box>

        {/* Desktop Navigation Links */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4, ml: 6 }}>
            {['SHOP', 'BATH', 'BEDROOM', 'LIVING', 'TRADE'].map((item) => (
                <Box 
                    component="a" 
                    href={item === 'SHOP' ? '/' : '#'} 
                    key={item}
                    sx={{ 
                        color: 'white', 
                        textDecoration: 'none', 
                        fontSize: '0.85rem', 
                        fontWeight: 500, 
                        letterSpacing: '0.1em',
                        transition: 'color 0.2s',
                        '&:hover': { color: 'secondary.main' } 
                    }}
                >
                    {item}
                </Box>
            ))}
        </Box>
        
        {/* Desktop Search */}
        <Box sx={{ flexGrow: 1,  maxWidth: '400px', ml: 'auto', display: { xs: 'none', md: 'block' } }}>
             <Paper
                component="form"
                onSubmit={handleSearch}
                sx={{ 
                    p: '2px 4px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    width: '100%',
                    height: 35,
                    borderRadius: 0, // Squared
                    bgcolor: 'rgba(255,255,255,0.1)', // Translucent
                    color: 'white',
                    borderBottom: '1px solid rgba(255,255,255,0.3)',
                    boxShadow: 'none'
                }}
             >
                <InputBase
                    sx={{ ml: 1, flex: 1, fontSize: '0.8rem', color: 'white', '&::placeholder': { color: 'rgba(255,255,255,0.6)', opacity: 1 } }}
                    placeholder="Search collections..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <IconButton type="submit" sx={{ p: '5px', color: 'white' }} aria-label="search">
                    <SearchIcon fontSize="small" />
                </IconButton>
             </Paper>
        </Box>

        <RightHeader />
      </Toolbar>
      
      {/* Mobile Search Bar */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, bgcolor: 'background.paper', p: 1.5, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
         <Paper
            component="form"
            onSubmit={handleSearch}
            sx={{ 
                p: '2px 4px', 
                display: 'flex', 
                alignItems: 'center', 
                width: '100%',
                height: 40,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: 'none'
            }}
         >
            <InputBase
                sx={{ ml: 1, flex: 1, fontSize: '0.875rem' }}
                placeholder="What are you looking for?"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />
         </Paper>
      </Box>
    </AppBar>
  );
};

export default Header;
