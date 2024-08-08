import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "shared/hooks/hooks";
import { Container, Box, Typography, Button } from "@mui/material";

const HomePage = () => {
  const userId = useAppSelector((state) => state.auth.userId);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      navigate("/feed");
    }
  }, [userId, navigate]);

  return (
    <Container maxWidth="md">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h4" gutterBottom>
          Please Register or Login
        </Typography>
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/signin")}
            sx={{
              marginRight: "10px",
              padding: "15px 30px",
              fontSize: "1.2rem",
            }}
          >
            Sign In
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate("/signup")}
            sx={{ padding: "15px 30px", fontSize: "1.2rem" }}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;
