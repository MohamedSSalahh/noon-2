import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBrands } from '../../redux/slices/brandSlice';
import { Box, Typography, Stack } from '@mui/material';

const BrandsSection = () => {
    const dispatch = useDispatch();
    const { brands, isLoading } = useSelector((state) => state.brandState);

    useEffect(() => {
        dispatch(fetchBrands());
    }, [dispatch]);

    if (isLoading) return null;
    if (!brands || brands.length === 0) return null;

    return (
        <Box sx={{ py: 4, my: 3, bgcolor: 'background.paper' }}>
            <Box sx={{ maxWidth: 1440, mx: 'auto', px: { xs: 2, lg: 4 } }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Shop By Brand</Typography>
                
                <Stack 
                    direction="row" 
                    spacing={3} 
                    sx={{ 
                        overflowX: 'auto', 
                        pb: 2,
                        '&::-webkit-scrollbar': { display: 'none' },
                        msOverflowStyle: 'none',  /* IE and Edge */
                        scrollbarWidth: 'none',  /* Firefox */
                    }}
                >
                    {brands.map((brand) => (
                         <Box 
                            key={brand._id} 
                            sx={{ 
                                minWidth: { xs: 80, sm: 100 }, 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                cursor: 'pointer',
                                '&:hover .brand-image': {
                                    boxShadow: 3,
                                    transform: 'scale(1.05)'
                                },
                                '&:hover .brand-name': {
                                    color: 'primary.main'
                                }
                            }}
                        >
                            <Box 
                                className="brand-image"
                                sx={{ 
                                    width: { xs: 80, sm: 100 }, 
                                    height: { xs: 80, sm: 100 }, 
                                    borderRadius: '50%', 
                                    bgcolor: 'white', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    p: 2,
                                    boxShadow: 1,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    transition: 'all 0.3s',
                                    mb: 1.5,
                                    overflow: 'hidden'
                                }}
                            >
                                <img 
                                    src={brand.image} 
                                    alt={brand.name} 
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                            </Box>
                            <Typography 
                                className="brand-name"
                                variant="body2" 
                                sx={{ fontWeight: 500, color: 'text.secondary', textAlign: 'center', transition: 'color 0.2s', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                            >
                                {brand.name}
                            </Typography>
                        </Box>
                    ))}
                </Stack>
            </Box>
        </Box>
    );
};

export default BrandsSection;
