import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Footer = () => (
    <AppBar position="sticky" color="primary" style={{ top: 'auto', bottom: 0 }}>
        <Toolbar>
            <Typography variant="body1" color="inherit" style={{ flexGrow: 1, textAlign: 'center' }}>
                © 2024 Mini Paint
            </Typography>
        </Toolbar>
    </AppBar>
);

export default Footer;
