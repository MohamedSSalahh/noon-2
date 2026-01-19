import React from 'react';
import { Box, Container, Grid, Typography, Paper } from '@mui/material';
import { useLanguage } from '../../context/LanguageContext.jsx';

const AboutSection = () => {
    const { t } = useLanguage();

    return (
        <Box sx={{ py: 12, bgcolor: 'background.default' }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 10 }}>
                    <Typography variant="h6" color="secondary" sx={{ letterSpacing: '0.2em', mb: 2 }}>
                        {t('the_twill_difference')}
                    </Typography>
                </Box>
                
                <Grid container spacing={4}>
                    {/* Cotton Section */}
                    <Grid item xs={12} md={6}>
                        <Paper 
                            sx={{ 
                                p: 6, 
                                height: '100%', 
                                bgcolor: 'white', 
                                borderTop: '4px solid',
                                borderColor: 'secondary.main',
                                textAlign: 'center'
                            }}
                        >
                            <Box sx={{ fontSize: '3rem', mb: 2 }}>🌱</Box>
                            <Typography variant="h4" sx={{ mb: 2, fontFamily: 'Playfair Display' }}>
                                {t('cotton_title')}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                                {t('cotton_desc')}
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* History Section */}
                    <Grid item xs={12} md={6}>
                        <Paper 
                            sx={{ 
                                p: 6, 
                                height: '100%', 
                                bgcolor: 'primary.main', 
                                color: 'white',
                                textAlign: 'center'
                            }}
                        >
                            <Box sx={{ fontSize: '3rem', mb: 2 }}>🏛️</Box>
                            <Typography variant="h4" sx={{ mb: 2, color: 'white', fontFamily: 'Playfair Display' }}>
                                {t('history_title')}
                            </Typography>
                            <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'rgba(255,255,255,0.8)' }}>
                                {t('history_desc')}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default AboutSection;
