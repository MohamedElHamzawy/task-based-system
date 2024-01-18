import React, { useEffect, useReducer, useState } from "react";
import {
  validate,
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
} from "../../../../util/validators";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";

import { Link, useNavigate, useParams } from "react-router-dom";
import { RiDeleteBinFill } from "react-icons/ri";
import { FaTasks } from "react-icons/fa";
import { FaCoins } from "react-icons/fa";
import { FaCcVisa } from "react-icons/fa";
import { BsFillFolderSymlinkFill } from "react-icons/bs";
import { AiOutlineFileDone } from "react-icons/ai";
import { GiProfit } from "react-icons/gi";
import { FiFilter } from "react-icons/fi";
import DateFilterComponent from "../../../DateFilter";

// Date filter
const getDateFilter = (start, end, tasks) => {
  console.log(tasks);
  if (!start || !end) {
    return tasks;
  }
  return tasks.filter(
    (task) =>
      start <= new Date(task.deadline.split("T")[0]) &&
      new Date(task.deadline.split("T")[0]) <= end
  );
};

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

const ClientDetails = () => {
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  let { id } = useParams();

  const [client, setClient] = useState([]);
  const [countries, setCountries] = useState([]);
  const [clientAccount, setClientAccount] = useState();
  const [clientTasks, setClientTasks] = useState([]);
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URL}:5000/api/client/${id}`)
          .then((res) => {
            setClient(res.data.client);
            setClientTasks(res.data.clientTasks);
            setClientAccount(res.data.clientAccount);
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

  //currency value
  const [currency, setCurrency] = useState(
    client.currency && client.currency.currencyname
  );

  //clientName validation
  const [clientNameState, dispatch] = useReducer(clientNameReducer, {
    value: client.clientname,
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
    value: client.ownerName,
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
    value: client.website,
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

  //country value
  const [country, setCountry] = useState("");
  const countryChangeHandler = (newOne) => {
    setCountry(newOne);
  };

  //Number validation
  const [numberState, dispatch5] = useReducer(numberReducer, {
    value: client.phone,
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
  //////////////////////////////////////
  const editClientHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/client/${client._id}`,
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
      setError(err.message && "SomeThing Went Wrong , Please Try Again .");
    }
  };

  //delete client
  const deleteClientHandler = async () => {
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/client/${id}`
        //  ,
        //  { headers :{
        //     'Authorization':`Bearer ${token}`
        //   }
        // }
      );
      const responseData = await response;
      setError(responseData.data.message);
      setIsLoading(false);
      window.location.href = "/clients";
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

  const navigate = useNavigate();

  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [withoutFilterData, setwithoutFilterData] = useState(true);
  const [dateFilterData, setDateFilterData] = useState(false);
  const DateFilter = getDateFilter(start, end, clientTasks);

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
          onClick={() => navigate("/clients")}
        >
          <TiArrowBack />
        </button> */}
        <h2 className="text-center text-2xl font-bold lg:text-3xl">
          Client Details
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
          onClick={deleteClientHandler}
        >
          <RiDeleteBinFill className="text-gray-400 w-10 h-10" />
        </button>

        <div className="w-1/2 grid grid-cols-2 gap-4">
          <div className="flex flex-col w-full">
            <label className="w-full font-bold">Client Name</label>
            <p className={!edit ? "ml-2 text-gray-500 font-medium" : "hidden"}>
              {client.clientname}
            </p>
            {edit && (
              <input
                type="text"
                placeholder={client.clientname}
                value={clientNameState.value}
                onChange={clientNameChangeHandler}
                onBlur={clientNameTouchHandler}
                isvalid={clientNameState.isvalid.toString()}
                className={`w-11/12 ml-2 rounded-sm p-2 ${
                  !clientNameState.isvalid &&
                  clientNameState.isTouched &&
                  "border-red-500"
                }`}
              />
            )}
          </div>
          <div className="flex flex-col w-full">
            <label className="w-full font-bold">Owner</label>
            <p className={!edit ? "ml-2 text-gray-500 font-medium" : "hidden"}>
              {client.ownerName}
            </p>
            {edit && (
              <input
                type="text"
                placeholder={client.ownerName}
                value={ownerState.value}
                onChange={ownerChangeHandler}
                onBlur={ownerTouchHandler}
                isvalid={ownerState.isvalid.toString()}
                className={`w-11/12 ml-2 rounded-sm p-2 ${
                  !ownerState.isvalid &&
                  ownerState.isTouched &&
                  "border-red-500"
                }`}
              />
            )}
          </div>
          <div className="flex flex-col w-full">
            <label className="w-full font-bold">Website</label>
            <p className={!edit ? "ml-2 text-gray-500 font-medium" : "hidden"}>
              {client.website}
            </p>
            {edit && (
              <input
                type="text"
                placeholder={client.website}
                value={clientEmailState.value}
                onChange={clientEmailChangeHandler}
                onBlur={clientEmailTouchHandler}
                isvalid={clientEmailState.isvalid.toString()}
                className={`w-11/12 ml-2 rounded-sm p-2 ${
                  !clientEmailState.isvalid &&
                  clientEmailState.isTouched &&
                  "border-red-500"
                }`}
              />
            )}
          </div>
          <div className="flex flex-col w-full">
            <label className="w-full font-bold">Phone</label>
            <p className={!edit ? "ml-2 text-gray-500 font-medium" : "hidden"}>
              {client.phone}
            </p>
            {edit && (
              <input
                type="text"
                placeholder={client.phone}
                value={numberState.value}
                onChange={numberChangeHandler}
                onBlur={numbertouchHandler}
                isvalid={numberState.isvalid.toString()}
                className={`w-11/12 ml-2 rounded-sm p-2 ${
                  !numberState.isvalid &&
                  numberState.isTouched &&
                  "border-red-500"
                }`}
              />
            )}
          </div>
          <div className="flex flex-col w-full">
            <label className="w-full font-bold">Country</label>
            <p className={!edit ? "ml-2 text-gray-500 font-medium" : "hidden"}>
              {client.country && client.country.countryName}
            </p>
            {edit && (
              <select
                id="country"
                name="country"
                className="w-11/12 ml-2 rounded-sm p-2"
                value={country}
                onChange={(event) => countryChangeHandler(event.target.value)}
              >
                <option disabled defaultValue className="text-secondary">
                  Countries
                </option>
                {countries.map((country) => (
                  <option value={country._id} key={country._id}>
                    {country.countryName}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="flex flex-col w-full">
            <label className="w-full font-bold">Currency</label>
            <p className={!edit ? "ml-2 text-gray-500 font-medium" : "hidden"}>
              {client.currency && client.currency.currencyname}
            </p>
            {edit && (
              <select
                id="currencies"
                name="currencies"
                className="w-11/12 ml-2 rounded-sm p-2"
                value={currency}
                onChange={(event) => setCurrency(event.target.value)}
              >
                <option disabled defaultValue className="text-secondary">
                  Currencies
                </option>
                {currencies.map((currency) => (
                  <option value={currency._id} key={currency._id}>
                    {currency.currencyname}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="col-span-2 flex items-center justify-center space-x-2">
            {edit ? (
              <button
                disabled={
                  !clientEmailState.isvalid &&
                  !ownerState.isvalid &&
                  !clientNameState.isvalid &&
                  !numberState.isvalid &&
                  !country &&
                  !currency
                }
                type="button"
                className="bg-green-500 rounded-sm transition-all hover:bg-green-400 text-white px-3 py-1"
                onClick={editClientHandler}
              >
                Save
              </button>
            ) : (
              <button
                type="button"
                className="bg-cyan-600 rounded-sm transition-all hover:bg-cyan-400 text-white px-12 py-1"
                onClick={() => {
                  setEdit(!edit);
                }}
              >
                Edit
              </button>
            )}
            {edit && (
              <button
                type="button"
                className="bg-red-500 rounded-sm transition-all hover:bg-red-400 text-white px-3 py-1"
                onClick={() => {
                  setEdit(!edit);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="w-1/2">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded drop-shadow flex items-center space-x-2 px-4 py-2.5">
              <FaTasks className="bg-blue-100 text-blue-500 w-10 h-10 p-2 rounded" />
              <div>
                <h6 className="m-0 p-0 text-sm font-semibold">Tasks Count</h6>
                <h4 className="font-light ml-1 my-0 p-0">
                  {client.tasksCount}
                </h4>
              </div>
            </div>
            <div className="bg-white rounded drop-shadow flex items-center space-x-2 px-4 py-2.5">
              <AiOutlineFileDone className="bg-orange-100 text-orange-500 w-10 h-10 p-2 rounded" />
              <div>
                <h6 className="m-0 p-0 text-sm font-semibold">
                  Completed Count
                </h6>
                <h4 className="font-light ml-1 my-0 p-0">
                  {client.completedCount}
                </h4>
              </div>
            </div>
            <div className="bg-white rounded drop-shadow flex items-center space-x-2 px-4 py-2.5">
              <FaCoins className="bg-green-100 text-green-500 w-10 h-10 p-2 rounded" />
              <div>
                <h6 className="m-0 p-0 text-sm font-semibold">Client Gain</h6>
                <h4 className="font-light ml-1 my-0 p-0">{client.totalGain}</h4>
              </div>
            </div>
            <div className="bg-white rounded drop-shadow flex items-center space-x-2 px-4 py-2.5">
              <GiProfit className="bg-green-100 text-green-500 w-10 h-10 p-2 rounded" />
              <div>
                <h6 className="m-0 p-0 text-sm font-semibold">Total Profit</h6>
                <h4 className="font-light ml-1 my-0 p-0">
                  {client.totalProfit}
                </h4>
              </div>
            </div>
            <div className="col-span-2 w-1/2 bg-white rounded drop-shadow flex items-center space-x-2 px-4 py-2 mx-auto">
              <FaCcVisa className="bg-purple-100 text-purple-500 w-10 h-10 p-2 rounded" />
              <div>
                <h6 className="m-0 p-0 text-sm font-semibold">
                  Account Details
                </h6>
                <h4 className="font-light ml-1 my-0 p-0">
                  {clientAccount &&
                    clientAccount.map((acc) => (
                      <div className="text-base" key={acc._id}>
                        <Link to={`/account/${acc._id}`} className="">
                          Click Here
                        </Link>
                      </div>
                    ))}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-3 drop-shadow">
        {withoutFilterData &&
          (clientTasks && !clientTasks.length == 0 ? (
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
                {clientTasks.map((task, index) => (
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
            <div class="container mx-auto p-4">
              <h3 class="text-lg font-medium text-center text-red-500">
                This User Didn't Do Any Tasks Yet
              </h3>
            </div>
          ))}

        {dateFilterData &&
          (!DateFilter.length == 0 ? (
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
            <div class="container mx-auto p-4">
              <h3 class="text-lg font-medium text-center text-red-500">
                This User Didn't Do Any Tasks Yet
              </h3>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ClientDetails;
