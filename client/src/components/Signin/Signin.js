import React, { useReducer, useState } from "react";
import SetCookie from "../../hooks/setCookie";
import imageBg from "../../assets/signin-bg.png";
import logo from "../../assets/logo.png";

import {
  validate,
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../util/validators";

import ErrorModal from "../../LoadingSpinner/ErrorModal";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

//EMAIL validation
const usernameReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.username,
        isvalid: validate(action.username, action.validators),
      };
    case "TOUCH":
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
};
//pass validation
const passReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.pass,
        isvalid: validate(action.pass, action.validators),
      };
    case "TOUCH":
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
};

const SignIn = () => {
  //EMAIL validation
  const [usernameState, dispatch2] = useReducer(usernameReducer, {
    value: "",
    isvalid: false,
    isTouched: false,
  });

  const usernameChangeHandler = (event) => {
    dispatch2({
      type: "CHANGE",
      username: event.target.value,
      validators: [VALIDATOR_MINLENGTH(3)],
    });
  };
  const touchHandler = () => {
    dispatch2({
      type: "TOUCH",
    });
  };

  //PASS validation
  const [passState, dispatch3] = useReducer(passReducer, {
    value: "",
    isvalid: false,
    isTouched: false,
  });

  const passChangeHandler = (event) => {
    dispatch3({
      type: "CHANGE",
      pass: event.target.value,
      validators: [VALIDATOR_REQUIRE()],
    });
  };
  const passtouchHandler = () => {
    dispatch3({
      type: "TOUCH",
    });
  };

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const emailSubmitHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data and get token
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/login`,
        {
          userName: usernameState.value,
          password: passState.value,
        }
      );
      const responseData = await response;

      localStorage.setItem("role", responseData.data.user.user_role);

      if (responseData.data.user.user_role === "admin") {
        SetCookie("AdminToken", responseData.data.token);
        localStorage.setItem(
          "AdminData",
          JSON.stringify(responseData.data.user._id)
        );
        localStorage.setItem(
          "AdminName",
          JSON.stringify(responseData.data.user.fullname)
        );
        setIsLoading(false);
        window.location.href = "/";
      } else if (responseData.data.user.user_role === "customerService") {
        SetCookie("UserA", responseData.data.token);
        localStorage.setItem(
          "UserAData",
          JSON.stringify(responseData.data.user._id)
        );
        setIsLoading(false);
        window.location.href = "/";
      } else if (responseData.data.user.user_role === "specialistService") {
        SetCookie("UserB", responseData.data.token);
        localStorage.setItem(
          "UserBData",
          JSON.stringify(responseData.data.user._id)
        );
        setIsLoading(false);
        window.location.href = "/";
      }
    } catch (err) {
      setIsLoading(false);
      setError(
        err.response.data.err || "SomeThing Went Wrong , Please Try Again ."
      );
    }
  };

  const errorHandler = () => {
    setError(null);
  };

  return (
    <Grid container>
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && <LoadingSpinner asOverlay />}
      <Grid
        item
        xs={6}
        height="100vh"
        sx={{
          backgroundImage: `url(${imageBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <Grid
        item
        container
        xs={6}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Box sx={{ marginY: 1 }}>
          <img src={logo} alt="logo" />
        </Box>
        <Typography sx={{ marginY: 1 }} variant="h4" fontWeight={700}>
          Smarteduservices
        </Typography>
        <Typography align="center" sx={{ opacity: 0.6, marginY: 1 }}>
          Hello there! <br /> sign in and start managing your itmes
        </Typography>
        <form onSubmit={emailSubmitHandler}>
          <Grid container direction="column" width={260} sx={{ marginY: 1 }}>
            <Grid item sx={{ marginY: 1 }}>
              <FormControl
                fullWidth
                controlid="username"
                value={usernameState.value}
                onChange={usernameChangeHandler}
                onBlur={touchHandler}
                isvalid={usernameState.isvalid.toString()}
                error={!usernameState.isvalid && usernameState.isTouched}
                type="name"
              >
                <FormLabel>Username</FormLabel>
                <TextField
                  id="username"
                  variant="outlined"
                  placeholder="Username"
                  error={!usernameState.isvalid && usernameState.isTouched}
                />
              </FormControl>
            </Grid>
            <Grid item sx={{ marginY: 1 }}>
              <FormControl
                fullWidth
                controlid="password"
                value={passState.value}
                onChange={passChangeHandler}
                onBlur={passtouchHandler}
                isvalid={passState.isvalid.toString()}
                error={!passState.isvalid && passState.isTouched}
                type="password"
              >
                <FormLabel>Password</FormLabel>
                <TextField
                  id="password"
                  variant="outlined"
                  placeholder="Password"
                  type="password"
                  error={!passState.isvalid && passState.isTouched}
                />
              </FormControl>
            </Grid>
            <Grid item sx={{ marginY: 1 }}>
              <Button
                sx={{ backgroundColor: "#2185D0" }}
                fullWidth
                variant="contained"
                type="submit"
                disabled={!usernameState.isvalid || !passState.isvalid}
              >
                Sign in
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};

export default SignIn;
