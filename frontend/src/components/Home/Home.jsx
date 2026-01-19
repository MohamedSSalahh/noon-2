import React, { lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllDealsProducts, getHotDealsProducts } from "../../apis/products";
import Spinner from "../Spinner/Spinner";
import { Box, Container, Stack, Typography, Button, Grid } from '@mui/material';
import { useLanguage } from "../../context/LanguageContext.jsx";

const Home = () => {
  const { t } = useLanguage();
  
  const ProductsOverview = lazy(async () =>  {
    return new Promise(resolve => setTimeout(resolve, 500)).then(
      () => import("../Product/ProductsOverview")
    );
  });
  
  const deals = useSelector(({ collectionState }) => collectionState.deals);
  const dispatch = useDispatch();

  const renderProductsOverviews = () => {
    return Object.keys(deals).map(dealTitle => (
        <React.Fragment key={dealTitle}>
            <Box sx={{ py: 6 }}>
                <Typography variant="h4" align="center" sx={{ mb: 4, letterSpacing: '0.05em' }}>
                    {dealTitle.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}
                </Typography>
                <ProductsOverview data={{ title: dealTitle, ...deals[dealTitle] }} />
            </Box>
        </React.Fragment>
    ));
  }
  
  useEffect(() => {
    window.scrollTo(0, 0);
    getHotDealsProducts(dispatch, 50);
    getAllDealsProducts(dispatch, -1);
  }, [dispatch]);

  return (
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
          <Suspense fallback={<Spinner />}>
            
            {/* HERO SECTION - Clean Product Photography */}
            <Box sx={{ position: 'relative', height: { xs: '60vh', md: '75vh' }, mb: 0 }}>
                {/* Hero Image */}
                <Box sx={{
                    width: '100%',
                    height: '100%',
                    bgcolor: '#E8E6E1',
                    backgroundImage: 'url(/assets/hero.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    px: { xs: 4, md: 10 }
                }}>
                    <Box sx={{ maxWidth: 500 }}>
                        <Typography 
                            variant="h1" 
                            sx={{ 
                                color: 'primary.main', 
                                fontSize: { xs: '3rem', md: '4.5rem' }, 
                                lineHeight: 1.1, 
                                mb: 4,
                                fontFamily: 'Playfair Display'
                            }}
                        >
                            {t('hero_title') || 'Wrapped in Quality.'}
                        </Typography>
                        <Button 
                            variant="contained"
                            sx={{ 
                                bgcolor: 'primary.main',
                                color: 'white',
                                px: 4,
                                py: 1.5,
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                letterSpacing: '0.05em',
                                '&:hover': { bgcolor: 'primary.dark' }
                            }}
                        >
                            {t('hero_cta') || 'EXPLORE COLLECTIONS'}
                        </Button>
                    </Box>
                </Box>
            </Box>
            
            {/* PREMIUM WEAVES SECTION */}
            <Box sx={{ py: 8, bgcolor: 'background.default' }}>
                <Container maxWidth="lg">
                    <Typography 
                        variant="h6" 
                        align="center" 
                        sx={{ 
                            mb: 6, 
                            letterSpacing: '0.1em',
                            fontWeight: 400,
                            color: 'text.primary'
                        }}
                    >
                        {t('premium_weaves') || 'PREMIUM WEAVES FOR EVERY HOME'}
                    </Typography>
                    
                    <Grid container spacing={4}>
                        {[
                            { key: 'luxury_towels', label: t('luxury_towels') || 'LUXURY TOWELS' },
                            { key: 'heirloom_blankets', label: t('heirloom_blankets') || 'HEIRLOOM BLANKETS' },
                            { key: 'fine_linens', label: t('fine_linens') || 'FINE LINENS' }
                        ].map((category, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Box sx={{ 
                                    position: 'relative',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    '&:hover .category-image': {
                                        transform: 'scale(1.05)'
                                    }
                                }}>
                                    <Box 
                                        className="category-image"
                                        sx={{ 
                                            height: 400,
                                            bgcolor: '#f5f5f5',
                                            backgroundImage: `url(/assets/${category.key}.jpg)`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            transition: 'transform 0.5s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Typography variant="caption" color="text.disabled">
                                            [{category.label}]
                                        </Typography>
                                    </Box>
                                    <Typography 
                                        variant="body2" 
                                        align="center"
                                        sx={{ 
                                            mt: 2,
                                            fontWeight: 500,
                                            letterSpacing: '0.05em'
                                        }}
                                    >
                                        {category.label}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* THE TWILL DIFFERENCE SECTION */}
            <Box sx={{ py: 10, bgcolor: 'primary.main', color: 'white' }}>
                <Container maxWidth="lg">
                    <Typography 
                        variant="h4" 
                        align="center"
                        sx={{ 
                            mb: 8,
                            fontFamily: 'Playfair Display',
                            letterSpacing: '0.1em'
                        }}
                    >
                        {t('the_twill_difference') || 'THE TWILL DIFFERENCE'}
                    </Typography>
                    
                    <Grid container spacing={6} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Box sx={{ textAlign: 'center' }}>
                                {/* Circular diagram placeholder */}
                                <Box sx={{
                                    width: 300,
                                    height: 300,
                                    margin: '0 auto',
                                    border: '2px solid white',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative'
                                }}>
                                    <Typography variant="h2" sx={{ fontFamily: 'Playfair Display' }}>
                                        W
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Stack spacing={4}>
                                <Box>
                                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                                        {t('cotton_title') || '100% Organic Cotton'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        {t('cotton_desc') || 'Sourced from the finest sustainable farms'}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                                        {t('history_title') || 'Since 1989'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        {t('history_desc') || 'Over three decades of craftsmanship'}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
            
            {/* Products from API */}
            <Container maxWidth="xl" sx={{ py: 8 }}>
                <Stack spacing={0}>
                    { renderProductsOverviews() } 
                </Stack>
            </Container>
          </Suspense>
      </Box>
  );
};

export default Home;
