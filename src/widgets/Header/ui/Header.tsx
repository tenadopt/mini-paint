import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthStatus from 'shared/ui/AuthStatus';
import LogoutButton from 'shared/ui/LogoutButton';
import { useAppSelector } from 'shared/hooks/hooks';

const Header = () => {
    const navigate = useNavigate();
    const auth = useAppSelector((state) => state.auth);

    return (
        <AppBar position="fixed">
            <Toolbar>
                <Box display="flex" alignItems="center" flexGrow={1}>
                    <Button color="inherit" onClick={() => navigate('/feed')}>
                        Mini Paint Gallery
                    </Button>
                    <Box mx={5}>
                        <Button color="inherit" onClick={() => navigate('/editor')}>
                            Mini Paint Editor
                        </Button>
                    </Box>
                </Box>
                <Box display="flex">
                    {!auth.userId ? (
                        <>
                            <Button color="inherit" onClick={() => navigate('/signin')}>
                                Sign In
                            </Button>
                            <Button color="inherit" onClick={() => navigate('/signup')}>
                                Sign Up
                            </Button>
                        </>
                    ) : (
                        <>
                            <Box marginRight={2} display="flex" alignItems="center">
                                <AuthStatus />
                            </Box>
                            <LogoutButton />
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;