import React, { useReducer, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";
import { validate, VALIDATOR_MINLENGTH } from "../../../../util/validators";
import { useNavigate } from "react-router";

//password validation
const passwordReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.password,
        isvalid: validate(action.password, action.validators),
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

const ChangePass = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const userID = JSON.parse(localStorage.getItem("UserBData"));

  //password validation
  const [passwordState, dispatch3] = useReducer(passwordReducer, {
    value: "",
    isvalid: false,
    isTouched: false,
  });

  const passwordChangeHandler = (event) => {
    dispatch3({
      type: "CHANGE",
      password: event.target.value,
      validators: [VALIDATOR_MINLENGTH(6)],
    });
  };
  const passwordTouchHandler = () => {
    dispatch3({
      type: "TOUCH",
    });
  };

  //////////////////////////////////////
  const editUserHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/user/password/${userID}`,
        {
          password: passwordState.value,
        }
      );
      const responseData = await response;

      if (!(response.statusText === "OK")) {
        throw new Error(responseData.data.message);
      }
      setError(responseData.data.message);
      setIsLoading(false);
      window.location.href = "/settings";
    } catch (err) {
      setIsLoading(false);
      setError(err.message && "SomeThing Went Wrong , Please Try Again .");
    }
  };

  //error message
  const errorHandler = () => {
    setError(null);
    window.location.reload(true);
  };

  const navigate = useNavigate();

  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="min-h-[calc(100vh-68px)] container mx-auto p-4 flex flex-col items-center">
      <ErrorModal error={error} onClear={errorHandler} />

      <div className="relative w-full flex items-center justify-center">
        <div className="absolute top-0 left-0">
          <button
            type="button"
            className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 text-gray-600 focus:outline-none"
            onClick={() => navigate("/settings")}
          >
            <svg
              className="h-6 w-6 fill-current"
              viewBox="0 0 256 512"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M169.5 445.1l-22.2 22.2c-4.7 4.7-12.3 4.7-17 0l-176-176c-4.7-4.7-4.7-12.3 
                0-17l176-176c4.7-4.7 12.3-4.7 
                17 0l22.2 22.2c4.7 4.7 4.7 12.3 
                0 17L59.7 256l109.8 109.8c4.7 4.7 
                4.7 12.3 0 17z"
              />
            </svg>
          </button>
        </div>
        <h2 className="text-2xl font-semibold text-gray-500">
          Change Password
        </h2>
      </div>

      <div className="rounded-lg p-4 md:p-8">
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-400 font-medium mb-2"
          >
            Password:
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter New Password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={passwordTouchHandler}
            className={`border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !passwordState.isvalid &&
              passwordState.isTouched &&
              "border-red-500"
            }`}
          />
        </div>

        <button
          type="button"
          disabled={!passwordState.isvalid}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-400 transition-all active:scale-95"
          onClick={editUserHandler}
        >
          Change
        </button>
      </div>
    </div>
  );
};

export default ChangePass;
