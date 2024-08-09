import { Box, Typography } from "@mui/material";
import React from "react";

interface RenderErrorProps {
  error: string;
}

const RenderError = ({ error }: RenderErrorProps) => (
  <Box display="flex" justifyContent="center" mt={2}>
    <Typography color="error">{error}</Typography>
  </Box>
);

export default RenderError;
