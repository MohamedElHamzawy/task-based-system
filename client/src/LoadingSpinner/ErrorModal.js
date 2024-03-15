import React from "react";

import MiModal from "@mui/material/Modal";
import { Alert, AlertTitle, Grid } from "@mui/material";

const ErrorModal = ({ message, onClear = () => {} }) => {
  return (
    <MiModal open={message} onClose={onClear} className="max-w-xl mx-auto">
      <Grid
        container
        height="100vh"
        alignItems="center"
        justifyContent="center"
      >
        <Alert
          severity={message?.type === "error" ? "error" : "success"}
          onClose={onClear}
        >
          <AlertTitle className="capitalize">{message?.type}</AlertTitle>
          {message?.message}
        </Alert>
      </Grid>
    </MiModal>
  );
};

export default ErrorModal;
