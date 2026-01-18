import React, { lazy, Suspense, useEffect } from "react";
import ImageSlider from "../Collection/ImageSlider";
import { useDispatch, useSelector } from "react-redux";
import QuickReach from "../Collection/QuickReach";
import { getSlider } from "../../apis/sliders";
import { getQuickReach } from "../../apis/quickReachs";
import { getAllDealsProducts, getHotDealsProducts } from "../../apis/products";
import Spinner from "../Spinner/Spinner";
import BrandsSection from "./BrandsSection";
import { Box, Container, Stack } from '@mui/material';

const Home = () => {
  
  const ProductsOverview = lazy(async () =>  {
    return new Promise(resolve => setTimeout(resolve, 500)).then(
      () => import("../Product/ProductsOverview")
    );
  });
  
  // const slider = useSelector(({ collectionState }) => collectionState.sliders["home"]); // Deprecating generic slider
  const quickReach = useSelector(({ collectionState }) => collectionState.quickReachs["home"]);
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
    // getSlider(dispatch, "home"); // Skipping generic slider fetch
    getQuickReach(dispatch, "home");
    getHotDealsProducts(dispatch, 50);
    getAllDealsProducts(dispatch, -1);
  }, [dispatch]);

  return (
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 10 }}>
          <Suspense fallback={<Spinner />}>
            
            {/* HER HERO SECTION */}
            <Box sx={{ position: 'relative', height: '85vh', mb: 8 }}>
                <Box 
                   component="img"
                   src="/assets/hero.png" // Using the luxury hero image globally
                   alt="Twill Home Hero"
                   sx={{
                       width: '100%',
                       height: '100%',
                       objectFit: 'cover',
                       objectPosition: 'center'
                   }}
                />
                <Box sx={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: { xs: '5%', md: '10%' }, 
                    transform: 'translateY(-50%)',
                    maxWidth: 700,
                    textShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                    <Typography variant="h6" sx={{ color: 'secondary.main', mb: 2, letterSpacing: '0.2em' }}>
                        ESSENTIAL LUXURY
                    </Typography>
                    <Typography variant="h1" sx={{ color: '#0B1C33', fontSize: { xs: '3rem', md: '5rem' }, lineHeight: 1, mb: 4 }}>
                        Comfort woven <br/> for life.
                    </Typography>
                    <Box component="button" sx={{ 
                        bgcolor: '#0B1C33', 
                        color: 'white', 
                        px: 5, 
                        py: 2, 
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'bg 0.2s',
                        '&:hover': { bgcolor: '#1A2E4D' }
                    }}>
                        SHOP NEW ARRIVALS
                    </Box>
                </Box>
            </Box>
            
            {/* Main Content */}
            <Container maxWidth="xl" disableGutters sx={{ px: { xs: 2, lg: 6 } }}>
                
                {/* Intro Text */}
                <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto', mb: 10 }}>
                    <Typography variant="h4" paragraph sx={{ lineHeight: 1.6 }}>
                        We believe in the beauty of simplicity and the luxury of high-quality materials.
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Our collections are thoughtfully designed to bring calm and comfort to your home.
                    </Typography>
                </Box>

                {/* Quick Reach / Categories */}
                <Box sx={{ mb: 10 }}>
                     <QuickReach quickReach={quickReach} />
                </Box>
                
                {/* Brands / Partners */}
                <Box sx={{ py: 6, bgcolor: 'white', mx: -6, px: 6, mb: 8 }}>
                    <BrandsSection />
                </Box>
                
                {/* Products */}
                <Stack spacing={0}>
                    { renderProductsOverviews() } 
                </Stack>
            </Container>
          </Suspense>
      </Box>
  );
};

export default Home;
