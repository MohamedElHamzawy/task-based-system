import React, { useEffect, useReducer, useState } from "react";
import {
  validate,
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
} from "../../../../util/validators";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";

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

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [withoutFilterData, setwithoutFilterData] = useState(true);
  const [dateFilterData, setDateFilterData] = useState(false);
  const DateFilter = getDateFilter(start, end, clientTasks);

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
        <div className="">Filter</div>
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
              <FaCoins className="bg-red-100 text-green-500 w-10 h-10 p-2 rounded" />
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
                        <a href={`/account/${acc._id}`} className="">
                          Click Here
                        </a>
                      </div>
                    ))}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row p-0 m-0 justify-content-center adduser-form">
        <div className="col-12 col-md-9 text-secondary row p-2">
          <h3
            htmlFor="Speciality"
            className="my-2 col-12 text-center text-dark fw-bold"
          >
            Filter:
          </h3>
          <label
            htmlFor="Speciality"
            className="mt-2 col-4 col-sm-2 text-start"
          >
            <FiFilter className="" /> From:
          </label>
          <input
            type="date"
            className="search col-8 col-sm-4  p-2 mt-1"
            onChange={(e) => {
              setStart(e.target.value);
              setDateFilterData(true);
              setwithoutFilterData(false);
            }}
          />
          <label
            htmlFor="Speciality"
            className="mt-2 col-4 col-sm-2 text-start"
          >
            <FiFilter className="" />
            To:
          </label>
          <input
            type="date"
            className="search col-8 col-sm-4  p-2 mt-1"
            onChange={(e) => {
              setEnd(e.target.value);
              setDateFilterData(true);
              setwithoutFilterData(false);
            }}
          />
        </div>
      </div>

      <div className="row analysis-tasks adduser-form p-1 py-3 m-1 justify-content-center">
        {withoutFilterData ? (
          clientTasks && !clientTasks.length == 0 ? (
            clientTasks.map((task) => (
              <div
                key={task._id}
                className="task-card bg-white p-2 py-3 row users-data col-11 my-1 text-start"
              >
                <div className="col-12 fw-bold row text-center">
                  <span
                    className={
                      task.taskStatus.statusname == "pending"
                        ? "bg-warning p-3 status col-12 "
                        : task.taskStatus.statusname == "waiting offer"
                        ? "waiting-offer   p-3 status col-12 "
                        : task.taskStatus.statusname == "approved"
                        ? "bg-info   p-3 status col-12 "
                        : task.taskStatus.statusname == "working on"
                        ? "bg-primary   p-3 status col-12 "
                        : task.taskStatus.statusname == "done"
                        ? "bg-success  p-3 status col-12 "
                        : task.taskStatus.statusname == "delivered"
                        ? "bg-secondary  p-3 status col-12"
                        : task.taskStatus.statusname == "rejected"
                        ? "bg-danger   p-3 status col-12 "
                        : task.taskStatus.statusname == "not available"
                        ? "bg-dark   p-3 status col-12 "
                        : task.taskStatus.statusname == "on going"
                        ? "on-going  p-3 status col-12 "
                        : task.taskStatus.statusname == "offer submitted"
                        ? " offer-submitted   p-3 status col-12 "
                        : task.taskStatus.statusname == "edit"
                        ? "edit   p-3 status col-12 "
                        : task.taskStatus.statusname == "cancel"
                        ? "cancel   p-3 status col-12 "
                        : "anystatus  p-3 status col-12 "
                    }
                  >
                    {task.taskStatus.statusname}
                  </span>
                </div>

                <div className="col-12 row text-center justify-content-end my-2">
                  <div className="fw-bold col-5 col-sm-7 col-md-8 col-lg-10 text-center row p-0 m-0">
                    <span className="col-11 col-sm-7 col-md-4 col-lg-2 serial-number p-3">
                      {task.serialNumber}
                    </span>
                  </div>
                  <button
                    className="details-btn p-3 fw-bold col-7 col-sm-5 col-md-4 col-lg-2"
                    onClick={() => {
                      window.location.href = `/task/${task._id}`;
                    }}
                  >
                    <BsFillFolderSymlinkFill className="fs-4" /> Details
                  </button>
                </div>

                <p className="col-12 col-sm-6 edit-form-p  fw-bold">
                  <span className="edit-form-lable">Title :</span> {task.title}
                </p>
                <p className="col-12 col-sm-6 edit-form-p  fw-bold">
                  <span className="edit-form-lable">Speciality :</span>
                  {task.speciality.sub_speciality}
                </p>
                <p className="col-12 col-sm-6 edit-form-p fw-bold">
                  <span className="edit-form-lable">Client :</span>
                  {task.client.clientname}
                </p>
                <p className="col-12 col-sm-6 edit-form-p fw-bold">
                  <span className="edit-form-lable">Created By :</span>
                  {task.created_by && task.created_by.fullname}
                </p>
                <p className="col-12 col-sm-6 edit-form-p  fw-bold">
                  <span className="edit-form-lable">Deadline :</span>
                  {task.deadline.split("T")[0]}
                </p>
                {task.freelancer && (
                  <p className="col-12 col-sm-6 edit-form-p  fw-bold">
                    <span className="edit-form-lable">Freelancer :</span>
                    {task.freelancer.freelancername}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="row col-12  p-2 text-center">
              <h3 className=" text-danger edit-form-lable">
                This User Didn't Do Any Tasks Yet
              </h3>
            </div>
          )
        ) : (
          ""
        )}
        {dateFilterData ? (
          !DateFilter.length == 0 ? (
            DateFilter.map((task) => (
              <div
                key={task._id}
                className="task-card bg-white p-2 py-3 row users-data col-11 my-1 text-start"
              >
                <div className="col-12 fw-bold row text-center">
                  <span
                    className={
                      task.taskStatus.statusname == "pending"
                        ? "bg-warning p-3 status col-12 "
                        : task.taskStatus.statusname == "waiting offer"
                        ? "waiting-offer   p-3 status col-12 "
                        : task.taskStatus.statusname == "approved"
                        ? "bg-info   p-3 status col-12 "
                        : task.taskStatus.statusname == "working on"
                        ? "bg-primary   p-3 status col-12 "
                        : task.taskStatus.statusname == "done"
                        ? "bg-success  p-3 status col-12 "
                        : task.taskStatus.statusname == "delivered"
                        ? "bg-secondary  p-3 status col-12"
                        : task.taskStatus.statusname == "rejected"
                        ? "bg-danger   p-3 status col-12 "
                        : task.taskStatus.statusname == "not available"
                        ? "bg-dark   p-3 status col-12 "
                        : task.taskStatus.statusname == "on going"
                        ? "on-going  p-3 status col-12 "
                        : task.taskStatus.statusname == "offer submitted"
                        ? " offer-submitted   p-3 status col-12 "
                        : task.taskStatus.statusname == "edit"
                        ? "edit   p-3 status col-12 "
                        : task.taskStatus.statusname == "cancel"
                        ? "cancel   p-3 status col-12 "
                        : "anystatus  p-3 status col-12 "
                    }
                  >
                    {task.taskStatus.statusname}
                  </span>
                </div>

                <div className="col-12 row text-center justify-content-end my-2">
                  <div className="fw-bold col-5 col-sm-7 col-md-8 col-lg-10 text-center row p-0 m-0">
                    <span className="col-11 col-sm-7 col-md-4 col-lg-2 serial-number p-3">
                      {task.serialNumber}
                    </span>
                  </div>
                  <button
                    className="details-btn p-3 fw-bold col-7 col-sm-5 col-md-4 col-lg-2"
                    onClick={() => {
                      window.location.href = `/task/${task._id}`;
                    }}
                  >
                    <BsFillFolderSymlinkFill className="fs-4" /> Details
                  </button>
                </div>
                <p className="col-12 col-sm-6 edit-form-p  fw-bold">
                  <span className="edit-form-lable">Title :</span> {task.title}
                </p>
                <p className="col-12 col-sm-6 edit-form-p  fw-bold">
                  <span className="edit-form-lable">Speciality :</span>
                  {task.speciality.sub_speciality}
                </p>
                <p className="col-12 col-sm-6 edit-form-p fw-bold">
                  <span className="edit-form-lable">Client :</span>
                  {task.client.clientname}
                </p>
                <p className="col-12 col-sm-6 edit-form-p  fw-bold">
                  <span className="edit-form-lable">Created By :</span>
                  {task.created_by && task.created_by.fullname}
                </p>
                <p className="col-12 col-sm-6 edit-form-p  fw-bold">
                  <span className="edit-form-lable">Deadline :</span>
                  {task.deadline.split("T")[0]}
                </p>
                {task.freelancer && (
                  <p className="col-12 col-sm-6 edit-form-p fw-bold">
                    <span className="edit-form-lable">Freelancer :</span>
                    {task.freelancer.freelancername}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="row col-12  p-2 text-center">
              <h3 className=" text-danger edit-form-lable">
                No Tasks With This Date
              </h3>
            </div>
          )
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ClientDetails;
