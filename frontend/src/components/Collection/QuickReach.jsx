import React from 'react';
import Image from '../Product/Image';
import { Box, Grid, Card, CardActionArea } from '@mui/material';

const QuickReach = ({ quickReach }) => {
  if (!quickReach) return null;

  return (
    <Box sx={{ py: 3, my: 3, bgcolor: 'background.paper' }}>
        <Grid container spacing={2} sx={{ maxWidth: 1440, mx: 'auto', px: { xs: 2, lg: 4 } }}>
            {quickReach.imgs.map(imgURL => (
                <Grid size={{ xs: 4, md: 2 }} key={imgURL}>
                    <Card sx={{ borderRadius: 3, boxShadow: 'none', border: '1px solid', borderColor: 'transparent', '&:hover': { borderColor: 'divider', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' } }}>
                        <CardActionArea sx={{ p: 1 }}>
                             <Box sx={{ position: 'relative', pt: '100%' }}>
                                <Box 
                                    component={Image} 
                                    imgSrc={imgURL} 
                                    sx={{ 
                                        position: 'absolute', 
                                        top: 0, 
                                        left: 0, 
                                        width: '100%', 
                                        height: '100%', 
                                        objectFit: 'cover',
                                        borderRadius: 2 
                                    }} 
                                    alt="Category"
                                />
                             </Box>
                        </CardActionArea>
                    </Card>
                </Grid>
            ))}
        </Grid>
    </Box>
  )
}

export default QuickReach;