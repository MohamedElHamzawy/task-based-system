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

//fullName validation
const fullNameReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.fullName,
        isvalid: validate(action.fullName, action.validators),
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
//email validation
const emailReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.email,
        isvalid: validate(action.email, action.validators),
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

const AddFreeLancer = () => {
  const [currencies, setCurrencies] = useState([]);
  const [countries, setCountries] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URL}:5000/api/speciality/`)
          .then((res) => {
            setSpecialities(res.data.specialities);
          });
        setLoading(false);
        setIsLoading(false);
      });
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
  const currencyChangeHandler = (newOne) => {
    setCurrency(newOne);
  };
  //speciality value
  const [speciality, setSpeciality] = useState("");

  //fullName validation
  const [fullNameState, dispatch2] = useReducer(fullNameReducer, {
    value: "",
    isvalid: false,
    isTouched: false,
  });

  const fullNameChangeHandler = (event) => {
    dispatch2({
      type: "CHANGE",
      fullName: event.target.value,
      validators: [VALIDATOR_MINLENGTH(3)],
    });
  };
  const fullNameTouchHandler = () => {
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

  //email validation
  const [emailState, dispatch7] = useReducer(emailReducer, {
    value: "",
    isvalid: false,
    isTouched: false,
  });

  const emailChangeHandler = (event) => {
    dispatch7({
      type: "CHANGE",
      email: event.target.value,
      validators: [VALIDATOR_EMAIL()],
    });
  };
  const emailTouchHandler = () => {
    dispatch7({
      type: "TOUCH",
    });
  };

  //country value
  const [country, setCountry] = useState("");
  const countryChangeHandler = (newOne) => {
    setCountry(newOne);
  };

  /////////////////////////////////

  const newFreeLancerSubmitHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/freelancer/`,
        {
          name: fullNameState.value,
          speciality: speciality,
          phone: numberState.value,
          email: emailState.value,
          country: country,
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
    fullNameState.value = "";
    numberState.value = "";
    emailState.value = "";
    setCountry("");
    setSpeciality("");
    setCurrency("");
  };

  const errorHandler = () => {
    setError(null);
  };
  return (
    <div className="flex flex-col w-full p-3 min-h-[calc(100vh-65px)]">
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && <LoadingSpinner asOverlay />}

      <div className="relative flex flex-row justify-center w-full p-1 mb-4">
        <button
          className="absolute top-0 left-0 p-2 text-3xl"
          onClick={() => navigate("/freelancers")}
        >
          <TiArrowBack />
        </button>
        <h2 className="text-center text-2xl font-bold lg:text-3xl">
          Add New FreeLancer
        </h2>
      </div>

      <form
        className="grid grid-cols-2 gap-4 w-4/5 mx-auto"
        onSubmit={newFreeLancerSubmitHandler}
      >
        <div className="flex flex-col w-full">
          <label className="w-full lg:w-1/5 font-bold">Name</label>
          <input
            type="text"
            placeholder="Full Name"
            value={fullNameState.value}
            onChange={fullNameChangeHandler}
            onBlur={fullNameTouchHandler}
            isvalid={fullNameState.isvalid.toString()}
            className={`w-full ml-2 rounded-sm lg:w-4/5 p-2 ${
              !fullNameState.isvalid &&
              fullNameState.isTouched &&
              "border-red-500"
            }`}
          />
        </div>

        <div className="flex flex-col w-full">
          <label className="w-full lg:w-1/5 font-bold">Phone</label>
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
          <label className="w-full lg:w-1/5 font-bold">Email</label>
          <input
            type="email"
            placeholder="Email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={emailTouchHandler}
            isvalid={emailState.isvalid.toString()}
            className={`w-full ml-2 rounded-sm lg:w-4/5 p-2 `}
          />
        </div>

        <div className="flex flex-col w-full">
          <label className="w-full lg:w-1/5 font-bold">Country</label>
          <select
            id="country"
            name="country"
            className="w-full ml-2 rounded-sm lg:w-4/5 p-2"
            value={country}
            onChange={(event) => countryChangeHandler(event.target.value)}
          >
            <option value="" className="text-gray-400">
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
          <label htmlFor="currency" className="w-full lg:w-1/5 font-bold">
            Currency
          </label>

          <select
            id="currencies"
            name="currencies"
            className="w-full ml-2 rounded-sm lg:w-4/5 p-2"
            value={currency}
            onChange={(event) => currencyChangeHandler(event.target.value)}
          >
            <option value="" className="text-gray-400">
              currencies
            </option>
            {currencies.map((currency) => (
              <option value={currency._id} key={currency._id}>
                {currency.currencyname}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="speciality" className="w-full lg:w-1/5 font-bold">
            Speciality
          </label>
          <select
            className="w-full ml-2 rounded-sm lg:w-4/5 p-2"
            onChange={(event) => setSpeciality(event.target.value)}
          >
            <option value="" className="text-gray-400">
              Specialities
            </option>
            {specialities.map((speciality) => (
              <option value={speciality._id} key={speciality._id}>
                {speciality.sub_speciality}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-2 w-full flex items-center justify-center">
          <button
            disabled={
              !fullNameState.isvalid ||
              !numberState.isvalid ||
              !country ||
              !speciality ||
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

export default AddFreeLancer;
