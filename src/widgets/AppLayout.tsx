import React, { ReactNode } from "react";
import Header from "widgets/Header/ui/Header";
import Footer from "widgets/Footer/ui/Footer";
import { Box, Container, Toolbar } from "@mui/material";

const AppLayout = ({ children }: { children: ReactNode }) => (
  <Box display="flex" flexDirection="column" minHeight="100vh">
    <Header />
    <Container component="main" maxWidth="md" sx={{ flexGrow: 1, pb: 2 }}>
      <Toolbar />
      {children}
    </Container>
    <Footer />
  </Box>
);

export default AppLayout;
