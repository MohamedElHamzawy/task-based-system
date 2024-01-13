import React, { useReducer, useState } from "react";
import { validate, VALIDATOR_MINLENGTH } from "../../../../util/validators";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";
import { TiArrowBack } from "react-icons/ti";
import { useNavigate } from "react-router";

//countryName validation
const countryNameReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.countryName,
        isvalid: validate(action.countryName, action.validators),
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

const AddCountry = () => {
  //countryName validation
  const [countryNameState, dispatch] = useReducer(countryNameReducer, {
    value: "",
    isvalid: false,
    isTouched: false,
  });

  const countryNameChangeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      countryName: event.target.value,
      validators: [VALIDATOR_MINLENGTH(3)],
    });
  };
  const countryNameTouchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  /////////////////////////////////

  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const newSpecialitySubmitHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/country/`,
        {
          countryName: countryNameState.value,
        }
      );

      const responseData = await response;
      if (!(response.statusText === "OK")) {
        throw new Error(responseData.data.message);
      }
      setError(responseData.data.message);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "SomeThing Went Wrong , Please Try Again .");
    }
    countryNameState.value = "";
  };

  const errorHandler = () => {
    setError(null);
  };
  const navigate = useNavigate();
  return (
    <div className="flex flex-col w-full p-3 min-h-[calc(100vh-65px)]">
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && <LoadingSpinner asOverlay />}

      <div className="relative flex flex-row justify-center w-full p-1 mb-4">
        <button
          className="absolute top-0 left-0 p-2 text-3xl"
          onClick={() => navigate("/country")}
        >
          <TiArrowBack />
        </button>
        <h2 className="text-center text-2xl font-bold lg:text-3xl">
          Add New Country
        </h2>
      </div>

      <form
        className="grid grid-cols-2 gap-4 w-4/5 mx-auto"
        onSubmit={newSpecialitySubmitHandler}
      >
        <div className="col-span-2 flex flex-col items-center justify-center w-full mx-auto">
          <label className="font-bold">Country Name</label>
          <input
            type="text"
            placeholder="Country Name"
            value={countryNameState.value}
            onChange={countryNameChangeHandler}
            onBlur={countryNameTouchHandler}
            isvalid={countryNameState.isvalid.toString()}
            className={`rounded-sm w-1/3 p-2 ${
              !countryNameState.isvalid &&
              countryNameState.isTouched &&
              "border-red-500"
            }`}
          />
        </div>

        <div className="col-span-2 flex items-center justify-center">
          <button
            disabled={!countryNameState.isvalid}
            className="bg-cyan-600 text-white rounded py-1 font-bold w-4/5 lg:w-1/5 transition-all hover:bg-cyan-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCountry;
