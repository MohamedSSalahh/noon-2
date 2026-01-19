import React from 'react';
import { Box, Typography, Grid, Link } from '@mui/material';
import { useLanguage } from '../../context/LanguageContext.jsx';

const categories = [
    { key: 'luxury_towels', img: '/assets/cat-towels.jpg' },
    { key: 'heirloom_blankets', img: '/assets/cat-blankets.jpg' },
    { key: 'fine_linens', img: '/assets/cat-linens.jpg' },
];

const PremiumWeaves = () => {
  const { t } = useLanguage();

  return (
    <Box sx={{ py: 8 }}>
        <Typography variant="h6" align="center" sx={{ mb: 6, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {t('premium_weaves')}
        </Typography>
        
        <Grid container spacing={4}>
            {categories.map((cat, index) => (
                <Grid item xs={12} md={4} key={index}>
                    <Box sx={{ position: 'relative', overflow: 'hidden', group: 'true', cursor: 'pointer' }}>
                         {/* Placeholder Image Block since we don't have real images yet */}
                        <Box sx={{ 
                            height: 400, 
                            bgcolor: '#f0f0f0', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            transition: 'transform 0.5s',
                            '&:hover': { transform: 'scale(1.05)' }
                        }}>
                             <Typography variant="body2" color="text.disabled">[ {cat.key} Image ]</Typography>
                        </Box>
                        
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Typography variant="body1" sx={{ fontWeight: 600, letterSpacing: '0.05em' }}>
                                {t(cat.key)}
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
            ))}
        </Grid>
    </Box>
  );
};

export default PremiumWeaves;
