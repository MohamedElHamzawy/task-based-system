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
      localStorage.setItem("user", JSON.stringify(responseData.data.user));

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
    <div className="flex flex-wrap">
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && <LoadingSpinner asOverlay />}
      <div
        className="w-full md:w-1/2 h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${imageBg})` }}
      />
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-4">
        <div className="my-2">
          <img src={logo} alt="logo" className="mx-auto" />
        </div>
        <h4 className="text-2xl font-bold my-2">Smarteduservices</h4>
        <p className="text-center text-opacity-60 my-2">
          Hello there! <br /> sign in and start managing your items
        </p>
        <form onSubmit={emailSubmitHandler} className="w-full max-w-xs my-2">
          <div className="my-2">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Username"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${
                !usernameState.isvalid && usernameState.isTouched
                  ? "border-red-500"
                  : ""
              }`}
              value={usernameState.value}
              onChange={usernameChangeHandler}
              onBlur={touchHandler}
            />
          </div>
          <div className="my-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${
                !passState.isvalid && passState.isTouched
                  ? "border-red-500"
                  : ""
              }`}
              value={passState.value}
              onChange={passChangeHandler}
              onBlur={passtouchHandler}
            />
          </div>
          <div className="my-2">
            <button
              className={`w-full rounded bg-blue-600 text-white py-2 px-4 ${
                !usernameState.isvalid || !passState.isvalid
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              type="submit"
              disabled={!usernameState.isvalid || !passState.isvalid}
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
