import React, { useReducer, useState } from "react";
import { validate, VALIDATOR_MINLENGTH } from "../../../../util/validators";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";
import { TiArrowBack } from "react-icons/ti";

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
        " https://smarteduservices.com:5000/api/currency/",
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
  return (
    <div className="row text-center p-3 w-100 m-0">
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && <LoadingSpinner asOverlay />}

      <div className="row p-1">
        <div className="col-3 text-center">
          <button
            className="back-btn p-2 px-3 fs-3 "
            onClick={() => {
              window.location.href = "/currency";
            }}
          >
            <TiArrowBack />{" "}
          </button>
        </div>
        <h2 className="col-12 col-lg-7 text-center system-head p-3">
          {" "}
          Add New Currency
        </h2>
      </div>

      <form
        className="adduser-form bg-white p-3 row justify-content-center m-0"
        onSubmit={newCurrencySubmitHandler}
      >
        <div className="col-12 col-lg-5 m-1 py-2 p-0">
          <label className="col-10 col-lg-5 fw-bold add-user-p">
            Currency Name:
          </label>
          <input
            type="text"
            placeholder="Currency Name"
            value={currencyNameState.value}
            onChange={currencyNameChangeHandler}
            onBlur={currencyNameTouchHandler}
            isvalid={currencyNameState.isvalid.toString()}
            className={`col-10 col-lg-7 search p-2 ${
              !currencyNameState.isvalid &&
              currencyNameState.isTouched &&
              "form-control-invalid"
            }`}
          />
        </div>
        <div className="col-12 col-lg-5 m-1 py-2 p-0">
          <label className="col-10 col-lg-5 fw-bold add-user-p">
            Currency Price:
          </label>
          <input
            type="number"
            placeholder="Currency Price"
            value={currencyPriceState.value}
            onChange={currencyPriceChangeHandler}
            onBlur={currencyPriceTouchHandler}
            isvalid={currencyPriceState.isvalid.toString()}
            className={`col-10 col-lg-7 search p-2 ${
              !currencyPriceState.isvalid &&
              currencyPriceState.isTouched &&
              "form-control-invalid"
            }`}
          />
        </div>

        <div className="col-8 m-3 mt-5 row justify-content-center">
          <button
            disabled={!currencyPriceState.isvalid || !currencyNameState.isvalid}
            className="add-user-btn p-3  fw-bold col-10 col-lg-5"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCurrency;
