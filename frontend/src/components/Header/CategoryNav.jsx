import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { fetchCategories } from "../../redux/slices/categorySlice";
import { Box, Container, Typography, Menu, MenuItem, Button, styled } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const NavLink = styled(RouterLink)(({ theme }) => ({
    textDecoration: 'none',
    color: theme.palette.text.secondary,
    fontWeight: 700,
    fontSize: '0.8125rem', // 13px
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    transition: 'color 0.2s',
    '&:hover': {
        color: theme.palette.primary.main, // Noon yellow or blue? Noon usually uses blue for links, yellow for primary actions. Sticking to theme primary for now or custom blue.
    }
}));

const CategoryNav = () => {
    const { categories } = useSelector((state) => state.categoryState);
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ 
            bgcolor: 'background.paper', 
            borderBottom: 1, 
            borderColor: 'divider', 
            position: { md: 'sticky' }, 
            top: { md: 64, lg: 70 }, // Height of main header
            zIndex: 1000,
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}>
            <Container maxWidth="xl" sx={{ px: { xs: 2, lg: 4 } }}>
                 <Box sx={{ display: 'flex', alignItems: 'center', height: 48, gap: 4 }}>
                    {/* ALL CATEGORIES DROPDOWN */}
                    <Box 
                        onMouseEnter={handleMenuOpen} 
                        onMouseLeave={handleMenuClose}
                        sx={{ height: '100%', display: 'flex', alignItems: 'center' }}
                    >
                         <Button
                            color="primary"
                            endIcon={<KeyboardArrowDownIcon sx={{ 
                                transition: 'transform 0.3s', 
                                transform: open ? 'rotate(180deg)' : 'rotate(0deg)' 
                            }} />}
                            sx={{ 
                                fontWeight: 700, 
                                fontSize: '0.8125rem',
                                color: 'primary.dark', // Use a darker shade for visibility
                                whiteSpace: 'nowrap',
                                px: 0,
                                minWidth: 'auto',
                                mr: 2,
                                borderRight: 1,
                                borderColor: 'divider',
                                pr: 2,
                                height: '24px',
                                borderRadius: 0
                            }}
                            component={RouterLink}
                            to="/"
                        >
                            ALL CATEGORIES
                        </Button>

                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleMenuClose}
                            MenuListProps={{ 
                                onMouseEnter: () => setAnchorEl(anchorEl), // Keep open when hovering menu
                                onMouseLeave: handleMenuClose 
                            }}
                            PaperProps={{
                                sx: {
                                    mt: 0,
                                    width: 250,
                                    maxHeight: 400,
                                    boxShadow: 4,
                                    borderRadius: '0 0 8px 8px'
                                }
                            }}
                            disableScrollLock
                        >
                            {categories && categories.map((category) => (
                                <MenuItem 
                                    key={category._id || category.id} 
                                    component={RouterLink} 
                                    to={`/${category.title || category.name}`}
                                    onClick={handleMenuClose}
                                    sx={{ justifyContent: 'space-between', fontSize: '0.875rem', py: 1.5 }}
                                >
                                    <Box component="span" sx={{ textTransform: 'capitalize' }}>
                                        {(category.title || category.name || '').toLowerCase()}
                                    </Box>
                                    <ChevronRightIcon fontSize="small" color="disabled" />
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    {/* Horizontal Scrollable List */}
                    <Box sx={{ 
                        flex: 1, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 3, 
                        overflowX: 'auto', 
                        height: '100%',
                        '&::-webkit-scrollbar': { display: 'none' },
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none'
                    }}>
                        {categories && categories.map((category) => (
                            <NavLink 
                                key={`nav-${category._id || category.id}`}
                                to={`/${category.title || category.name}`}
                            >
                                {(category.title || category.name || '').toUpperCase()}
                            </NavLink>
                        ))}
                    </Box>
                 </Box>
            </Container>
        </Box>
    );
};

export default CategoryNav;
