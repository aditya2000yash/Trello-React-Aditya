import React from "react";
import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";
import { Box, Button, Typography } from "@mui/material";

const NotFoundPage = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="90vh"
      textAlign="center"
    >
      <FaExclamationTriangle size="48px" />
      <Typography variant="h2" component="h1" fontWeight="bold" mt={4}>
        404 Not Found
      </Typography>
      <Typography variant="h6" mt={2}>
        This page does not exist
      </Typography>
      <Button
        component={Link}
        to="/"
        variant="contained"
        color="primary"
        mt={4}
      >
        Go Back
      </Button>
    </Box>
  );
};

export default NotFoundPage;
