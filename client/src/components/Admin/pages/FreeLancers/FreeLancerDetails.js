import React, { useEffect, useReducer, useState } from "react";

import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";
import {
  validate,
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
} from "../../../../util/validators";

import { useNavigate, useParams } from "react-router-dom";
import { RiDeleteBinFill } from "react-icons/ri";
import { TiArrowBack } from "react-icons/ti";
import { FaTasks } from "react-icons/fa";
import { FaCoins } from "react-icons/fa";
import { FaCcVisa } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import { BsFillFolderSymlinkFill } from "react-icons/bs";
import { AiOutlineFileDone } from "react-icons/ai";
import { GiProfit } from "react-icons/gi";
import { FiFilter } from "react-icons/fi";

// Date filter

const getDateFilter = (start, end, tasks) => {
  if (!start || !end) {
    return tasks;
  }
  return tasks.filter(
    (task) =>
      start <= task.deadline.split("T")[0] && task.deadline.split("T")[0] <= end
  );
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
//country validation
const countryReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.country,
        isvalid: validate(action.country, action.validators),
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

const FreeLancerDetails = () => {
  const [editFull, setEditFull] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  let { id } = useParams();

  const [freeLancer, setFreeLancer] = useState([]);
  const [countries, setCountries] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [freeLancerAccount, setFreeLancerAccount] = useState();
  const [freeLancerTasks, setFreeLancerTasks] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URL}:5000/api/freeLancer/${id}`)
          .then((res) => {
            setFreeLancer(res.data.freelancer);
            setFreeLancerTasks(res.data.freelancerTasks);
            setFreeLancerAccount(res.data.freelancerAccount);
          });
        setLoading(false);
        setIsLoading(false);
      });
      timerId = setTimeout(async () => {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URL}:5000/api/speciality/`)
          .then((res) => {
            setSpecialities(res.data.specialities);
          });
      });
      timerId = setTimeout(async () => {
        await axios
          .get(
            `${process.env.REACT_APP_BACKEND_URL}:5000/api/currency/valid/list`
          )
          .then((res) => {
            setCurrencies(res.data.currencies);
          });
      });
      timerId = setTimeout(async () => {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URL}:5000/api/country/`)
          .then((res) => {
            setCountries(res.data.countries);
          });
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  //speciality value
  const specialityChangeHandler = (newOne) => {
    setUserSpeciality(newOne);
  };

  //fullName validation
  const [fullNameState, dispatch2] = useReducer(fullNameReducer, {
    value: freeLancer.freelancername,
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
    value: freeLancer.phone,
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
    value: freeLancer.email,
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

  const [currency, setCurreny] = useState(
    freeLancer.currency && freeLancer.currency.currencyname
  );
  const [userSpeciality, setUserSpeciality] = useState(
    freeLancer.speciality && freeLancer.speciality.sub_speciality
  );

  //////////////////////////////////////
  const editFreeLancerHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/freelancer/${freeLancer._id}`,
        {
          name: fullNameState.value,
          speciality: userSpeciality,
          email: emailState.value,
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
      setError(err.message && "SomeThing Went Wrong , Please Try Again .");
    }
  };

  //delete user
  const deleteFreeLancerHandler = async () => {
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/freelancer/${id}`
        //  ,
        //  { headers :{
        //     'Authorization':`Bearer ${token}`
        //   }
        // }
      );
      const responseData = await response;

      setError(responseData.data.message);
      setIsLoading(false);
      window.location.href = "/freelancers";
    } catch (err) {
      setIsLoading(false);
      setError(err.message && "SomeThing Went Wrong , Please Try Again .");
    }
  };
  //error message
  const errorHandler = () => {
    setError(null);
    window.location.reload(true);
  };

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [withoutFilterData, setwithoutFilterData] = useState(true);
  const [dateFilterData, setDateFilterData] = useState(false);
  const DateFilter = getDateFilter(start, end, freeLancerTasks);

  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="flex flex-col space-y-4 text-center w-full p-2 m-0">
      <ErrorModal error={error} onClear={errorHandler} />

      <div className="relative flex justify-center items-center">
        <div className="text-center">
          <button
            className="absolute left-0 top-5 p-2 px-3 text-3xl"
            onClick={() => navigate("/freelancers")}
          >
            <TiArrowBack />
          </button>
        </div>
        <h2 className="text-center p-2 pt-4 fw-bold">Freelancer Details</h2>
      </div>

      <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-end mb-4">
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
            onClick={deleteFreeLancerHandler}
          >
            <RiDeleteBinFill className="w-6 h-6" />
          </button>
        </div>

        {/* /////////////////////// */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="col-span-1">
            <h3 className="text-lg font-medium text-gray-900">Full Name:</h3>
            <p
              className={
                !editFull ? "text-lg font-medium text-gray-700" : "hidden"
              }
            >
              {freeLancer.freelancername}
            </p>
            <input
              type="text"
              className={`${
                editFull
                  ? "block w-full rounded-md border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  : "hidden"
              } ${
                !fullNameState.isvalid &&
                fullNameState.isTouched &&
                "border-red-500"
              }`}
              placeholder={freeLancer.freelancername}
              value={fullNameState.value}
              onChange={fullNameChangeHandler}
              onBlur={fullNameTouchHandler}
              isvalid={fullNameState.isvalid.toString()}
            />
          </div>
          {/* ... other form fields with similar styling ... */}
          <div className="col-span-1">
            <h3 className="text-lg font-medium text-gray-900"> Email:</h3>
            <p
              className={
                !editFull ? "text-lg font-medium text-gray-700" : "hidden"
              }
            >
              {freeLancer.email}
            </p>
            <input
              type="email"
              className={`${
                editFull
                  ? "block w-full rounded-md border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  : "hidden"
              } ${
                !emailState.isvalid && emailState.isTouched && "border-red-500"
              }`}
              placeholder={freeLancer.email}
              value={emailState.value}
              onChange={emailChangeHandler}
              onBlur={emailTouchHandler}
              isvalid={emailState.isvalid.toString()}
            />
          </div>
          <div className="col-span-1">
            <h3 className="text-lg font-medium text-gray-900">Phone:</h3>
            <p
              className={
                !editFull ? "text-lg font-medium text-gray-700" : "hidden"
              }
            >
              {freeLancer.phone}
            </p>
            <input
              type="number"
              className={`${
                editFull
                  ? "block w-full rounded-md border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  : "hidden"
              } ${
                !numberState.isvalid &&
                numberState.isTouched &&
                "border-red-500"
              }`}
              placeholder={freeLancer.phone}
              value={numberState.value}
              onChange={numberChangeHandler}
              onBlur={numbertouchHandler}
              isvalid={numberState.isvalid.toString()}
            />
          </div>
          <div className="col-span-1">
            <h3 className="text-lg font-medium text-gray-900">Speciality:</h3>
            <p
              className={
                !editFull ? "text-lg font-medium text-gray-700" : "hidden"
              }
            >
              {freeLancer.speciality && freeLancer.speciality.sub_speciality}
            </p>
            <div className={editFull ? "inline py-2" : "hidden"}>
              <select
                id="speciality"
                name="speciality"
                className="w-full rounded-md border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={userSpeciality}
                onChange={(event) =>
                  specialityChangeHandler(event.target.value)
                }
              >
                <option selected disabled value="" className="text-secondary">
                  Previous:{" "}
                  {freeLancer.speciality &&
                    freeLancer.speciality.sub_speciality}
                </option>
                {specialities.map((speciality) => (
                  <option value={speciality._id} key={speciality._id}>
                    {speciality.sub_speciality}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-medium text-gray-900">Country:</h3>
            <p
              className={
                !editFull ? "text-lg font-medium text-gray-700" : "hidden"
              }
            >
              {freeLancer.country && freeLancer.country.countryName}
            </p>
            <div className={editFull ? "inline py-2" : "hidden"}>
              <select
                id="speciality"
                name="speciality"
                className="w-full rounded-md border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={country}
                onChange={(event) => countryChangeHandler(event.target.value)}
              >
                <option selected disabled value="" className="text-secondary">
                  Previous:{" "}
                  {freeLancer.country && freeLancer.country.countryName}
                </option>
                {countries.map((country) => (
                  <option value={country._id} key={country._id}>
                    {country.countryName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-medium text-gray-900">Currency:</h3>
            <p
              className={
                !editFull ? "text-lg font-medium text-gray-700" : "hidden"
              }
            >
              {freeLancer.currency && freeLancer.currency.currencyname}
            </p>
            <div className={editFull ? "inline py-2" : "hidden"}>
              <select
                id="Currency"
                name="Currency"
                className="w-full rounded-md border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={currency}
                onChange={(event) => setCurreny(event.target.value)}
              >
                <option selected disabled value="" className="text-secondary">
                  Previous:{" "}
                  {freeLancer.currency && freeLancer.currency.currencyname}
                </option>
                {currencies.map((currency) => (
                  <option value={currency._id} key={currency._id}>
                    {currency.currencyname}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* /////////////////////// */}
        <div className="flex space-x-2 justify-end mt-4">
          {!editFull && (
            <button
              className="inline-flex items-center px-4 py-2 bg-blue-700 text-white font-bold rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setEditFull(!editFull)}
            >
              Edit
            </button>
          )}
          {editFull && (
            <>
              <button
                disabled={
                  !fullNameState.isvalid ||
                  !numberState.isvalid ||
                  !emailState.isvalid ||
                  !country ||
                  !currency ||
                  !userSpeciality
                }
                className="inline-flex items-center px-4 py-2 bg-green-700 text-white font-bold rounded-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={editFreeLancerHandler}
              >
                Submit
              </button>
              <button
                className="inline-flex items-center px-4 py-2 bg-red-700 text-white font-bold rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={() => setEditFull(!editFull)}
              >
                <ImCancelCircle className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 rounded-lg bg-white shadow-md">
        {/* Tasks Count */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h6 className="text-gray-600 text-sm mb-2 font-medium">
            Tasks Count
          </h6>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaTasks className="w-6 h-6 text-yellow-400" />
              <h4 className="text-xl font-semibold ml-2 mt-1.5">
                {freeLancer.tasksCount}
              </h4>
            </div>
            <div className="text-sm text-gray-500">View Details</div>
          </div>
        </div>

        {/* Completed Count */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h6 className="text-gray-600 text-sm mb-2 font-medium">
            Completed Count
          </h6>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AiOutlineFileDone className="w-6 h-6 text-blue-400" />
              <h4 className="text-xl font-semibold ml-2 mt-1.5">
                {freeLancer.completedCount}
              </h4>
            </div>
            <div className="text-sm text-gray-500">View Details</div>
          </div>
        </div>

        {/* FreeLancer Cost */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h6 className="text-gray-600 text-sm mb-2 font-medium">
            FreeLancer Cost
          </h6>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaCoins className="w-6 h-6 text-green-400" />
              <h4 className="text-xl font-semibold ml-2 mt-1.5">
                {freeLancer.totalGain}
              </h4>
            </div>
            <div className="text-sm text-gray-500">View Details</div>
          </div>
        </div>

        {/* Total Profit */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h6 className="text-gray-600 text-sm mb-2 font-medium">
            Total Profit
          </h6>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <GiProfit className="w-6 h-6 text-red-400" />
              <h4 className="text-xl font-semibold ml-2 mt-1.5">
                {freeLancer.totalProfit}
              </h4>
            </div>
            <div className="text-sm text-gray-500">View Details</div>
          </div>
        </div>

        {/* Account Details */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h6 className="text-gray-600 text-sm mb-2 font-medium">
            Account Details
          </h6>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaCcVisa className="w-6 h-6 text-red-400" />
              {freeLancerAccount &&
                freeLancerAccount.map((acc) => (
                  <div key={acc._id} className="ml-4">
                    <a
                      href={`/account/${acc._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Click Here
                    </a>
                  </div>
                ))}
            </div>
            <div className="text-sm text-gray-500">Manage Accounts</div>
          </div>
        </div>
      </div>

      {/* /////////////////////////////////////////////////// */}
      <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold text-gray-900">Filter</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              <FiFilter className="w-4 h-4 mr-2 text-gray-400" /> From:
            </label>
            <input
              type="date"
              id="startDate"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={(e) => {
                setStart(e.target.value);
                setDateFilterData(true);
                setwithoutFilterData(false);
              }}
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              <FiFilter className="w-4 h-4 mr-2 text-gray-400" /> To:
            </label>
            <input
              type="date"
              id="endDate"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={(e) => {
                setEnd(e.target.value);
                setDateFilterData(true);
                setwithoutFilterData(false);
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 py-4">
        {withoutFilterData && freeLancerTasks?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {freeLancerTasks.map((task) => (
              <div key={task._id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center justify-center mb-4">
                  <span
                    className={`rounded-full px-4 py-2 text-sm font-medium ${
                      task.taskStatus.statusname === "pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : task.taskStatus.statusname === "waiting offer"
                        ? "bg-blue-200 text-blue-800"
                        : task.taskStatus.statusname === "approved"
                        ? "bg-green-200 text-green-800"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {task.taskStatus.statusname}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col mx-auto">
                    <span className="text-xl font-medium">
                      {task.serialNumber}
                    </span>
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      onClick={() => navigate(`/task/${task._id}`)}
                    >
                      Details
                    </button>
                  </div>
                </div>
                <p className="text-lg font-semibold mb-2">
                  Title: {task.title}
                </p>
                <p className="mb-2">
                  Speciality: {task.speciality.sub_speciality}
                </p>
                <p className="mb-2">Client: {task.client.clientname}</p>
                <p className="mb-2">Created By: {task.created_by?.fullname}</p>
                {task.freelancer && (
                  <p className="mb-2">
                    Freelancer: {task.freelancer.freelancername}
                  </p>
                )}
                <p className="mb-2">Deadline: {task.deadline.split("T")[0]}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700">
              No tasks found.
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreeLancerDetails;
