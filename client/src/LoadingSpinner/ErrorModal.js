import React from "react";

import MiModal from "@mui/material/Modal";
import { Alert, AlertTitle, Grid } from "@mui/material";

const ErrorModal = (props) => {
  return (
    <MiModal open={!!props.error} onClose={props.onClear}>
      <Grid
        container
        height="100vh"
        alignItems="center"
        justifyContent="center"
      >
        <Alert severity="error" onClose={props.onClear}>
          <AlertTitle>An Error Occurred!</AlertTitle>
          {props.error}
        </Alert>
      </Grid>
    </MiModal>
  );
};

export default ErrorModal;
