import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../../redux/slices/wishListSlice';
import ProductCard from './ProductCard';
import { Box, Typography, Button, IconButton, Stack } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const ProductsOverview = ({ data }) => {
    const productsContainer = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { wishlist } = useSelector((state) => state.wishListState);

    const isInWishlist = (productId) => {
        return wishlist.some(item => item._id === productId);
    };

    const handleWishlistToggle = (e, product) => {
        e.stopPropagation();
        if (isInWishlist(product.id)) {
            dispatch(removeFromWishlist(product.id));
        } else {
            dispatch(addToWishlist({ productId: product.id }));
        }
    };

    const handleProductOnClick = (product) => {
        navigate(`/${product.category.title}/${product.subCategory.id}/${product.id}`)
    }

    const scrollProductsToLeft = () => {
        productsContainer.current.scrollBy({ left: -300, behavior: 'smooth' });
    }

    const scrollProductsToRight = () => {
        productsContainer.current.scrollBy({ left: 300, behavior: 'smooth' });
    }

    if (!data || !data.products) return null;

    return (
        <Box sx={{ bgcolor: 'background.paper', p: { xs: 2, lg: 3 }, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>{data.title}</Typography>
                <Button 
                    variant="outlined" 
                    color="inherit" 
                    sx={{ 
                        fontWeight: 700, 
                        borderWidth: 2, 
                        borderColor: 'text.primary',
                        '&:hover': { borderWidth: 2, bgcolor: 'background.default' } 
                    }}
                >
                    VIEW ALL
                </Button>
            </Box>
            
            <Box sx={{ position: 'relative', '&:hover .scroll-btn': { opacity: 1, visibility: 'visible' } }}>
                <IconButton 
                    onClick={scrollProductsToLeft}
                    className="scroll-btn"
                    sx={{
                        position: 'absolute',
                        left: -12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 10,
                        bgcolor: 'background.paper',
                        boxShadow: 3,
                        opacity: 0,
                        visibility: 'hidden',
                        transition: 'all 0.3s',
                        '&:hover': { bgcolor: 'background.paper', transform: 'translateY(-50%) scale(1.1)' }
                    }}
                >
                    <ChevronLeftIcon />
                </IconButton>

                <Stack 
                    ref={productsContainer}
                    direction="row"
                    spacing={2}
                    sx={{ 
                        overflowX: 'auto', 
                        pb: 2,
                        px: 0.5,
                        scrollBehavior: 'smooth',
                        '&::-webkit-scrollbar': { display: 'none' },
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none'
                    }}
                >
                    {data.products.map(product => product.image && (
                         <ProductCard 
                            key={product.id}
                            product={product}
                            isLiked={isInWishlist(product.id)}
                            onWishlistToggle={handleWishlistToggle}
                            onClick={() => handleProductOnClick(product)}
                         />
                    ))}
                </Stack>

                <IconButton 
                    onClick={scrollProductsToRight}
                    className="scroll-btn"
                    sx={{
                        position: 'absolute',
                        right: -12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 10,
                        bgcolor: 'background.paper',
                        boxShadow: 3,
                        opacity: 0,
                        visibility: 'hidden',
                        transition: 'all 0.3s',
                        '&:hover': { bgcolor: 'background.paper', transform: 'translateY(-50%) scale(1.1)' }
                    }}
                >
                    <ChevronRightIcon />
                </IconButton>
            </Box>
        </Box>
    );
}

export default ProductsOverview;