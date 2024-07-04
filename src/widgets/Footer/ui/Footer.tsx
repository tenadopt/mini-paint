import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Footer = () => (
    <AppBar position="static" color="primary">
        <Toolbar>
            <Typography variant="body1" color="inherit" style={{ flexGrow: 1, textAlign: 'center' }}>
                © 2024 Mini Paint
            </Typography>
        </Toolbar>
    </AppBar>
);

export default Footer;