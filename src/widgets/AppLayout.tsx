import React, {ReactNode} from 'react';
import Header from 'widgets/Header/ui/Header';
import Footer from 'widgets/Footer/ui/Footer';
import {Box, Container} from '@mui/material';

const AppLayout = ({children}: {children: ReactNode}) => (
    <Box display="flex" flexDirection="column" minHeight="100vh">
        <Header />
        <Container component="main" maxWidth="md" style={{ flexGrow: 1, paddingTop: '20px', paddingBottom: '20px' }}>
            {children}
        </Container>
        <Footer />
    </Box>
);

export default AppLayout;