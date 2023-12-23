import React, { useEffect, useReducer, useState } from "react";
import { validate, VALIDATOR_MINLENGTH } from "../../../../util/validators";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";
import { TiArrowBack } from "react-icons/ti";
import { useNavigate } from "react-router-dom";

//userName validation
const userNameReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.userName,
        isvalid: validate(action.userName, action.validators),
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

const AddUser = () => {
  const [specialities, setSpecialities] = useState([]);
  const [countries, setCountries] = useState([]);
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

  //userName validation
  const [userNameState, dispatch] = useReducer(userNameReducer, {
    value: "",
    isvalid: false,
    isTouched: false,
  });

  const userNameChangeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      userName: event.target.value,
      validators: [VALIDATOR_MINLENGTH(3)],
    });
  };
  const userNameTouchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

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
      validators: [VALIDATOR_MINLENGTH(3)],
    });
  };
  const passwordTouchHandler = () => {
    dispatch3({
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

  const [visable, setVisable] = useState(false);

  //Role value
  const [role, setRole] = useState("");
  const RoleChangeHandler = (newOne) => {
    setRole(newOne);
    if (newOne == "specialistService") {
      setVisable(true);
    } else {
      setVisable(false);
    }
  };

  //speciality value
  const [speciality, setSpeciality] = useState("");

  const specialityChangeHandler = (newOne) => {
    setSpeciality(newOne);
  };

  //country value
  const [country, setCountry] = useState("");
  const countryChangeHandler = (newOne) => {
    setCountry(newOne);
  };

  /////////////////////////////////

  const newUserSubmitHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/user/`,
        {
          fullName: fullNameState.value,
          userName: userNameState.value,
          password: passwordState.value,
          userRole: role,
          speciality: speciality,
          userType: speciality,
          country: country,
          phone: numberState.value,
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
    userNameState.value = "";
    passwordState.value = "";
    numberState.value = "";
    setRole("");
    setSpeciality("");
    setCountry("");
  };

  const errorHandler = () => {
    setError(null);
  };

  const uniqueItems = specialities.filter((item, index, self) => {
    return index === self.findIndex((i) => i.speciality === item.speciality);
  });
  return (
    <div className="flex flex-col items-center w-full p-3">
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && <LoadingSpinner asOverlay />}

      <div className="flex flex-row items-center justify-between w-full p-1">
        <button className="p-2 text-3xl" onClick={() => navigate("/users")}>
          <TiArrowBack />
        </button>
        <h2 className="text-center text-2xl font-bold lg:text-3xl">
          Add New User
        </h2>
      </div>

      <form
        className="flex flex-col items-center bg-white p-3 w-full"
        onSubmit={newUserSubmitHandler}
      >
        {[
          {
            label: "Full Name",
            state: fullNameState,
            handler: fullNameChangeHandler,
            touchHandler: fullNameTouchHandler,
          },
          {
            label: "User Name",
            state: userNameState,
            handler: userNameChangeHandler,
            touchHandler: userNameTouchHandler,
          },
          {
            label: "Password",
            state: passwordState,
            handler: passwordChangeHandler,
            touchHandler: passwordTouchHandler,
            type: "password",
          },
          {
            label: "Phone",
            state: numberState,
            handler: numberChangeHandler,
            touchHandler: numbertouchHandler,
            type: "number",
          },
        ].map((input, index) => (
          <div
            key={index}
            className="flex flex-col lg:flex-row items-center w-full my-1 py-2"
          >
            <label className="w-full lg:w-1/5 font-bold">{input.label}:</label>
            <input
              type={input.type || "text"}
              placeholder={input.label}
              value={input.state.value}
              onChange={input.handler}
              onBlur={input.touchHandler}
              className={`w-full lg:w-4/5 p-2 ${
                !input.state.isvalid &&
                input.state.isTouched &&
                "border-red-500"
              }`}
            />
          </div>
        ))}

        <div className="flex flex-col lg:flex-row items-center w-full my-1 py-2">
          <label className="w-full lg:w-1/5 font-bold">Country:</label>
          <select
            id="country"
            name="country"
            className="w-full lg:w-4/5 p-2"
            value={country}
            onChange={(event) => countryChangeHandler(event.target.value)}
          >
            <option value="" className="text-gray-500">
              Countries
            </option>
            {countries.map((country) => (
              <option value={country._id} key={country._id}>
                {country.countryName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col lg:flex-row items-center w-full my-1 py-2">
          <label htmlFor="role" className="w-full lg:w-1/5 font-bold">
            Role:
          </label>
          <select
            id="role"
            name="role"
            className="w-full lg:w-4/5 p-2"
            value={role}
            onChange={(event) => RoleChangeHandler(event.target.value)}
          >
            <option value="" className="text-gray-500">
              Roles
            </option>
            <option value="admin">Admin</option>
            <option value="customerService">Customer Service</option>
            <option value="specialistService">Specialist Service</option>
          </select>
        </div>

        {visable && (
          <div className="flex flex-col lg:flex-row items-center w-full my-1 py-2">
            <label htmlFor="speciality" className="w-full lg:w-1/5 font-bold">
              Speciality:
            </label>
            <select
              id="speciality"
              name="speciality"
              className="w-full lg:w-4/5 p-2"
              value={speciality}
              onChange={(event) => specialityChangeHandler(event.target.value)}
            >
              <option value="" className="text-gray-500">
                Specialities
              </option>
              {uniqueItems.map((speciality) => (
                <option value={speciality._id} key={speciality._id}>
                  {speciality.speciality}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex justify-center w-full my-3 mt-5">
          <button
            disabled={
              !visable
                ? !fullNameState.isvalid ||
                  !userNameState.isvalid ||
                  !passwordState.isvalid ||
                  !numberState.isvalid ||
                  !country ||
                  !role
                : !fullNameState.isvalid ||
                  !userNameState.isvalid ||
                  !passwordState.isvalid ||
                  !country ||
                  !numberState.isvalid ||
                  !role ||
                  !speciality
            }
            className="disabled:opacity-50 p-3 font-bold w-4/5 lg:w-1/5"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
