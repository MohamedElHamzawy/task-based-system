import React, { useEffect, useReducer, useState } from "react";
import { validate, VALIDATOR_MINLENGTH } from "../../../../util/validators";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";
import { TiArrowBack } from "react-icons/ti";
import GetCookie from "../../../../hooks/getCookie";
import { useNavigate } from "react-router";

//Title validation
const TitleReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.title,
        isvalid: validate(action.title, action.validators),
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

//task price validation
const taskPriceReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.taskPrice,
        isvalid: validate(action.taskPrice, action.validators),
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

//Description validation
const descriptionReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.description,
        isvalid: validate(action.description, action.validators),
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

const AddTask = () => {
  const token = GetCookie("AdminToken");

  const [specialities, setSpecialities] = useState([]);
  const [clients, setClients] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

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
          .get(`${process.env.REACT_APP_BACKEND_URL}:5000/api/client/`)
          .then((res) => {
            setClients(res.data.clients);
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
          .get(
            `${process.env.REACT_APP_BACKEND_URL}:5000/api/user/customerService`
          )
          .then((res) => {
            setUsers(res.data.users);
          });
        setLoading(false);
        setIsLoading(false);
      });
      timerId = setTimeout(async () => {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URL}:5000/api/status/`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            setStatuses(res.data.statuses);
          });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  //speciality value
  const [speciality, setSpeciality] = useState("");
  const specialityChangeHandler = (newOne) => {
    setSpeciality(newOne);
  };

  //client value
  const [client, setClient] = useState("");
  const clientChangeHandler = (newOne) => {
    setClient(newOne);
  };

  //user value
  const [user, setUser] = useState("");
  const userChangeHandler = (newOne) => {
    setUser(newOne);
  };

  //currency value
  const [currency, setCurrency] = useState("");
  const currencyChangeHandler = (newOne) => {
    setCurrency(newOne);
  };

  //Channel value
  const [channel, setChannel] = useState("");
  const channelChangeHandler = (newOne) => {
    setChannel(newOne);
  };

  const [priority, setPriority] = useState("");

  //title validation
  const [titleState, dispatch] = useReducer(TitleReducer, {
    value: "",
    isvalid: false,
    isTouched: false,
  });

  const titleChangeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      title: event.target.value,
      validators: [VALIDATOR_MINLENGTH(3)],
    });
  };
  const titleTouchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  //task price validation
  const [taskPriceState, dispatch4] = useReducer(taskPriceReducer, {
    value: "",
    isvalid: false,
    isTouched: false,
  });

  const taskPriceChangeHandler = (event) => {
    dispatch4({
      type: "CHANGE",
      taskPrice: event.target.value,
      validators: [VALIDATOR_MINLENGTH(1)],
    });
  };
  const taskPriceTouchHandler = () => {
    dispatch4({
      type: "TOUCH",
    });
  };

  //Description validation
  const [descriptionState, dispatch5] = useReducer(descriptionReducer, {
    value: "",
    isvalid: false,
    isTouched: false,
  });

  const descriptionChangeHandler = (event) => {
    dispatch5({
      type: "CHANGE",
      description: event.target.value,
      validators: [VALIDATOR_MINLENGTH(3)],
    });
  };
  const descriptionTouchHandler = () => {
    dispatch5({
      type: "TOUCH",
    });
  };

  const [deadline, setDeadline] = useState();
  const [status, setStatus] = useState();

  /////////////////////////////////

  const newTaskSubmitHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/task/`,
        {
          title: titleState.value,
          channel: channel,
          description: descriptionState.value,
          client: client,
          speciality: speciality,
          deadline: deadline,
          task_currency: currency,
          paid: taskPriceState.value,
          status: status,
          shareWith: user,
          priority,
        },
        { headers: { Authorization: `Bearer ${token}` } }
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
    titleState.value = "";
    descriptionState.value = "";
    taskPriceState.value = "";
    setChannel("");
    setClient("");
    setSpeciality("");
    setDeadline();
    setCurrency("");
    setUser("");
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
          onClick={() => navigate("/tasks")}
        >
          <TiArrowBack />
        </button>
        <h2 className="text-center text-2xl font-bold lg:text-3xl">
          Add New Task
        </h2>
      </div>

      <form
        className="grid grid-cols-2 gap-4 w-4/5 mx-auto"
        onSubmit={newTaskSubmitHandler}
      >
        <div className="flex flex-col w-full">
          <label className="w-full lg:w-1/5 font-bold">Channel</label>
          <select
            id="Channel"
            name="Channel"
            className="w-full ml-2 rounded-sm lg:w-4/5 p-2"
            value={channel}
            onChange={(event) => channelChangeHandler(event.target.value)}
          >
            <option defaultValue disabled className="text-secondary">
              Channels
            </option>
            <option value="Telegram">Telegram</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Website">Website</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="flex flex-col w-full">
          <label className="w-full lg:w-1/5 font-bold">Clients</label>
          <select
            id="clients"
            name="clients"
            className="w-full ml-2 rounded-sm lg:w-4/5 p-2"
            value={client}
            onChange={(event) => clientChangeHandler(event.target.value)}
          >
            <option value="" className="text-secondary">
              clients
            </option>
            {clients.map((client) => (
              <option value={client._id} key={client._id}>
                {client.clientname}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col w-full">
          <label className="w-full lg:w-1/5 font-bold">Speciality</label>

          <select
            id="speciality"
            name="speciality"
            className="w-full ml-2 rounded-sm lg:w-4/5 p-2"
            value={speciality}
            onChange={(event) => specialityChangeHandler(event.target.value)}
          >
            <option value="" className="text-secondary">
              Specialities
            </option>
            {specialities.map((speciality) => (
              <option value={speciality._id} key={speciality._id}>
                {speciality.sub_speciality}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col w-full">
          <label className="w-full lg:w-1/5 font-bold">DeadLine</label>
          <input
            type="datetime-local"
            id="meeting-time"
            name="meeting-time"
            placeholder="DeadLine"
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full ml-2 rounded-sm lg:w-4/5 p-2"
          />
        </div>

        <div className="flex flex-col w-full">
          <label className="w-full lg:w-1/5 font-bold">Status</label>
          <select
            id="status"
            name="status"
            className="w-full ml-2 rounded-sm lg:w-4/5 p-2"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="" className="text-secondary">
              Status
            </option>
            {statuses.map(
              (status) =>
                status.statusname == "approved" ||
                (status.statusname == "waiting offer" && (
                  <option value={status._id} key={status._id}>
                    {status.statusname}
                  </option>
                ))
            )}
          </select>
        </div>

        <div className="flex flex-col w-full">
          <label className="w-full lg:w-1/5 font-bold">Task Price</label>
          <input
            type="number"
            placeholder="Task Price "
            value={taskPriceState.value}
            onChange={taskPriceChangeHandler}
            onBlur={taskPriceTouchHandler}
            isvalid={taskPriceState.isvalid.toString()}
            className={`w-full ml-2 rounded-sm lg:w-4/5 p-2${
              !taskPriceState.isvalid &&
              taskPriceState.isTouched &&
              "border-red-500"
            }`}
          />
        </div>

        <div className="flex flex-col w-full">
          <label className="w-full lg:w-1/5 font-bold">Title</label>
          <input
            type="text"
            placeholder="Title"
            value={titleState.value}
            onChange={titleChangeHandler}
            onBlur={titleTouchHandler}
            isvalid={titleState.isvalid.toString()}
            className={`w-full ml-2 rounded-sm lg:w-4/5 p-2${
              !titleState.isvalid && titleState.isTouched && "border-red-500"
            }`}
          />
        </div>

        <div className="flex flex-col w-full">
          <label className="w-full lg:w-1/5 font-bold">Currency</label>

          <select
            id="currencies"
            name="currencies"
            className="w-full ml-2 rounded-sm lg:w-4/5 p-2"
            value={currency}
            onChange={(event) => currencyChangeHandler(event.target.value)}
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

        <div className="flex flex-col w-full">
          <label className="w-full lg:w-1/5 font-bold">Share With</label>

          <select
            id="user"
            name="user"
            className="w-full ml-2 rounded-sm lg:w-4/5 p-2"
            value={user}
            onChange={(event) => userChangeHandler(event.target.value)}
          >
            <option value="" className="text-secondary">
              CustomerService
            </option>
            {users.map((user) => (
              <option value={user._id} key={user._id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col w-full">
          <label className="w-full lg:w-1/5 font-bold">Priority</label>
          <select
            id="priority"
            name="priority"
            className="w-full ml-2 rounded-sm lg:w-4/5 p-2"
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
          >
            <option defaultValue disabled className="text-secondary">
              Priority
            </option>
            <option value="WhatsApp">Normal</option>
            <option value="Telegram">High</option>
          </select>
        </div>

        <div className="col-span-2 flex flex-col w-full">
          <label className="w-full lg:w-1/5 font-bold">Description</label>
          <textarea
            type="text"
            placeholder="Description"
            rows="4"
            value={descriptionState.value}
            onChange={descriptionChangeHandler}
            onBlur={descriptionTouchHandler}
            isvalid={descriptionState.isvalid.toString()}
            className={`w-full ml-2 rounded-sm lg:w-[calc(100%-5.85rem)] p-2 ${
              !descriptionState.isvalid &&
              descriptionState.isTouched &&
              "border-red-500"
            }`}
          />
        </div>

        <div className="col-span-2 flex justify-center w-full">
          <button
            disabled={
              status == "64fdd400a86587827152ab3c"
                ? !channel ||
                  !titleState.isvalid ||
                  !descriptionState.isvalid ||
                  !taskPriceState.isvalid ||
                  !speciality ||
                  !client ||
                  !currency ||
                  !deadline ||
                  !status
                : !channel ||
                  !titleState.isvalid ||
                  !descriptionState.isvalid ||
                  !speciality ||
                  !client ||
                  !currency ||
                  !deadline ||
                  !status
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

export default AddTask;
