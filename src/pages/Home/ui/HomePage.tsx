import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from 'shared/hooks/hooks';
import LogoutButton from 'shared/ui/LogoutButton';
import AuthStatus from 'shared/ui/AuthStatus';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { userId } = useAppSelector((state) => state.auth);

    return (
        <Container maxWidth="md">
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh" flexDirection="column">
                <Typography variant="h4" component="h1" gutterBottom>
                    Welcome to Mini Paint Editor
                </Typography>
                <Box display="flex" alignItems="center" mt={2}>
                    {userId ? (
                        <>
                            <Typography variant="body1" gutterBottom>
                                You are logged in.
                            </Typography>
                            <Box ml={2}>
                                <AuthStatus />
                            </Box>
                            <Box ml={2}>
                                <LogoutButton />
                            </Box>
                            <Box mt={2}>
                                <Button variant="contained" color="primary" onClick={() => navigate('/feed')}>
                                    Go to Feed
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <>
                            <Typography variant="body1" gutterBottom>
                                Please sign in or sign up to continue.
                            </Typography>
                            <Box display="flex" mt={2}>
                                <Button variant="contained" color="primary" onClick={() => navigate('/signin')} style={{ marginRight: '10px' }}>
                                    Sign In
                                </Button>
                                <Button variant="contained" color="secondary" onClick={() => navigate('/signup')}>
                                    Sign Up
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            </Box>
        </Container>
    );
};

export default HomePage;