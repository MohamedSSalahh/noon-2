import React from 'react';
import { Card, Box, Typography, IconButton, Chip, Rating, Stack } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Image from './Image';

const ProductCard = ({ product, isLiked, onWishlistToggle, onClick }) => {
    const [intPrice, decPrice] = product.new_price.toFixed(2).split('.');
    const discount = product.old_price ? Math.floor(100 - (product.new_price / product.old_price) * 100) : 0;

    return (
        <Card 
            elevation={0}
            onClick={onClick}
            sx={{ 
                minWidth: 190, 
                width: 190, 
                position: 'relative', 
                cursor: 'pointer', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 2,
                transition: 'all 0.3s',
                '&:hover': {
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                    transform: 'translateY(-4px)'
                },
                pb: 1,
                bgcolor: 'white'
            }}
        >
            <IconButton
                onClick={(e) => onWishlistToggle(e, product)}
                sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 2,
                    bgcolor: 'white',
                    boxShadow: 1,
                    width: 30,
                    height: 30,
                    color: isLiked ? 'error.main' : 'text.secondary',
                    opacity: isLiked ? 1 : 0,
                    transition: 'opacity 0.2s',
                    '.MuiCard-root:hover &': {
                        opacity: 1
                    },
                    '&:hover': { bgcolor: 'white', color: 'error.main' }
                }}
            >
                {isLiked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
            </IconButton>

            <Box sx={{ p: 2, height: 210, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <Image imgSrc={product.image} imgAlt={product.title} className="max-h-full max-w-full object-contain" />
            </Box>

            <Box sx={{ px: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography 
                    variant="body2" 
                    title={product.title}
                    sx={{ 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        display: '-webkit-box', 
                        WebkitLineClamp: 2, 
                        WebkitBoxOrient: 'vertical',
                        minHeight: 40,
                        mb: 0.5,
                        lineHeight: 1.4,
                        color: 'text.primary'
                    }}
                >
                    {product.title}
                </Typography>

                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1, minHeight: 18 }}>
                    {product.ratingCount > 0 ? (
                        <>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'success.main', color: 'white', px: 0.8, py: 0.1, borderRadius: 10 }}>
                                <Typography variant="caption" sx={{ fontWeight: 'bold', lineHeight: 1 }}>{product.rating}</Typography>
                                <Typography variant="caption" sx={{ fontSize: '0.6rem', lineHeight: 1 }}>★</Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary">({product.ratingCount})</Typography>
                        </>
                    ) : ( 
                        <Typography variant="caption" color="text.disabled">No ratings</Typography>
                    )}
                </Stack>

                <Box sx={{ mb: 1 }}>
                     <Stack direction="row" alignItems="flex-start" spacing={0.5}>
                        <Typography variant="caption" sx={{ mt: 0.5, fontWeight: 500 }}>EGP</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>{intPrice}</Typography>
                        <Typography variant="caption" sx={{ mt: 0.5, fontWeight: 700 }}>.{decPrice}</Typography>
                     </Stack>
                     {product.old_price && (
                         <Stack direction="row" alignItems="center" spacing={1}>
                             <Typography variant="caption" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                                 EGP {product.old_price.toFixed(2)}
                             </Typography>
                             <Typography variant="caption" color="success.main" fontWeight="bold">
                                 {discount}% OFF
                             </Typography>
                         </Stack>
                     )}
                </Box>

                <Box sx={{ mt: 'auto' }}>
                    <img src="/data/assets/svg/fulfilment_express_v2-en.svg" alt="noon-express" style={{ height: 16 }} />
                    <Typography variant="caption" color="text.secondary" display="block">
                         Get it <Box component="span" fontWeight="bold" color="text.primary">Sat, Sep 23</Box>
                    </Typography>
                </Box>
            </Box>
        </Card>
    );
};

export default ProductCard;
