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
          minHeight: { xs: '64px', lg: '70px' }
      }}>
        <LeftHeader />
        
        {/* Desktop Search */}
        <Box sx={{ flexGrow: 1,  maxWidth: '800px', display: { xs: 'none', md: 'block' } }}>
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
                    boxShadow: 'none'
                }}
             >
                <InputBase
                    sx={{ ml: 1, flex: 1, fontSize: '0.875rem' }}
                    placeholder="What are you looking for?"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <IconButton type="submit" sx={{ p: '10px', color: 'primary.main' }} aria-label="search">
                    <SearchIcon />
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
