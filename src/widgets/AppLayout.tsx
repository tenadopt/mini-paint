import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from 'widgets/Header/ui/Header';
import Footer from 'widgets/Footer/ui/Footer';
import { Container } from '@mui/material';

const AppLayout = () => (
    <>
        <Header />
        <Container component="main" maxWidth="md">
            <Outlet />
        </Container>
        <Footer />
    </>
);

export default AppLayout;