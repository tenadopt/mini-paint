import React from "react";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import { Container, Typography } from "@mui/material";

interface RouteError {
  statusText?: string;
  message?: string;
}

const ErrorBoundary = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Oops! Something went wrong.
        </Typography>
        <Typography variant="body1">
          {error.statusText || error.data?.message}
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Oops! Something went wrong.
      </Typography>
      <Typography variant="body1">
        {(error as RouteError).statusText ||
          (error as RouteError).message ||
          "An unknown error occurred"}
      </Typography>
    </Container>
  );
};

export default ErrorBoundary;
