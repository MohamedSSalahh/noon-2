import React, { useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Box, IconButton, useTheme } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const ImageSlider = ({ slider }) => {
    const navigationPrevRef = useRef(null);
    const navigationNextRef = useRef(null);
    const theme = useTheme();

    if (!slider) return null;

    return (
        <Box sx={{ 
            width: '100%', 
            position: 'relative', 
            mt: 2,
            '&:hover .swiper-button-custom': {
                opacity: 1,
                visibility: 'visible'
            }
        }}>
             <Swiper
                modules={[Navigation, Autoplay, Pagination]}
                spaceBetween={0}
                slidesPerView={1}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                navigation={{
                    prevEl: navigationPrevRef.current,
                    nextEl: navigationNextRef.current,
                }}
                onBeforeInit={(swiper) => {
                    swiper.params.navigation.prevEl = navigationPrevRef.current;
                    swiper.params.navigation.nextEl = navigationNextRef.current;
                }}
                style={{ 
                    width: '100%', 
                    borderRadius: theme.shape.borderRadius,
                    overflow: 'hidden',
                }}
            >
                { slider.sliderImgs.map((img, index) => (
                    <SwiperSlide key={index}>
                        <Box 
                            component="img"
                            src={img} 
                            alt={`Banner ${index + 1}`} 
                            sx={{ 
                                width: '100%', 
                                height: { xs: '200px', md: '300px', lg: '400px' }, 
                                objectFit: 'cover' 
                            }} 
                        />
                    </SwiperSlide>
                )) }
            </Swiper>
            
            <IconButton 
                ref={navigationPrevRef}
                className="swiper-button-custom"
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: 16,
                    transform: 'translateY(-50%)',
                    zIndex: 10,
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    boxShadow: 2,
                    opacity: 0,
                    visibility: 'hidden',
                    transition: 'opacity 0.3s, visibility 0.3s, transform 0.2s',
                    '&:hover': { bgcolor: 'background.paper', transform: 'translateY(-50%) scale(1.1)' }
                }}
            >
                <ChevronLeftIcon fontSize="large" />
            </IconButton>

            <IconButton 
                ref={navigationNextRef}
                className="swiper-button-custom"
                sx={{
                    position: 'absolute',
                    top: '50%',
                    right: 16,
                    transform: 'translateY(-50%)',
                    zIndex: 10,
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    boxShadow: 2,
                    opacity: 0,
                    visibility: 'hidden',
                    transition: 'opacity 0.3s, visibility 0.3s, transform 0.2s',
                    '&:hover': { bgcolor: 'background.paper', transform: 'translateY(-50%) scale(1.1)' }
                }}
            >
                <ChevronRightIcon fontSize="large" />
            </IconButton>
        </Box>
    );
}

export default ImageSlider;
