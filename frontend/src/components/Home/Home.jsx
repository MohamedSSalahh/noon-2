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
  
  const slider = useSelector(({ collectionState }) => collectionState.sliders["home"]);
  const quickReach = useSelector(({ collectionState }) => collectionState.quickReachs["home"]);
  const deals = useSelector(({ collectionState }) => collectionState.deals);
  const dispatch = useDispatch();

  const renderProductsOverviews = () => {
    return Object.keys(deals).map(dealTitle => <ProductsOverview key={dealTitle} data={{ title: dealTitle, ...deals[dealTitle] }} />);
  }
  
  useEffect(() => {
    window.scrollTo(0, 0);
    getSlider(dispatch, "home");
    getQuickReach(dispatch, "home");
    getHotDealsProducts(dispatch, 50);
    getAllDealsProducts(dispatch, -1);
  }, [dispatch]);

  return (
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 8 }}>
          <Suspense fallback={<Spinner />}>
            <Container maxWidth="xl" disableGutters sx={{ px: { xs: 2, lg: 4 } }}>
                <ImageSlider slider={slider} />       
                
                <QuickReach quickReach={quickReach} />
                
                <BrandsSection />
                
                <Stack spacing={6}>
                    { renderProductsOverviews() } 
                </Stack>
            </Container>
          </Suspense>
      </Box>
  );
};

export default Home;
