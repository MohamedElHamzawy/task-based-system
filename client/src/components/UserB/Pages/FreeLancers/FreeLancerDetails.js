import React, { useEffect, useReducer, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";
import {
  validate,
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
} from "../../../../util/validators";

import { Link, useNavigate, useParams } from "react-router-dom";
import { RiDeleteBinFill } from "react-icons/ri";
import { FaTasks } from "react-icons/fa";
import { FaCoins } from "react-icons/fa";
import { FaCcVisa } from "react-icons/fa";
import { AiOutlineFileDone } from "react-icons/ai";
import { GiProfit } from "react-icons/gi";
import { FiFilter } from "react-icons/fi";
import DateFilterComponent from "../../../DateFilter";

// Date filter

const getDateFilter = (start, end, tasks) => {
  if (!start || !end) {
    return tasks;
  }
  return tasks.filter(
    (task) =>
      start <= new Date(task.deadline.split("T")[0]) &&
      new Date(task.deadline.split("T")[0]) <= end
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
      setError(err.message || "SomeThing Went Wrong , Please Try Again .");
    }
  };
  //error message
  const errorHandler = () => {
    setError(null);
    window.location.reload(true);
  };

  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [withoutFilterData, setwithoutFilterData] = useState(true);
  const [dateFilterData, setDateFilterData] = useState(false);
  const DateFilter = getDateFilter(start, end, freeLancerTasks);

  const onDateChange = (dates) => {
    const [start, end] = dates;
    setStart(start);
    setEnd(end);
    setDateFilterData(true);
    setwithoutFilterData(false);
  };

  function getRowClass(statusname) {
    switch (statusname) {
      case "pending":
        return "bg-yellow-100";
      case "waiting offer":
        return "bg-blue-100";
      case "approved":
        return "bg-sky-100";
      case "working on":
        return "bg-purple-100";
      case "done":
        return "bg-green-100";
      case "delivered":
        return "bg-gray-100";
      case "rejected":
        return "bg-red-100";
      case "not available":
        return "bg-slate-100";
      case "on going":
        return "bg-teal-100";
      case "offer submitted":
        return "bg-orange-100";
      case "edit":
        return "bg-indigo-100";
      case "cancel":
        return "bg-pink-100";
      default:
        return "";
    }
  }

  function getStatusClass(statusname) {
    switch (statusname) {
      case "pending":
        return "text-yellow-400";
      case "waiting offer":
        return "text-blue-500";
      case "approved":
        return "text-sky-400";
      case "working on":
        return "text-purple-400";
      case "done":
        return "text-green-400";
      case "delivered":
        return "text-gray-400";
      case "rejected":
        return "text-red-400";
      case "not available":
        return "text-slate-400";
      case "on going":
        return "text-teal-400";
      case "offer submitted":
        return "text-orange-400";
      case "edit":
        return "text-indigo-400";
      case "cancel":
        return "text-pink-400";
      default:
        return "";
    }
  }

  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="flex flex-col w-full p-3 min-h-[calc(100vh-65px)]">
      <ErrorModal error={error} onClear={errorHandler} />

      <div className="relative flex items-center justify-between w-full p-1 mb-4">
        {/* <button
          className="absolute top-0 left-0 p-2 text-3xl"
          onClick={() => navigate("/freelancers")}
        >
          <TiArrowBack />
        </button> */}
        <h2 className="text-center text-2xl font-bold lg:text-3xl">
          Freelancer Details
        </h2>
        <div>
          <DateFilterComponent
            startDate={start}
            endDate={end}
            onChange={onDateChange}
          />
        </div>
      </div>

      <div className="relative flex items-center justify-betwen border-2 space-x-8 rounded-md shadow pr-4 py-4 bg-[#F4F7FC]">
        <button
          className="absolute top-2 right-1.5 w-10 h-10"
          onClick={deleteFreeLancerHandler}
        >
          <RiDeleteBinFill className="text-gray-400 w-10 h-10" />
        </button>

        <div className="w-1/2 grid grid-cols-2 gap-4">
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

          <div className="col-span-2 flex items-center justify-center space-x-2">
            {!editFull && (
              <button
                className="bg-cyan-600 rounded-sm transition-all hover:bg-cyan-400 text-white px-12 py-1"
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
                  className="bg-green-500 rounded-sm transition-all hover:bg-green-400 text-white px-3 py-1"
                  onClick={editFreeLancerHandler}
                >
                  Save
                </button>
                <button
                  className="bg-red-500 rounded-sm transition-all hover:bg-red-400 text-white px-3 py-1"
                  onClick={() => setEditFull(!editFull)}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
        <div className="w-1/2">
          <div className="grid grid-cols-2 gap-2">
            {/* Tasks Count */}
            <div className="bg-white rounded drop-shadow flex items-center space-x-2 px-4 py-2.5">
              <FaTasks className="bg-blue-100 text-blue-500 w-10 h-10 p-2 rounded" />
              <div>
                <h6 className="m-0 p-0 text-sm font-semibold">Tasks Count</h6>
                <h4 className="font-light ml-1 my-0 p-0">
                  {freeLancer.tasksCount}
                </h4>
              </div>
            </div>

            {/* Completed Count */}
            <div className="bg-white rounded drop-shadow flex items-center space-x-2 px-4 py-2.5">
              <AiOutlineFileDone className="bg-orange-100 text-orange-500 w-10 h-10 p-2 rounded" />
              <div>
                <h6 className="m-0 p-0 text-sm font-semibold">
                  Completed Count
                </h6>
                <h4 className="font-light ml-1 my-0 p-0">
                  {freeLancer.completedCount}
                </h4>
              </div>
            </div>

            {/* FreeLancer Cost */}
            <div className="bg-white rounded drop-shadow flex items-center space-x-2 px-4 py-2.5">
              <FaCoins className="bg-red-100 text-red-500 w-10 h-10 p-2 rounded" />
              <div>
                <h6 className="m-0 p-0 text-sm font-semibold">
                  FreeLancer Cost
                </h6>
                <h4 className="font-light ml-1 my-0 p-0">
                  {freeLancer.totalGain}
                </h4>
              </div>
            </div>

            {/* Total Profit */}
            <div className="bg-white rounded drop-shadow flex items-center space-x-2 px-4 py-2.5">
              <GiProfit className="bg-green-100 text-green-500 w-10 h-10 p-2 rounded" />
              <div>
                <h6 className="m-0 p-0 text-sm font-semibold">Total Profit</h6>
                <h4 className="font-light ml-1 my-0 p-0">
                  {freeLancer.totalProfit}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-3 drop-shadow">
        {withoutFilterData &&
          (withoutFilterData && freeLancerTasks?.length > 0 ? (
            <table className="table-auto w-full rounded-lg overflow-hidden text-center">
              <thead>
                <tr className="drop-shadow bg-white text-cyan-600">
                  <th className="px-4 py-3 font-medium text-sm">ID</th>
                  <th className="px-4 py-3 font-medium text-sm w-1/5">Title</th>
                  <th className="px-4 py-3 font-medium text-sm">Client</th>
                  <th className="px-4 py-3 font-medium text-sm">Freelancer</th>
                  <th className="px-4 py-3 font-medium text-sm">Profit</th>
                  <th className="px-4 py-3 font-medium text-sm">Deadline</th>
                  <th className="px-4 py-3 font-medium text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {freeLancerTasks.map((task, index) => (
                  <tr
                    key={task._id}
                    className={`bg-white ${
                      index !== 0 && "border-t-4 border-[#F4F7FC]"
                    }`}
                  >
                    <td
                      className="cursor-pointer hover:underline px-4 py-3"
                      onClick={() => {
                        navigate(`/task/${task._id}`);
                      }}
                    >
                      {task.serialNumber}
                    </td>
                    <td className="px-4 py-3">{task.title}</td>
                    <td className="px-4 py-3">{task.client.clientname}</td>
                    <td className="px-4 py-3">
                      {task.freelancer ? task.freelancer.freelancername : "-"}
                    </td>
                    <td className="px-4 py-3">
                      {task.profit_amount || 0}{" "}
                      {task.task_currency && task.task_currency.currencyname}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(task.deadline).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div
                        className={`w-full rounded-md px-2 py-1 text-xs font-bold ${getRowClass(
                          task.taskStatus.statusname
                        )} ${getStatusClass(task.taskStatus.statusname)}`}
                      >
                        {task.taskStatus.statusname}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="row col-12  p-2 text-center">
              <h3 className=" text-danger edit-form-lable">
                This User Didn't Do Any Tasks Yet
              </h3>
            </div>
          ))}
        {dateFilterData &&
          (DateFilter?.length > 0 ? (
            <table className="table-auto w-full rounded-lg overflow-hidden text-center">
              <thead>
                <tr className="drop-shadow bg-white text-cyan-600">
                  <th className="px-4 py-3 font-medium text-sm">ID</th>
                  <th className="px-4 py-3 font-medium text-sm w-1/5">Title</th>
                  <th className="px-4 py-3 font-medium text-sm">Client</th>
                  <th className="px-4 py-3 font-medium text-sm">Freelancer</th>
                  <th className="px-4 py-3 font-medium text-sm">Profit</th>
                  <th className="px-4 py-3 font-medium text-sm">Deadline</th>
                  <th className="px-4 py-3 font-medium text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {DateFilter.map((task, index) => (
                  <tr
                    key={task._id}
                    className={`bg-white ${
                      index !== 0 && "border-t-4 border-[#F4F7FC]"
                    }`}
                  >
                    <td
                      className="cursor-pointer hover:underline px-4 py-3"
                      onClick={() => {
                        navigate(`/task/${task._id}`);
                      }}
                    >
                      {task.serialNumber}
                    </td>
                    <td className="px-4 py-3">{task.title}</td>
                    <td className="px-4 py-3">{task.client.clientname}</td>
                    <td className="px-4 py-3">
                      {task.freelancer ? task.freelancer.freelancername : "-"}
                    </td>
                    <td className="px-4 py-3">
                      {task.profit_amount || 0}{" "}
                      {task.task_currency && task.task_currency.currencyname}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(task.deadline).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div
                        className={`w-full rounded-md px-2 py-1 text-xs font-bold ${getRowClass(
                          task.taskStatus.statusname
                        )} ${getStatusClass(task.taskStatus.statusname)}`}
                      >
                        {task.taskStatus.statusname}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="row col-12  p-2 text-center">
              <h3 className=" text-danger edit-form-lable">
                This User Didn't Do Any Tasks Yet
              </h3>
            </div>
          ))}
      </div>
    </div>
  );
};

export default FreeLancerDetails;
