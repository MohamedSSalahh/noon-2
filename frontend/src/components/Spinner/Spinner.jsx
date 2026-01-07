import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const Spinner = () => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: 160 }}>
            <CircularProgress color="primary" size={48} />
        </Box>
    );
}

export default Spinner;