import React, { useReducer, useState } from "react";
import { validate, VALIDATOR_MINLENGTH } from "../../../../util/validators";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";
import { TiArrowBack } from "react-icons/ti";
import { useNavigate } from "react-router";

//statusName validation
const statusNameReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.statusName,
        isvalid: validate(action.statusName, action.validators),
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

const AddStatus = () => {
  //statusName validation
  const [statusNameState, dispatch] = useReducer(statusNameReducer, {
    value: "",
    isvalid: false,
    isTouched: false,
  });

  const statusNameChangeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      statusName: event.target.value,
      validators: [VALIDATOR_MINLENGTH(3)],
    });
  };
  const statusNameTouchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  /////////////////////////////////

  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [role, setRole] = useState("");

  const newStatusSubmitHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/status/`,
        {
          name: statusNameState.value,
          role: role,
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
    statusNameState.value = "";
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
          onClick={() => navigate("/statuses")}
        >
          <TiArrowBack />
        </button>
        <h2 className="text-center text-2xl font-bold lg:text-3xl">
          Add New Status
        </h2>
      </div>

      <form
        className="grid grid-cols-2 gap-4 w-4/5 mx-auto"
        onSubmit={newStatusSubmitHandler}
      >
        <div className="flex flex-col w-full">
          <label className="w-full font-bold">Status Name</label>
          <input
            type="text"
            placeholder="Status Name"
            value={statusNameState.value}
            onChange={statusNameChangeHandler}
            onBlur={statusNameTouchHandler}
            isvalid={statusNameState.isvalid.toString()}
            className={`w-full ml-2 rounded-sm lg:w-4/5 p-2 ${
              !statusNameState.isvalid &&
              statusNameState.isTouched &&
              "border-red-500"
            }`}
          />
        </div>
        <div className="flex flex-col w-full">
          <label className="w-full font-bold">Role</label>
          <select
            id="role"
            name="role"
            className="w-full ml-2 rounded-sm lg:w-4/5 p-2"
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            <option value="" className="text-secondary">
              Roles
            </option>
            <option value="admin" className="">
              Admin
            </option>
            <option value="specialistService" className="">
              SpecialistService
            </option>
            <option value="customerService" className="">
              CustomerService
            </option>
            <option value="all" className="">
              All
            </option>
          </select>
        </div>

        <div className="col-span-2 flex items-center justify-center">
          <button
            disabled={!statusNameState.isvalid || !role}
            className="bg-cyan-600 text-white rounded py-1 font-bold w-4/5 lg:w-1/5 transition-all hover:bg-cyan-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStatus;
