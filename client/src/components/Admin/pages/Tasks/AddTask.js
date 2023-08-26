import React, { useReducer, useState } from 'react'
import { validate, VALIDATOR_MINLENGTH } from "../../../../util/validators";
import axios from "axios";
import LoadingSpinner from '../../../../LoadingSpinner/LoadingSpinner';
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";
import { TiArrowBack } from 'react-icons/ti';

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
const percentageReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.percentage,
        isvalid: validate(action.percentage, action.validators),
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

const AddTask = () => {

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
  const [percentageState, dispatch3] = useReducer(percentageReducer, {
    value: "",
    isvalid: false,
    isTouched: false,
  });

  const percentageChangeHandler = (event) => {
    dispatch3({
      type: "CHANGE",
      percentage: event.target.value,
      validators: [VALIDATOR_MINLENGTH(1)],
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


  const [deadline, setDeadline] = useState()

  /////////////////////////////////

  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const newSpecialitySubmitHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        "http://localhost:5000/api/task/",
        {
          name: titleState.value,
          type: channelState.value,
        }
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
          <button className="back-btn p-2 px-3 fs-3 " onClick={() => { window.location.href = '/specialities' }}><TiArrowBack /> </button>
        </div>
        <h2 className="col-12 col-lg-7 text-center edit-form-lable p-3">  Add New Task</h2>
      </div>

      <form className='adduser-form bg-white p-3 row justify-content-center m-0' onSubmit={newSpecialitySubmitHandler}>

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

        <div className='col-12 col-lg-5 m-1 py-2 p-0'>
          <label className='col-10 col-lg-5 fw-bold add-user-p py-2'>Percentage :</label>
          <input wtype='number' placeholder='Percentage '
            value={percentageState.value}
            onChange={percentageChangeHandler}
            className={`col-6 col-lg-5 search p-2 ${!percentageState.isvalid &&
              percentageState.isTouched &&
              "form-control-invalid"
              }`}
          /> <span className='col-1'>
            %
          </span>
        </div>

        <div className='col-8 m-3 mt-5 row justify-content-center'>
          <button
            disabled={
              !channelState.isvalid ||
              !titleState.isvalid ||
              !percentageState.isvalid ||
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
