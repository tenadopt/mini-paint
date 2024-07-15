import React from 'react';
import {AppBar, Toolbar, Button, Box} from '@mui/material';
import {useNavigate} from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    return (
        <AppBar position="static">
            <Toolbar>
                <Box display="flex" alignItems="center" flexGrow={1}>
                    <Button color="inherit" onClick={() => navigate('/editor')}>
                        Mini Paint Editor
                    </Button>
                </Box>
                <Box display="flex">
                    <Button color="inherit" onClick={() => navigate('/signin')}>
                        Sign In
                    </Button>
                    <Button color="inherit" onClick={() => navigate('/signup')}>
                        Sign Up
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;