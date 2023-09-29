import React, { useEffect, useReducer, useState } from 'react'
import { validate, VALIDATOR_MINLENGTH } from "../../../../util/validators";
import axios from "axios";
import LoadingSpinner from '../../../../LoadingSpinner/LoadingSpinner';
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";
import { TiArrowBack } from 'react-icons/ti';
import GetCookie from '../../../../hooks/getCookie';

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
  const token = GetCookie("AdminToken")

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
        await axios.get("https://smarteduservices.com:5000/api/speciality/").then((res) => {
          setSpecialities(res.data.specialities);
        });
        setLoading(false);
        setIsLoading(false);
      });
      timerId = setTimeout(async () => {
        await axios.get("https://smarteduservices.com:5000/api/client/").then((res) => {
          setClients(res.data.clients);
        });
        setLoading(false);
        setIsLoading(false);
      });
      timerId = setTimeout(async () => {
        await axios.get("https://smarteduservices.com:5000/api/currency/").then((res) => {
          setCurrencies(res.data.currencies);
        });
        setLoading(false);
        setIsLoading(false);
      });
      timerId = setTimeout(async () => {
        await axios.get("https://smarteduservices.com:5000/api/user/customerService").then((res) => {
          setUsers(res.data.users);
          console.log(res.data)
        });
        setLoading(false);
        setIsLoading(false);
      });
      timerId = setTimeout(async () => {
        await axios.get("https://smarteduservices.com:5000/api/status/", { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
          setStatuses(res.data.statuses);
        });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  //speciality value
  const [speciality, setSpeciality] = useState('');
  const specialityChangeHandler = (newOne) => {
    setSpeciality(newOne);
  };

  //client value
  const [client, setClient] = useState('');
  const clientChangeHandler = (newOne) => {
    setClient(newOne);
  };

  //user value
  const [user, setUser] = useState('');
  const userChangeHandler = (newOne) => {
    setUser(newOne);
  };

  //currency value
  const [currency, setCurrency] = useState('');
  const currencyChangeHandler = (newOne) => {
    setCurrency(newOne);
  };

  //Channel value
  const [channel, setChannel] = useState('');
  const channelChangeHandler = (newOne) => {
    setChannel(newOne);
  };

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
      validators: [VALIDATOR_MINLENGTH(3)],
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


  const [deadline, setDeadline] = useState()
  const [status, setStatus] = useState()

  /////////////////////////////////

  const newTaskSubmitHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        "https://smarteduservices.com:5000/api/task/",
        {
          title: titleState.value,
          channel: channel,
          description: descriptionState.value,
          client: client,
          speciality: speciality,
          deadline: deadline,
          task_currency: currency,
          paid: taskPriceState.value,
          status: status ,
          shareWith : user
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const responseData = await response;
      console.log(responseData)
      if (!(response.statusText === "OK")) {
        throw new Error(responseData.data.message);
      }
      setError(responseData.data.message);
      setIsLoading(false);

    } catch (err) {
      setIsLoading(false);
      setError(err.message || "SomeThing Went Wrong , Please Try Again .");
    }
    titleState.value = ''
    descriptionState.value = ''
    taskPriceState.value = ''
    setChannel('')
    setClient('')
    setSpeciality('')
    setDeadline()
    setCurrency('')
    setUser('')
  };

  const errorHandler = () => {
    setError(null);
  };
  return (
    <div className='row text-center p-3 w-100 m-0'>
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && <LoadingSpinner asOverlay />}

      <div className="row p-1">
        <div className="col-3 text-center">
          <button className="back-btn p-2 px-3 fs-3 " onClick={() => { window.location.href = '/tasks' }}><TiArrowBack /> </button>
        </div>
        <h2 className="col-12 col-lg-7 text-center system-head p-3  fw-bold">  Add New Task</h2>
      </div>

      <form className='adduser-form bg-white p-3 row justify-content-center m-0' onSubmit={newTaskSubmitHandler}>

        <div className='col-12 col-lg-5 m-1 py-2 p-0'>
          <label className='col-10 col-lg-5 fw-bold add-user-p py-2'>Channel :</label>
          <select id="Channel" name="Channel" className="p-2 px-4 search col-10 col-lg-7" value={channel}
            onChange={(event) => channelChangeHandler(event.target.value)}>
            <option value="" className='text-secondary'>clients</option>
            <option value="Telegram" className=''>Telegram</option>
            <option value="WhatsApp" className=''>WhatsApp</option>
            <option value="Website" className=''>Website</option>
            <option value="Other" className=''>Other</option>
          </select>
        </div>

        <div className='d-block col-12 col-lg-5 m-1 py-2 p-0'>
          <label htmlFor="client" className="col-10 col-lg-5 fw-bold add-user-p py-2"> Clients:</label>

          <select id="clients" name="clients" className="p-2 px-4 search col-10 col-lg-7" value={client}
            onChange={(event) => clientChangeHandler(event.target.value)}>
            <option value="" className='text-secondary'>clients</option>
            {clients.map((client) => (
              <option value={client._id} key={client._id}>{client.clientname}</option>
            ))}
          </select>

        </div>

        <div className='d-block col-12 col-lg-5 m-1 py-2 p-0'>
          <label htmlFor="speciality" className="col-10 col-lg-5 fw-bold add-user-p py-2"> Speciality:</label>

          <select id="speciality" name="speciality" className="p-2 px-4 search col-10 col-lg-7" value={speciality}
            onChange={(event) => specialityChangeHandler(event.target.value)}>
            <option value="" className='text-secondary'>Specialities</option>
            {specialities.map((speciality) => (
              <option value={speciality._id} key={speciality._id}>{speciality.sub_speciality}</option>
            ))}
          </select>

        </div>

        <div className='col-12 col-lg-5 m-1 py-2 p-0'>
          <label className='col-10 col-lg-5 fw-bold add-user-p py-2'>DeadLine :</label>
          <input type="datetime-local"
            id="meeting-time"
            name="meeting-time"
            placeholder='DeadLine'
            onChange={(e) => (setDeadline(e.target.value))}
            className='col-10 col-lg-7 search p-2 '
          />
        </div>


        <div className='col-12 col-lg-5 m-1 py-2 p-0'>
          <label className='col-10 col-lg-5 fw-bold add-user-p'>Status :</label>
          <select id="status" name="status" className="p-2 px-4 search col-10 col-lg-7" value={status}
            onChange={(event) => setStatus(event.target.value)}>
            <option value="" className='text-secondary'>Status</option>
            {statuses.map((status) => (
              status.statusname == "approved" || status.statusname == "waiting offer" ?
                <option value={status._id} key={status._id}>{status.statusname}</option>
                : ''
            ))}
          </select>
        </div>


        <div className='col-12 col-lg-5 m-1 py-2 p-0'>
          <label className='col-10 col-lg-5 fw-bold add-user-p py-2'>Task Price :</label>
          <input type='number' placeholder='Task Price '
            value={taskPriceState.value}
            onChange={taskPriceChangeHandler}
            onBlur={taskPriceTouchHandler}
            isvalid={taskPriceState.isvalid.toString()}
            className={`col-10 col-lg-7 search p-2 ${!taskPriceState.isvalid &&
              taskPriceState.isTouched &&
              "form-control-invalid"
              }`}
          />
        </div>

        <div className='col-12 col-lg-5 m-1 py-2 p-0'>
          <label className='col-10 col-lg-5 fw-bold add-user-p py-2'>Title :</label>
          <input type='text' placeholder='Title '
            value={titleState.value}
            onChange={titleChangeHandler}
            onBlur={titleTouchHandler}
            isvalid={titleState.isvalid.toString()}
            className={`col-10 col-lg-7 search p-2 ${!titleState.isvalid &&
              titleState.isTouched &&
              "form-control-invalid"
              }`}
          />
        </div>

        <div className='d-block col-12 col-lg-5 m-1 py-2 p-0'>
          <label htmlFor="currency" className="col-10 col-lg-5 fw-bold add-user-p py-2"> Currency:</label>

          <select id="currencies" name="currencies" className="p-2 px-4 search col-10 col-lg-7" value={currency}
            onChange={(event) => currencyChangeHandler(event.target.value)}>
            <option value="" className='text-secondary'>currencies</option>
            {currencies.map((currency) => (
              <option value={currency._id} key={currency._id}>{currency.currencyname}</option>
            ))}
          </select>

        </div>

        <div className='d-block col-12 col-lg-5 m-1 py-2 p-0'>
          <label htmlFor="user" className="col-10 col-lg-5 fw-bold add-user-p py-2"> Share With:</label>

          <select id="user" name="user" className="p-2 px-4 search col-10 col-lg-7" value={user}
            onChange={(event) => userChangeHandler(event.target.value)}>
            <option value="" className='text-secondary'>CustomerService</option>
            {users.map((user) => (
              <option value={user._id} key={user._id}>{user.username}</option>
            ))}
          </select>

        </div>

        <div className='col-12 m-1 py-2 p-0'>
          <label className='col-10 col-lg-2 fw-bold add-user-p py-2 '>Description :</label>
          <textarea type='text' placeholder='Description' rows="4"
            value={descriptionState.value}
            onChange={descriptionChangeHandler}
            onBlur={descriptionTouchHandler}
            isvalid={descriptionState.isvalid.toString()}
            className={`col-10 col-lg-8 search p-2 ${!descriptionState.isvalid &&
              descriptionState.isTouched &&
              "form-control-invalid"
              }`}
          />
        </div>

        <div className='col-8 m-3 mt-5 row justify-content-center'>
          <button
            disabled={
              status == '64fdd400a86587827152ab3c' ?
                !channel||
                !titleState.isvalid ||
                !descriptionState.isvalid ||
                !taskPriceState.isvalid ||
                !speciality ||
                !client ||
                !currency ||
                !deadline ||
                !status
                :
                !channel||
                !titleState.isvalid ||
                !descriptionState.isvalid ||
                !speciality ||
                !client ||
                !currency ||
                !deadline ||
                !status
            }
            className='add-user-btn p-3  fw-bold col-10 col-lg-5'>
            Add
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddTask
