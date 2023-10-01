import React, { useEffect, useReducer, useState } from 'react'
import { validate, VALIDATOR_MINLENGTH } from "../../../../util/validators";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";

//Title validation
const titleReducer = (state, action) => {
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

  //price validation
  const priceReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE":
        return {
          ...state,
          value: action.price,
          isvalid: validate(action.price, action.validators),
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

const EditTask = (props) => {

    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    const [userSpeciality, setUserSpeciality] = useState(props.task.speciality._id);
    const [currency, setCurrency] = useState(props.task.task_currency._id);
    const [deadline, setDeadline] = useState(props.task.deadline)

    const [specialities, setSpecialities] = useState([]);
    const [currencies, setCurrencies] = useState([]);

    useEffect(() => {
        let timerId;
        if (loading) {
          setIsLoading(true);
          timerId = setTimeout(async () => {
            await axios.get(" https://smarteduservices.com:5000/api/speciality/").then((res) => {
              setSpecialities(res.data.specialities);
            });
          });
          timerId = setTimeout(async () => {
            await axios.get(" https://smarteduservices.com:5000/api/currency/").then((res) => {
              setCurrencies(res.data.currencies);
            });
            setLoading(false);
            setIsLoading(false);
          });
        }
        return () => clearTimeout(timerId);
      }, [loading]);

//title validation
  const [titleState, dispatch] = useReducer(titleReducer, {
    value: props.task.title,
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
  const [channelState, dispatch4] = useReducer(channelReducer, {
    value: props.task.channel,
    isvalid: false,
    isTouched: false,
  });

  const channelChangeHandler = (event) => {
    dispatch4({
      type: "CHANGE",
      channel: event.target.value,
      validators: [VALIDATOR_MINLENGTH(3)],
    });
  };
  const channelTouchHandler = () => {
    dispatch4({
      type: "TOUCH",
    });
  };

//Description validation
const [descriptionState, dispatch2] = useReducer(descriptionReducer, {
    value: props.task.description,
    isvalid: false,
    isTouched: false,
  });

  const descriptionChangeHandler = (event) => {
    dispatch2({
      type: "CHANGE",
      description: event.target.value,
      validators: [VALIDATOR_MINLENGTH(3)],
    });
  };
  const descriptionTouchHandler = () => {
    dispatch2({
      type: "TOUCH",
    });
  };

  //price validation
  const [priceState, dispatch5] = useReducer(priceReducer, {
    value: props.task.paid,
    isvalid: false,
    isTouched: false,
  });

  const priceChangeHandler = (event) => {
    dispatch5({
      type: "CHANGE",
      price: event.target.value,
      validators: [VALIDATOR_MINLENGTH(2)],
    });
  };
  const pricetouchHandler = () => {
    dispatch5({
      type: "TOUCH",
    });
  };


  //speciality value
  const specialityChangeHandler = (newOne) => {
    setUserSpeciality(newOne);
  };

  //currency value
  const currencyChangeHandler = (newOne) => {
    setCurrency(newOne);
  };

// edit task handler
  const editTaskHandler = async (event) => {

    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        ` https://smarteduservices.com:5000/api/task/${props.id}`,
        {
            title: titleState.value,
            channel: channelState.value,
            description : descriptionState.value,
            speciality : userSpeciality ,
            deadline : deadline ,
            paid : priceState.value,
            task_currency :currency ,
        },
        { headers: { Authorization: `Bearer ${props.token}` } }
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

  const errorHandler = () => {
    setError(null);
    window.location.reload(true);
  };
    return isLoading ? (
        <LoadingSpinner asOverlay />
      ) :(
        <div className="row bg-white adduser-form p-0 m-0 justify-content-start py-3">
            <ErrorModal error={error} onClear={errorHandler} />
            {isLoading && <LoadingSpinner asOverlay />}
            <div className="col-12 col-md-6 row ">
                <h5 className="col-12 col-sm-6 edit-form-lable text-start pt-3 data">  Title :</h5>
                <div className="d-inline col-12 col-sm-6  pt-3  text-start">
                    <input type='text' 
                    value={titleState.value}
                    onChange={titleChangeHandler}
                    onBlur={titleTouchHandler}
                    isvalid={titleState.isvalid.toString()}
                    className={`search w-100 p-2 ${!titleState.isvalid &&
                        titleState.isTouched &&
                        "form-control-invalid"
                        }`}
                    />
                </div>
            </div>

            <div className="col-12 col-md-6  row ">
                <h5 className="col-12 col-sm-6 edit-form-lable text-start pt-3 data">  Speciality :</h5>
                <div className="d-inline col-12 col-sm-6 pt-3  text-start"> 
                    <select id="speciality" name="speciality" className="p-2 px-4 search col-12" value={userSpeciality}
                    onChange={(event) => specialityChangeHandler(event.target.value)}>
                    <option value="" className='text-secondary'>Specialities</option>
                    {specialities.map((speciality) => (
                        <option value={speciality._id} key={speciality._id}>{speciality.sub_speciality}</option>
                    ))}
                    </select>
                </div>
            </div>

            <div className="col-12 col-md-6  row ">
                <h5 className="col-12 col-sm-6 edit-form-lable text-start pt-3 data ">  Channel :</h5>
                <div className="d-inline col-12 col-sm-6 pt-3  text-start">
                    <input type='text'
                    value={channelState.value}
                    onChange={channelChangeHandler}
                    onBlur={channelTouchHandler}
                    isvalid={channelState.isvalid.toString()}
                    className={`search w-100 p-2 ${!channelState.isvalid &&
                        channelState.isTouched &&
                        "form-control-invalid"
                        }`}
                    />
                </div>
            </div>

            <div className="col-12 col-md-6  row ">
                <h5 className="col-12 col-sm-6  edit-form-lable text-start pt-3 data">Client Price:</h5>
                <div className="d-inline col-12 col-sm-6 pt-3  text-start">
                    <input type='number' 
                        value={priceState.value}
                        onChange={priceChangeHandler}
                        onBlur={pricetouchHandler}
                        isvalid={priceState.isvalid.toString()}
                        className={`search w-100 p-2 ${!priceState.isvalid &&
                            priceState.isTouched &&
                            "form-control-invalid"
                        }`}
                    />
                </div>
            </div>
            <div className='col-12 col-md-6 row'>
                <h5 className="col-12 col-sm-6 edit-form-lable text-start pt-3 data">Currency:</h5>
                <div className="d-inline col-12 col-sm-6  pt-3  text-start">
                    <select id="currencies" name="currencies" className="p-2 px-4 search col-12" value={currency}
                    onChange={(event) => currencyChangeHandler(event.target.value)}>
                    <option value="" className='text-secondary'>currencies</option>
                    {currencies.map((currency) => (
                    <option value={currency._id} key={currency._id}>{currency.currencyname}</option>
                    ))}
                    </select>
                </div>
            </div>

            <div className="col-12 col-md-6 row ">
                <h5 className="col-12 col-sm-6 edit-form-lable text-start pt-3 data">Dead Line :</h5>
                <div className="d-inline col-12 col-sm-6  pt-3  text-start"> 
                    <input   type="datetime-local"
                        id="meeting-time"
                        name="meeting-time"
                        placeholder='DeadLine'
                        onChange={(e) => (setDeadline(e.target.value))}
                        className='col-12 search p-2 px-4'
                    />
                </div>
            </div>

            <div className="col-12 row ">
                <h5 className="col-md-4 col-12 edit-form-lable text-start pt-3">  Description :</h5>
                <div className="d-inline col-md-8 col-12  pt-3  text-start"> 
                    <textarea type='text' placeholder='Description'  rows="4"
                        value={descriptionState.value}
                        onChange={descriptionChangeHandler}
                        onBlur={descriptionTouchHandler}
                        isvalid={descriptionState.isvalid.toString()}
                        className={`col-12 col-lg-8 search p-2 ${!descriptionState.isvalid &&
                        descriptionState.isTouched &&
                        "form-control-invalid"
                        }`}
                    />
                </div>
            </div>

            <div className="row col-12 p-3 justify-content-center" >
                <button
                    disabled={
                        !titleState.isvalid &&
                        !channelState.isvalid &&
                        !descriptionState.isvalid &&
                        !priceState.isvalid &&
                        !deadline &&
                        !currency &&
                        !userSpeciality
                    }
                    className="edit-task-btn p-3 col-10 col-lg-4 fw-bold"
                    onClick={editTaskHandler}
                >
                    Edit Task
                </button>
            </div>
    {/* <div className="col-12 col-md-6  row ">
      <h5 className="col-6 edit-form-lable text-start pt-3 data">  Client :</h5>
      <p className="d-inline col-6  pt-3  text-start">
        <a className="text-dark fw-bold" >
        </a>
      </p>
    </div> 
     <div className="col-12 col-md-6  row ">
      <h5 className="col-12 col-sm-6 edit-form-lable text-start pt-3 data">  Client Website:</h5>
      <p className="d-inline col-12 col-sm-6 pt-3  text-start">  </p>
    </div> 
     <div className='col-12 col-md-6  row'>
      <h5 className="col-12 col-sm-6 edit-form-lable text-start pt-3 data">Customer Offer:</h5>
      <p className="d-inline col-12 col-sm-6 pt-3  text-start"></p>
    </div> 
     <div className="col-12 col-md-6  row ">
      <h5 className="col-12 col-sm-6 edit-form-lable text-start pt-3 data">  title :</h5>
      <p className="d-inline col-12 col-sm-6  pt-3  text-start">
        <a className="text-dark fw-bold" >
        </a>
      </p>
    </div>
    <div className="col-12 col-md-6  row ">
      <h5 className="col-6 edit-form-lable text-start pt-3 data">  UserRole :</h5>
      <p className="d-inline col-6  pt-3  text-start">  </p>
    </div> 
    */}
        </div>
    )
}

export default EditTask
