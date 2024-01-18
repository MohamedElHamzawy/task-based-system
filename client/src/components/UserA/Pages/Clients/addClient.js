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
import { useNavigate } from "react-router";

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
          .get(
            `${process.env.REACT_APP_BACKEND_URL}:5000/api/currency/valid/list`
          )
          .then((res) => {
            setCurrencies(res.data.currencies);
          });
        setLoading(false);
        setIsLoading(false);
      });
      timerId = setTimeout(async () => {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URL}:5000/api/country/`)
          .then((res) => {
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
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/client/`,
        {
          clientName: clientNameState.value,
          owner: ownerState.value,
          website: clientEmailState.value,
          country: country,
          phone: numberState.value,
          currency: currency,
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

  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full p-3 min-h-[calc(100vh-65px)]">
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && <LoadingSpinner asOverlay />}

      <div className="relative flex flex-row justify-center w-full p-1 mb-4">
        <button
          className="absolute top-0 left-0 p-2 text-3xl"
          onClick={() => navigate("/clients")}
        >
          <TiArrowBack />
        </button>
        <h2 className="text-center text-2xl font-bold lg:text-3xl">
          Add New Client
        </h2>
      </div>

      <form
        className="grid grid-cols-2 gap-4 w-4/5 mx-auto"
        onSubmit={newSpecialitySubmitHandler}
      >
        <div className="flex flex-col w-full">
          <label className="w-full font-bold">Client Name</label>
          <input
            type="text"
            placeholder="Client Name"
            value={clientNameState.value}
            onChange={clientNameChangeHandler}
            onBlur={clientNameTouchHandler}
            isvalid={clientNameState.isvalid.toString()}
            className={`w-full ml-2 rounded-sm lg:w-4/5 p-2 ${
              !clientNameState.isvalid &&
              clientNameState.isTouched &&
              "border-red-500"
            }`}
          />
        </div>
        <div className="flex flex-col w-full">
          <label className="w-full font-bold">Owner</label>
          <input
            type="text"
            placeholder="Owner"
            value={ownerState.value}
            onChange={ownerChangeHandler}
            onBlur={ownerTouchHandler}
            isvalid={ownerState.isvalid.toString()}
            className={`w-full ml-2 rounded-sm lg:w-4/5 p-2 ${
              !ownerState.isvalid && ownerState.isTouched && "border-red-500"
            }`}
          />
        </div>
        <div className="flex flex-col w-full">
          <label className="w-full font-bold">Website</label>
          <input
            type="text"
            placeholder="Client Website"
            value={clientEmailState.value}
            onChange={clientEmailChangeHandler}
            onBlur={clientEmailTouchHandler}
            isvalid={clientEmailState.isvalid.toString()}
            className={`w-full ml-2 rounded-sm lg:w-4/5 p-2 ${
              !clientEmailState.isvalid &&
              clientEmailState.isTouched &&
              "border-red-500"
            }`}
          />
        </div>

        <div className="flex flex-col w-full">
          <label className="w-full font-bold">Country</label>
          <select
            id="country"
            name="country"
            className="w-full ml-2 rounded-sm lg:w-4/5 p-2"
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

        <div className="flex flex-col w-full">
          <label className="w-full font-bold">Phone</label>
          <input
            type="number"
            placeholder="Phone Number"
            value={numberState.value}
            onChange={numberChangeHandler}
            onBlur={numbertouchHandler}
            isvalid={numberState.isvalid.toString()}
            className={`w-full ml-2 rounded-sm lg:w-4/5 p-2 ${
              !numberState.isvalid && numberState.isTouched && "border-red-500"
            }`}
          />
        </div>
        <div className="flex flex-col w-full">
          <label className="w-full font-bold">Currency</label>

          <select
            id="currencies"
            name="currencies"
            className="w-full ml-2 rounded-sm lg:w-4/5 p-2"
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

        <div className="col-span-2 flex items-center justify-center">
          <button
            disabled={
              !clientEmailState.isvalid ||
              !ownerState.isvalid ||
              !clientNameState.isvalid ||
              !numberState.isvalid ||
              !country ||
              !currency
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

export default AddClient;
