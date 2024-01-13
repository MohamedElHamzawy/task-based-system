import React, { useReducer, useState } from "react";
import { validate, VALIDATOR_MINLENGTH } from "../../../../util/validators";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";
import { TiArrowBack } from "react-icons/ti";
import { useNavigate } from "react-router";

//specialityName validation
const specialityNameReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.specialityName,
        isvalid: validate(action.specialityName, action.validators),
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
//specialitType validation
const specialitTypeReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.specialitType,
        isvalid: validate(action.specialitType, action.validators),
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

const AddSpeciality = () => {
  //specialityName validation
  const [specialityNameState, dispatch] = useReducer(specialityNameReducer, {
    value: "",
    isvalid: false,
    isTouched: false,
  });

  const specialityNameChangeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      specialityName: event.target.value,
      validators: [VALIDATOR_MINLENGTH(3)],
    });
  };
  const specialityNameTouchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  //specialitType validation
  const [specialitTypeState, dispatch2] = useReducer(specialitTypeReducer, {
    value: "",
    isvalid: false,
    isTouched: false,
  });

  const specialitTypeChangeHandler = (event) => {
    dispatch2({
      type: "CHANGE",
      specialitType: event.target.value,
      validators: [VALIDATOR_MINLENGTH(3)],
    });
  };
  const specialitTypeTouchHandler = () => {
    dispatch2({
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
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/speciality/`,
        {
          sub_speciality: specialityNameState.value,
          speciality: specialitTypeState.value,
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
    specialitTypeState.value = "";
    specialityNameState.value = "";
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
          onClick={() => navigate("/specialities")}
        >
          <TiArrowBack />
        </button>
        <h2 className="text-center text-2xl font-bold lg:text-3xl">
          Add New Speciality
        </h2>
      </div>

      <form
        className="grid grid-cols-2 gap-4 w-4/5 mx-auto"
        onSubmit={newSpecialitySubmitHandler}
      >
        <div className="flex flex-col w-full">
          <label className="w-full font-bold">Sub-Speciality</label>
          <input
            type="text"
            placeholder="Speciality Type"
            value={specialityNameState.value}
            onChange={specialityNameChangeHandler}
            onBlur={specialityNameTouchHandler}
            isvalid={specialityNameState.isvalid.toString()}
            className={`w-full ml-2 rounded-sm lg:w-4/5 p-2 ${
              !specialityNameState.isvalid &&
              specialityNameState.isTouched &&
              "border-red-500"
            }`}
          />
        </div>
        <div className="flex flex-col w-full">
          <label className="w-full font-bold">Speciality</label>
          <input
            type="text"
            placeholder="Speciality Name"
            value={specialitTypeState.value}
            onChange={specialitTypeChangeHandler}
            onBlur={specialitTypeTouchHandler}
            isvalid={specialitTypeState.isvalid.toString()}
            className={`w-full ml-2 rounded-sm lg:w-4/5 p-2 ${
              !specialitTypeState.isvalid &&
              specialitTypeState.isTouched &&
              "border-red-500"
            }`}
          />
        </div>
        <div className="col-span-2 flex items-center justify-center">
          <button
            disabled={
              !specialitTypeState.isvalid || !specialityNameState.isvalid
            }
            className="bg-cyan-600 text-white rounded py-1 font-bold w-4/5 lg:w-1/5 transition-all hover:bg-cyan-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSpeciality;
