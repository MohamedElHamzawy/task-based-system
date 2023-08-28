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
//channel validation
const channelReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.channel,
        isvalid: validate(action.channel, action.validators),
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

//percentage validation
// const percentageReducer = (state, action) => {
//   switch (action.type) {
//     case "CHANGE":
//       return {
//         ...state,
//         value: action.percentage,
//         isvalid: validate(action.percentage, action.validators),
//       };
//     case "TOUCH":
//       return {
//         ...state,
//         isTouched: true,
//       };
//     default:
//       return state;
//   }
// };

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

  const [specialities, setSpecialities] = useState([]);
  const [clients, setClients] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios.get("http://localhost:5000/api/speciality/").then((res) => {
          setSpecialities(res.data.specialities);
        });
        setLoading(false);
        setIsLoading(false);
      });
      timerId = setTimeout(async () => {
        await axios.get("http://localhost:5000/api/client/").then((res) => {
          setClients(res.data.clients);
        });
        setLoading(false);
        setIsLoading(false);
      });
      timerId = setTimeout(async () => {
        await axios.get("http://localhost:5000/api/currency/").then((res) => {
          setCurrencies(res.data.currencies);
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

  //currency value
  const [currency, setCurrency] = useState('');
  const currencyChangeHandler = (newOne) => {
    setCurrency(newOne);
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

  //channel validation
  const [channelState, dispatch2] = useReducer(channelReducer, {
    value: "",
    isvalid: false,
    isTouched: false,
  });

  const channelChangeHandler = (event) => {
    dispatch2({
      type: "CHANGE",
      channel: event.target.value,
      validators: [VALIDATOR_MINLENGTH(3)],
    });
  };
  const channelTouchHandler = () => {
    dispatch2({
      type: "TOUCH",
    });
  };

  //percentage validation
  // const [percentageState, dispatch3] = useReducer(percentageReducer, {
  //   value: "",
  //   isvalid: false,
  //   isTouched: false,
  // });

  // const percentageChangeHandler = (event) => {
  //   dispatch3({
  //     type: "CHANGE",
  //     percentage: event.target.value,
  //     validators: [VALIDATOR_MINLENGTH(1)],
  //   });
  // };

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

  /////////////////////////////////
  const token = GetCookie("AdminToken")


  const newTaskSubmitHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        "http://localhost:5000/api/task/",
        {
          title: titleState.value,
          channel: channelState.value,
          description : descriptionState.value,
          client : client,
          speciality : speciality ,
          deadline : deadline ,
          task_currency : currency ,
          paid : taskPriceState.value
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
    channelState.value = ''
    titleState.value = ''
    descriptionState.value =''
    taskPriceState.value =''
    setClient('')
    setSpeciality('')
    setDeadline('')
    setCurrency('')
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
        <h2 className="col-12 col-lg-7 text-center edit-form-lable p-3">  Add New Task</h2>
      </div>

      <form className='adduser-form bg-white p-3 row justify-content-center m-0' onSubmit={newTaskSubmitHandler}>

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
        <div className='col-12 col-lg-5 m-1 py-2 p-0'>
          <label className='col-10 col-lg-5 fw-bold add-user-p py-2'>Channel :</label>
          <input type='text' placeholder='Channel '
            value={channelState.value}
            onChange={channelChangeHandler}
            onBlur={channelTouchHandler}
            isvalid={channelState.isvalid.toString()}
            className={`col-10 col-lg-7 search p-2 ${!channelState.isvalid &&
              channelState.isTouched &&
              "form-control-invalid"
              }`}
          />
        </div>

        <div className='col-12 col-lg-5 m-1 py-2 p-0'>
          <label className='col-10 col-lg-5 fw-bold add-user-p py-2'>DeadLine :</label>
          <input type='date' placeholder='DeadLine'
            onChange={(e) => (setDeadline(e.target.value))}
            className='col-6 col-lg-7 search p-2 '
          />
        </div>

        <div className='d-block col-12 col-lg-5 m-1 py-2 p-0'>
          <label htmlFor="speciality" className="col-10 col-lg-5 fw-bold add-user-p py-2"> Speciality:</label>

          <select id="speciality" name="speciality" className="p-2 px-4 search col-10 col-lg-7" value={speciality}
            onChange={(event) => specialityChangeHandler(event.target.value)}>
            <option value="" className='text-secondary'>Specialities</option>
            {specialities.map((speciality) => (
              <option value={speciality._id} key={speciality._id}>{speciality.specialityName}</option>
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
            className={`col-8 col-lg-7 search p-2 ${!taskPriceState.isvalid &&
              taskPriceState.isTouched &&
              "form-control-invalid"
              }`}
          />
        </div>

        {/* <div className='col-12 col-lg-5 m-1 py-2 p-0'>
          <label className='col-10 col-lg-5 fw-bold add-user-p py-2'>Percentage :</label>
          <input wtype='number' placeholder='Percentage '
            value={percentageState.value}
            onChange={percentageChangeHandler}
            className={`col-6 col-lg-6 search p-2 ${!percentageState.isvalid &&
              percentageState.isTouched &&
              "form-control-invalid"
              }`}
          /> <span className='col-1'>
            %
          </span>
        </div> */}

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
          <label htmlFor="client" className="col-10 col-lg-5 fw-bold add-user-p py-2"> Clients:</label>

          <select id="clients" name="clients" className="p-2 px-4 search col-10 col-lg-7" value={client}
            onChange={(event) => clientChangeHandler(event.target.value)}>
            <option value="" className='text-secondary'>clients</option>
            {clients.map((client) => (
              <option value={client._id} key={client._id}>{client.clientname}</option>
            ))}
          </select>

        </div>

        <div className='col-12 m-1 py-2 p-0'>
          <label className='col-10 col-lg-2 fw-bold add-user-p py-2 '>Description :</label>
          <textarea type='text' placeholder='Description'  rows="4"
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
              !channelState.isvalid ||
              !titleState.isvalid ||
              // !percentageState.isvalid ||
              !descriptionState.isvalid ||
              !speciality ||
              !client||
              !currency||
              !deadline 
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
