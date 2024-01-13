import React, { useReducer, useState } from "react";
import { validate, VALIDATOR_MINLENGTH } from "../../../../util/validators";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";
import { TiArrowBack } from "react-icons/ti";
import { useNavigate } from "react-router";

//CurrencyName validation
const currencyNameReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.currencyName,
        isvalid: validate(action.currencyName, action.validators),
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
//CurrencyPrice validation
const currencyPriceReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.currencyPrice,
        isvalid: validate(action.currencyPrice, action.validators),
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

const AddCurrency = () => {
  //CurrencyName validation
  const [currencyNameState, dispatch] = useReducer(currencyNameReducer, {
    value: "",
    isvalid: false,
    isTouched: false,
  });

  const currencyNameChangeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      currencyName: event.target.value,
      validators: [VALIDATOR_MINLENGTH(3)],
    });
  };
  const currencyNameTouchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  //currencyPrice validation
  const [currencyPriceState, dispatch2] = useReducer(currencyPriceReducer, {
    value: "",
    isvalid: false,
    isTouched: false,
  });

  const currencyPriceChangeHandler = (event) => {
    dispatch2({
      type: "CHANGE",
      currencyPrice: event.target.value,
      validators: [VALIDATOR_MINLENGTH(1)],
    });
  };
  const currencyPriceTouchHandler = () => {
    dispatch2({
      type: "TOUCH",
    });
  };

  /////////////////////////////////

  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const newCurrencySubmitHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/currency/`,
        {
          name: currencyNameState.value,
          price: currencyPriceState.value,
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
    currencyPriceState.value = "";
    currencyNameState.value = "";
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
          onClick={() => navigate("/currency")}
        >
          <TiArrowBack />
        </button>
        <h2 className="text-center text-2xl font-bold lg:text-3xl">
          Add New Currency
        </h2>
      </div>

      <form
        className="grid grid-cols-2 gap-4 w-4/5 mx-auto"
        onSubmit={newCurrencySubmitHandler}
      >
        <div className="flex flex-col w-full">
          <label className="w-full font-bold">Currency Name</label>
          <input
            type="text"
            placeholder="Currency Name"
            value={currencyNameState.value}
            onChange={currencyNameChangeHandler}
            onBlur={currencyNameTouchHandler}
            isvalid={currencyNameState.isvalid.toString()}
            className={`w-full ml-2 rounded-sm lg:w-4/5 p-2 ${
              !currencyNameState.isvalid &&
              currencyNameState.isTouched &&
              "border-red-500"
            }`}
          />
        </div>
        <div className="flex flex-col w-full">
          <label className="w-full font-bold">Currency Price</label>
          <input
            type="number"
            placeholder="Currency Price"
            value={currencyPriceState.value}
            onChange={currencyPriceChangeHandler}
            onBlur={currencyPriceTouchHandler}
            isvalid={currencyPriceState.isvalid.toString()}
            className={`w-full ml-2 rounded-sm lg:w-4/5 p-2 ${
              !currencyPriceState.isvalid &&
              currencyPriceState.isTouched &&
              "border-red-500"
            }`}
          />
        </div>

        <div className="col-span-2 flex items-center justify-center">
          <button
            disabled={!currencyPriceState.isvalid || !currencyNameState.isvalid}
            className="bg-cyan-600 text-white rounded py-1 font-bold w-4/5 lg:w-1/5 transition-all hover:bg-cyan-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCurrency;
