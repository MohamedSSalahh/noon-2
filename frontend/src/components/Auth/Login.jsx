import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../redux/slices/authSlice';
import { Box, TextField, Button, Typography, Paper, CircularProgress, Alert } from '@mui/material';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isLoading, error } = useSelector((state) => state.authState);

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        }
    }, [user, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser({ email, password }));
    };

    return (
        <Box sx={{ 
            display: 'flex', 
            minHeight: '100vh',
            bgcolor: 'background.default'
        }}>
            {/* Left Side - Hero Image */}
            <Box sx={{ 
                flex: 1,
                display: { xs: 'none', md: 'flex' },
                position: 'relative',
                backgroundImage: 'url(/assets/hero.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: 'rgba(11, 28, 51, 0.7)'
                }
            }}>
                <Box sx={{ 
                    position: 'relative', 
                    zIndex: 1, 
                    p: 6,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    color: 'white'
                }}>
                    {/* Logo */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 6 }}>
                        <Box sx={{
                            width: 50,
                            height: 50,
                            borderRadius: '50%',
                            border: '2px solid white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: 'Playfair Display',
                            fontSize: '1.8rem',
                            fontWeight: 700
                        }}>
                            W
                        </Box>
                        <Box>
                            <Typography sx={{ fontFamily: 'Playfair Display', fontSize: '1.3rem', fontWeight: 600, letterSpacing: '0.15em' }}>
                                TWILL
                            </Typography>
                            <Typography sx={{ fontSize: '0.75rem', letterSpacing: '0.2em', mt: -0.5 }}>
                                HOME
                            </Typography>
                        </Box>
                    </Box>

                    <Typography variant="h3" sx={{ fontFamily: 'Playfair Display', mb: 2, lineHeight: 1.2 }}>
                        Welcome Back
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 300 }}>
                        Premium weaves for every home since 1989
                    </Typography>
                </Box>
            </Box>

            {/* Right Side - Login Form */}
            <Box sx={{ 
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4
            }}>
                <Paper elevation={0} sx={{ 
                    maxWidth: 450, 
                    width: '100%',
                    p: { xs: 4, sm: 6 },
                    bgcolor: 'transparent'
                }}>
                    {/* Mobile Logo */}
                    <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.5, mb: 4, justifyContent: 'center' }}>
                        <Box sx={{
                            width: 45,
                            height: 45,
                            borderRadius: '50%',
                            border: '2px solid',
                            borderColor: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: 'Playfair Display',
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            color: 'primary.main'
                        }}>
                            W
                        </Box>
                        <Box>
                            <Typography sx={{ fontFamily: 'Playfair Display', fontSize: '1.1rem', fontWeight: 600, letterSpacing: '0.15em', color: 'primary.main' }}>
                                TWILL
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', letterSpacing: '0.2em', mt: -0.3, color: 'text.secondary' }}>
                                HOME
                            </Typography>
                        </Box>
                    </Box>

                    <Typography variant="h4" sx={{ 
                        fontFamily: 'Playfair Display', 
                        mb: 1,
                        textAlign: 'center',
                        color: 'primary.main'
                    }}>
                        Sign In
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
                        Enter your credentials to access your account
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            sx={{ mb: 3 }}
                        />
                        
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            sx={{ mb: 2 }}
                        />

                        <Box sx={{ textAlign: 'right', mb: 3 }}>
                            <Link to="#" style={{ 
                                color: '#D4AF37', 
                                textDecoration: 'none',
                                fontSize: '0.875rem'
                            }}>
                                Forgot password?
                            </Link>
                        </Box>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isLoading}
                            sx={{ 
                                py: 1.5,
                                bgcolor: 'primary.main',
                                color: 'white',
                                fontSize: '1rem',
                                fontWeight: 600,
                                letterSpacing: '0.05em',
                                '&:hover': { bgcolor: 'primary.dark' }
                            }}
                        >
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'SIGN IN'}
                        </Button>

                        <Typography variant="body2" sx={{ mt: 3, textAlign: 'center', color: 'text.secondary' }}>
                            Don't have an account?{' '}
                            <Link to="/signup" style={{ 
                                color: '#D4AF37', 
                                textDecoration: 'none',
                                fontWeight: 600
                            }}>
                                Sign Up
                            </Link>
                        </Typography>
                    </form>
                </Paper>
            </Box>
        </Box>
    );
};

export default Login;
