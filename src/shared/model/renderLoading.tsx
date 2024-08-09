import { Box, CircularProgress } from "@mui/material";
import React from "react";

const renderLoading = () => (
  <Box display="flex" justifyContent="center" mt={2}>
    <CircularProgress />
  </Box>
);

export default renderLoading;
