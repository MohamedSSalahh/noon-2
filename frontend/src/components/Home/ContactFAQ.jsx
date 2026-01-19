import React from 'react';
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails, Grid } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useLanguage } from '../../context/LanguageContext.jsx';

const ContactFAQ = () => {
    const { t } = useLanguage();

    return (
        <Box id="contact" sx={{ py: 12, bgcolor: 'secondary.light' }}>
             <Container maxWidth="lg">
                <Grid container spacing={8}>
                    {/* Contact Info */}
                    <Grid item xs={12} md={5}>
                        <Typography variant="h4" sx={{ mb: 4, fontFamily: 'Playfair Display' }}>
                            {t('contact_us')}
                        </Typography>
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ mb: 1 }}>VISIT US</Typography>
                            <Typography variant="body1" color="text.secondary">
                                {t('address')}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ mb: 1 }}>EMAIL</Typography>
                            <Typography variant="body1" color="text.secondary">
                                {t('email')}
                            </Typography>
                        </Box>
                    </Grid>

                    {/* FAQ */}
                    <Grid item xs={12} md={7}>
                        <Typography variant="h4" sx={{ mb: 4, fontFamily: 'Playfair Display' }}>
                            {t('faq')}
                        </Typography>
                        
                        <Accordion sx={{ mb: 2, boxShadow: 'none', bgcolor: 'transparent' }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6">{t('faq_q1')}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography color="text.secondary">
                                    {t('faq_a1')}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        
                        <Accordion sx={{ boxShadow: 'none', bgcolor: 'transparent' }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6">{t('faq_q2')}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography color="text.secondary">
                                    {t('faq_a2')}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                </Grid>
             </Container>
        </Box>
    );
};

export default ContactFAQ;
