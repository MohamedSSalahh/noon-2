import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { resetAddressChanged } from "../../redux/slices/locationSlice";
import Map from "./Map";
import { Box, Typography, Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const LeftHeader = () => {
    const [mapIsShown, setMapIsShown] = useState(false);
    const currentLocation = useSelector(({ locationState }) => locationState.address);
    const addressChanged = useSelector(({ locationState }) => locationState.addressChanged);
    const dispatch = useDispatch();

    const showMap = () => {
        setMapIsShown(true);
    }

    const hideMap = () => {
        setMapIsShown(false);
        if (addressChanged) dispatch(resetAddressChanged());
    }

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
                <Link to="/" style={{ display: 'flex' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                         <img 
                            src="/data/assets/svg/lyver-logo.svg" 
                            alt="Lyver" 
                            style={{ width: '40px', height: 'auto', display: 'block', color: 'white' }} 
                        />
                        <Typography variant="h5" sx={{ fontWeight: 800, color: 'white', letterSpacing: '-0.5px' }}>
                            Lyver <Typography component="span" variant="caption" sx={{ display: 'block', fontSize: '10px', lineHeight: 0.8, letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.8 }}>Textiles</Typography>
                        </Typography>
                    </Box>
                </Link>
                <Box 
                    onClick={showMap}
                    sx={{ 
                        display: { xs: 'none', lg: 'flex' }, 
                        alignItems: 'center', 
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: 2,
                        transition: 'background-color 0.2s',
                        '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.05)'
                        }
                    }}
                >
                    <Box sx={{ mr: 1.5, display: 'flex' }}>
                         <img 
                            src="/data/assets/svg/eg.svg" 
                            alt="Egypt" 
                            style={{ width: '24px', height: '24px', borderRadius: '50%', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }} 
                        />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500, lineHeight: 1 }}>
                                Deliver to
                            </Typography>
                            <KeyboardArrowDownIcon sx={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }} />
                        </Box>
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                fontWeight: 700, 
                                color: 'white',
                                maxWidth: '140px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                lineHeight: 1.2
                            }}
                            title={currentLocation || 'Select Location'}
                        >
                            {currentLocation || 'Select Location'}
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Map isShown={mapIsShown} hideMap={hideMap} />
        </>
    );
};

export default LeftHeader;
