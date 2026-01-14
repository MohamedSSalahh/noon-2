import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Container, CircularProgress, Paper } from '@mui/material';

const Textiles = () => {
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                // Adjust URL if needed
                const res = await axios.get('http://localhost:8000/api/v1/cms/textiles');
                if (res.data.status === 'success') {
                    setPageData(res.data.data);
                }
            } catch (err) {
                console.error("Failed to load textiles content", err);
                setError("Failed to load content.");
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error && !pageData) {
        return (
            <Container maxWidth="lg" sx={{ mt: 5 }}>
                <Typography variant="h5" color="error">{error}</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 5, mb: 10 }}>
            {pageData && (
                <>
                    <Typography variant="h3" fontWeight="bold" gutterBottom>
                        {pageData.title}
                    </Typography>
                    <Paper elevation={0} sx={{ p: 0, bgcolor: 'transparent' }}>
                         <div 
                            dangerouslySetInnerHTML={{ __html: pageData.content?.html || '' }} 
                            className="prose max-w-none"
                         />
                    </Paper>
                </>
            )}
        </Container>
    );
};

export default Textiles;
