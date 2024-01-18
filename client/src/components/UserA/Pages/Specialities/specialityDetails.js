import React, { useEffect, useReducer, useState } from "react";
import { validate, VALIDATOR_MINLENGTH } from "../../../../util/validators";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";

import { useNavigate, useParams } from "react-router-dom";
import { RiDeleteBinFill } from "react-icons/ri";
import { TiArrowBack } from "react-icons/ti";
import { ImCancelCircle } from "react-icons/im";

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

const SpecialityDetails = () => {
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  let { id } = useParams();

  const [speciality, setSpeciality] = useState([]);

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URL}:5000/api/speciality/${id}`)
          .then((res) => {
            setSpeciality(res.data.speciality);
          });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  //specialityName validation
  const [specialityNameState, dispatch] = useReducer(specialityNameReducer, {
    value: speciality.sub_speciality,
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
    value: speciality.speciality,
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

  //////////////////////////////////////
  const editSpecialityHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/speciality/${speciality._id}`,
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
      setError(err.message && "SomeThing Went Wrong , Please Try Again .");
    }
  };

  //delete user
  const deleteSpecialityHandler = async () => {
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/speciality/${id}`
        //  ,
        //  { headers :{
        //     'Authorization':`Bearer ${token}`
        //   }
        // }
      );
      const responseData = await response;

      setError(responseData.data.message);
      setIsLoading(false);
      window.location.href = "/specialities";
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "SomeThing Went Wrong , Please Try Again .");
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
    <div className="flex flex-col w-full p-3 min-h-[calc(100vh-65px)]">
      <ErrorModal error={error} onClear={errorHandler} />

      <div className="relative flex flex-row justify-center w-full p-1 mb-4">
        <button
          className="absolute top-0 left-0 p-2 text-3xl"
          onClick={() => navigate("/specialities")}
        >
          <TiArrowBack />
        </button>
        <h2 className="text-center text-2xl font-bold lg:text-3xl">
          Speciality Details
        </h2>
      </div>

      <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Speciality Details</h2>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={deleteSpecialityHandler}
          >
            <RiDeleteBinFill className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="subSpeciality"
              className="block text-gray-700 font-bold mb-2"
            >
              Sub-Speciality:
            </label>
            {!edit ? (
              <p className="text-lg font-medium">{speciality.sub_speciality}</p>
            ) : (
              <input
                type="text"
                id="subSpeciality"
                placeholder={speciality.sub_speciality}
                value={specialityNameState.value}
                onChange={specialityNameChangeHandler}
                onBlur={specialityNameTouchHandler}
                isvalid={specialityNameState.isvalid.toString()}
                className={`rounded-md shadow-sm border border-gray-300 p-2 text-lg ${
                  !specialityNameState.isvalid &&
                  specialityNameState.isTouched &&
                  "border-red-500"
                }`}
              />
            )}
          </div>

          <div>
            <label
              htmlFor="speciality"
              className="block text-gray-700 font-bold mb-2"
            >
              Speciality:
            </label>
            {!edit ? (
              <p className="text-lg font-medium">{speciality.speciality}</p>
            ) : (
              <input
                type="text"
                id="speciality"
                placeholder={speciality.speciality}
                value={specialitTypeState.value}
                onChange={specialitTypeChangeHandler}
                onBlur={specialitTypeTouchHandler}
                isvalid={specialitTypeState.isvalid.toString()}
                className={`rounded-md shadow-sm border border-gray-300 p-2 text-lg ${
                  !specialitTypeState.isvalid &&
                  specialitTypeState.isTouched &&
                  "border-red-500"
                }`}
              />
            )}
          </div>
        </div>

        <div className="flex justify-end mt-4 space-x-1">
          {!edit ? (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setEdit(true)}
            >
              Edit
            </button>
          ) : (
            <>
              <button
                disabled={
                  !specialitTypeState.isvalid && !specialityNameState.isvalid
                }
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={editSpecialityHandler}
              >
                Submit
              </button>
              <button
                className="bg-gray-400 hover:bg-gray-600 text-gray-800 font-bold py-2 px-4 rounded"
                onClick={() => setEdit(false)}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecialityDetails;
