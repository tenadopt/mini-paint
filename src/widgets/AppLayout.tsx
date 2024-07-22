import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from 'widgets/Header/ui/Header';
import Footer from 'widgets/Footer/ui/Footer';
import {Box, Container} from '@mui/material';

const AppLayout = () => (
    <Box display="flex" flexDirection="column" minHeight="100vh">
        <Header />
        <Container component="main" maxWidth="md" style={{ flexGrow: 1, paddingTop: '20px', paddingBottom: '20px' }}>
            <Outlet />
        </Container>
        <Footer />
    </Box>
);

export default AppLayout;