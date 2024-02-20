import React, { useEffect, useReducer, useState } from "react";
import {
  validate,
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
} from "../../../../util/validators";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";
import { TiArrowBack } from "react-icons/ti";

//clientName validation
const clientNameReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.clientName,
        isvalid: validate(action.clientName, action.validators),
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
//owner validation
const ownerReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.owner,
        isvalid: validate(action.owner, action.validators),
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
//clientEmail validation
const clientEmailReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.clientEmail,
        isvalid: validate(action.clientEmail, action.validators),
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

//number validation
const numberReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.number,
        isvalid: validate(action.number, action.validators),
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

const AddClient = () => {
  const [currencies, setCurrencies] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios
          .get(" http://localhost:5000/api/currency/valid/list")
          .then((res) => {
            setCurrencies(res.data.currencies);
          });
        setLoading(false);
        setIsLoading(false);
      });
      timerId = setTimeout(async () => {
        await axios.get(" http://localhost:5000/api/country/").then((res) => {
          setCountries(res.data.countries);
        });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  //currency value
  const [currency, setCurrency] = useState("");

  //clientName validation
  const [clientNameState, dispatch] = useReducer(clientNameReducer, {
    value: "",
    isvalid: false,
    isTouched: false,
  });

  const clientNameChangeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      clientName: event.target.value,
      validators: [VALIDATOR_MINLENGTH(3)],
    });
  };
  const clientNameTouchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };
  //owner validation
  const [ownerState, dispatch9] = useReducer(ownerReducer, {
    value: "",
    isvalid: false,
    isTouched: false,
  });

  const ownerChangeHandler = (event) => {
    dispatch9({
      type: "CHANGE",
      owner: event.target.value,
      validators: [VALIDATOR_MINLENGTH(3)],
    });
  };
  const ownerTouchHandler = () => {
    dispatch9({
      type: "TOUCH",
    });
  };

  //clientEmail validation
  const [clientEmailState, dispatch2] = useReducer(clientEmailReducer, {
    value: "",
    isvalid: false,
    isTouched: false,
  });

  const clientEmailChangeHandler = (event) => {
    dispatch2({
      type: "CHANGE",
      clientEmail: event.target.value,
      validators: [VALIDATOR_MINLENGTH(6)],
    });
  };
  const clientEmailTouchHandler = () => {
    dispatch2({
      type: "TOUCH",
    });
  };

  //Number validation
  const [numberState, dispatch5] = useReducer(numberReducer, {
    value: "",
    isvalid: false,
    isTouched: false,
  });

  const numberChangeHandler = (event) => {
    dispatch5({
      type: "CHANGE",
      number: event.target.value,
      validators: [VALIDATOR_MINLENGTH(11)],
    });
  };
  const numbertouchHandler = () => {
    dispatch5({
      type: "TOUCH",
    });
  };

  //country value
  const [country, setCountry] = useState("");
  const countryChangeHandler = (newOne) => {
    setCountry(newOne);
  };

  /////////////////////////////////

  const newSpecialitySubmitHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(" http://localhost:5000/api/client/", {
        clientName: clientNameState.value,
        owner: ownerState.value,
        website: clientEmailState.value,
        country: country,
        phone: numberState.value,
        currency: currency,
      });

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
    clientEmailState.value = "";
    clientNameState.value = "";
    ownerState.value = "";
    setCountry("");
    numberState.value = "";
    setCurrency("");
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
              window.location.href = "/clients";
            }}
          >
            <TiArrowBack />{" "}
          </button>
        </div>
        <h2 className="col-12 col-lg-7 text-center system-head p-3">
          {" "}
          Add New Client
        </h2>
      </div>

      <form
        className="adduser-form bg-white p-3 row justify-content-center m-0"
        onSubmit={newSpecialitySubmitHandler}
      >
        <div className="col-12 col-lg-5 m-1 py-2 p-0">
          <label className="col-10 col-lg-5 fw-bold add-user-p py-2">
            Client Name:
          </label>
          <input
            type="text"
            placeholder="Client Name"
            value={clientNameState.value}
            onChange={clientNameChangeHandler}
            onBlur={clientNameTouchHandler}
            isvalid={clientNameState.isvalid.toString()}
            className={`col-10 col-lg-7 search p-2 ${
              !clientNameState.isvalid &&
              clientNameState.isTouched &&
              "form-control-invalid"
            }`}
          />
        </div>
        <div className="col-12 col-lg-5 m-1 py-2 p-0">
          <label className="col-10 col-lg-5 fw-bold add-user-p py-2">
            Owner :
          </label>
          <input
            type="text"
            placeholder="Owner"
            value={ownerState.value}
            onChange={ownerChangeHandler}
            onBlur={ownerTouchHandler}
            isvalid={ownerState.isvalid.toString()}
            className={`col-10 col-lg-7 search p-2 ${
              !ownerState.isvalid &&
              ownerState.isTouched &&
              "form-control-invalid"
            }`}
          />
        </div>
        <div className="col-12 col-lg-5 m-1 py-2 p-0">
          <label className="col-10 col-lg-5 fw-bold add-user-p py-2">
            Website :
          </label>
          <input
            type="website"
            placeholder="Client Website"
            value={clientEmailState.value}
            onChange={clientEmailChangeHandler}
            onBlur={clientEmailTouchHandler}
            isvalid={clientEmailState.isvalid.toString()}
            className={`col-10 col-lg-7 search p-2 `}
          />
        </div>

        <div className="col-12 col-lg-5 m-1 py-2 p-0">
          <label className="col-10 col-lg-5 fw-bold add-user-p py-2">
            Country:
          </label>
          <select
            id="country"
            name="country"
            className="p-2 px-4 search col-10 col-lg-7"
            value={country}
            onChange={(event) => countryChangeHandler(event.target.value)}
          >
            <option value="" className="text-secondary">
              Countries
            </option>
            {countries.map((country) => (
              <option value={country._id} key={country._id}>
                {country.countryName}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 col-lg-5 m-1 py-2 p-0">
          <label className="col-10 col-lg-5 fw-bold add-user-p py-2">
            Phone :
          </label>
          <input
            type="number"
            placeholder="Phone Number"
            value={numberState.value}
            onChange={numberChangeHandler}
            onBlur={numbertouchHandler}
            isvalid={numberState.isvalid.toString()}
            className={`col-10 col-lg-7 search p-2 ${
              !numberState.isvalid &&
              numberState.isTouched &&
              "form-control-invalid"
            }`}
          />
        </div>
        <div className="d-block col-12 col-lg-5 m-1 py-2 p-0">
          <label
            htmlFor="currency"
            className="col-10 col-lg-5 fw-bold add-user-p py-2"
          >
            {" "}
            Currency:
          </label>

          <select
            id="currencies"
            name="currencies"
            className="p-2 px-4 search col-10 col-lg-7"
            value={currency}
            onChange={(event) => setCurrency(event.target.value)}
          >
            <option value="" className="text-secondary">
              currencies
            </option>
            {currencies.map((currency) => (
              <option value={currency._id} key={currency._id}>
                {currency.currencyname}
              </option>
            ))}
          </select>
        </div>

        <div className="col-8 m-3 mt-5 row justify-content-center">
          <button
            disabled={
              !ownerState.isvalid ||
              !clientNameState.isvalid ||
              !numberState.isvalid ||
              !country ||
              !currency
            }
            className="add-user-btn p-3  fw-bold col-10 col-lg-5"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddClient;
