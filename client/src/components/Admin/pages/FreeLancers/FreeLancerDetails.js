import React, { useEffect, useReducer, useState } from 'react'

import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";
import { validate, VALIDATOR_EMAIL, VALIDATOR_MINLENGTH } from "../../../../util/validators";

import { useParams } from "react-router-dom";
import { RiDeleteBinFill } from 'react-icons/ri';
import { TiArrowBack } from 'react-icons/ti';
import { FaTasks } from 'react-icons/fa';
import { FaCoins } from 'react-icons/fa';
import { FaCcVisa } from 'react-icons/fa';
import { ImCancelCircle } from 'react-icons/im';
import { BsFillFolderSymlinkFill } from 'react-icons/bs';
import { AiOutlineFileDone } from 'react-icons/ai';
import { GiProfit } from 'react-icons/gi';
import { FiFilter } from 'react-icons/fi';

// Date filter

const getDateFilter = (start, end, tasks) => {
  if (!start || !end) {
    return tasks;
  } return tasks.filter((task) => start <= task.deadline.split('T')[0] && task.deadline.split('T')[0] <= end);
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
  const [specialities, setSpecialities] = useState([]);
  const [freeLancerAccount, setFreeLancerAccount] = useState();
  const [freeLancerTasks, setFreeLancerTasks] = useState([]);
  const [currencies, setCurrencies] = useState([]);


  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios.get(`http://localhost:5000/api/freeLancer/${id}`).then((res) => {
          setFreeLancer(res.data.freelancer);
          setFreeLancerTasks(res.data.freelancerTasks)
          setFreeLancerAccount(res.data.freelancerAccount)
          console.log(res.data)
        });
        setLoading(false);
        setIsLoading(false);
      });
      timerId = setTimeout(async () => {
        await axios.get("http://localhost:5000/api/speciality/").then((res) => {
          setSpecialities(res.data.specialities);
        });
      });
      timerId = setTimeout(async () => {
        await axios.get("http://localhost:5000/api/currency/").then((res) => {
          setCurrencies(res.data.currencies);
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

  //country validation
  const [countryState, dispatch4] = useReducer(countryReducer, {
    value: freeLancer.country,
    isvalid: false,
    isTouched: false,
  });

  const countryChangeHandler = (event) => {
    dispatch4({
      type: "CHANGE",
      country: event.target.value,
      validators: [VALIDATOR_MINLENGTH(3)],
    });
  };
  const countryTouchHandler = () => {
    dispatch4({
      type: "TOUCH",
    });
  };
  const [currency, setCurreny] = useState(freeLancer.currency && freeLancer.currency.currencyname);
  const [userSpeciality, setUserSpeciality] = useState(freeLancer.speciality && freeLancer.speciality.sub_speciality);

  //////////////////////////////////////
  const editFreeLancerHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        `http://localhost:5000/api/freelancer/${freeLancer._id}`,
        {
          name: fullNameState.value,
          speciality: userSpeciality,
          email: emailState.value,
          country: countryState.value,
          phone: numberState.value,
          currency: currency
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
        ` http://localhost:5000/api/freelancer/${id}`
        //  ,
        //  { headers :{
        //     'Authorization':`Bearer ${token}`
        //   }
        // }
      )
      const responseData = await response;
      console.log(responseData.data)
      setError(responseData.data.message);
      setIsLoading(false);
      window.location.href = '/freelancers';
    } catch (err) {
      setIsLoading(false);
      setError(err.message && "SomeThing Went Wrong , Please Try Again .");
    };
  }
  //error message
  const errorHandler = () => {
    setError(null);
    window.location.reload(true);
  };

  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [withoutFilterData, setwithoutFilterData] = useState(true);
  const [dateFilterData, setDateFilterData] = useState(false);
  const DateFilter = getDateFilter(start, end, freeLancerTasks);

  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="text-center row w-100 p-2 m-0">
      <ErrorModal error={error} onClear={errorHandler} />

      <div className="row mb-4">
        <div className="col-3 text-center">
          <button className="back-btn p-2 px-3 fs-3 " onClick={() => { window.location.href = '/freelancers' }}><TiArrowBack /> </button>
        </div>
        <h2 className="col-12 col-lg-7 text-center system-head p-2 pt-4  fw-bold">  Freelancer Details</h2>
      </div>

      <div className="row bg-white adduser-form p-1 m-1 justify-content-center">

        <div className="col-12 row p-3 justify-content-end ">
          <div className="col-4">
            <button className="delete-btn px-4 p-1 fs-3" onClick={deleteFreeLancerHandler}>
              <RiDeleteBinFill />
            </button>
          </div>
        </div>

        {/* /////////////////////// */}
        <div className="col-12 col-lg-6 row p-2 ">
          <h3 className="col-10 col-md-5  edit-form-lable text-start p-2 fw-bold">Full Name :</h3>
          <p className={!editFull ? "d-inline col-12 col-md-6 py-2 edit-form-p details-data fw-bold " : 'd-none'}> {freeLancer.freelancername} </p>
          <div className={editFull ? "d-inline col-12 col-md-6 py-2 " : 'd-none'} >
            <input type='text' placeholder={freeLancer.freelancername}
              value={fullNameState.value}
              onChange={fullNameChangeHandler}
              onBlur={fullNameTouchHandler}
              isvalid={fullNameState.isvalid.toString()}
              className={`search w-100 p-2 ${!fullNameState.isvalid &&
                fullNameState.isTouched &&
                "form-control-invalid"
                }`}
            />
          </div>
        </div>

        {/* /////////////////////// */}

        <div className="col-12 col-lg-6 row p-2 ">
          <h3 className="col-10 col-md-5  edit-form-lable text-start p-2  fw-bold">  Email :</h3>
          <p className={!editFull ? "d-inline col-12 col-md-6 py-2 edit-form-p details-data fw-bold " : 'd-none'}> {freeLancer.email} </p>
          <div className={editFull ? "d-inline col-12 col-md-6 py-2 " : 'd-none'} >
            <input type='email' placeholder={freeLancer.email}
              value={emailState.value}
              onChange={emailChangeHandler}
              onBlur={emailTouchHandler}
              isvalid={emailState.isvalid.toString()}
              className={`search w-100 p-2 ${!emailState.isvalid &&
                emailState.isTouched &&
                "form-control-invalid"
                }`}
            />
          </div>
        </div>

        {/* /////////////////////// */}
        <div className="col-12 col-lg-6 row p-2 ">
          <h3 className="col-10 col-md-5  edit-form-lable text-start p-2 fw-bold"> Phone :</h3>
          <p className={!editFull ? "d-inline col-12 col-md-6 py-2 edit-form-p details-data fw-bold" : 'd-none'}> {freeLancer.phone} </p>
          <div className={editFull ? "d-inline col-12 col-md-6 py-2 " : 'd-none'} >
            <input type='number' placeholder={freeLancer.phone}
              value={numberState.value}
              onChange={numberChangeHandler}
              onBlur={numbertouchHandler}
              isvalid={numberState.isvalid.toString()}
              className={`search w-100 p-2 ${!numberState.isvalid &&
                numberState.isTouched &&
                "form-control-invalid"
                }`}
            />
          </div>

        </div>

        {/* /////////////////////// */}
        <div className="d-flex col-12 col-lg-6 row p-2 ">
          <h3 className="col-10 col-md-5  edit-form-lable text-start p-2 fw-bold">Speciality :</h3>
          <p className={!editFull ? "d-inline col-12 col-md-6 py-2 edit-form-p details-data fw-bold" : 'd-none'} >
            {freeLancer.speciality && freeLancer.speciality.sub_speciality}
          </p>
          <div className={editFull ? "d-inline col-12 col-md-6 py-2 " : 'd-none'} >
            <select id="speciality" name="speciality" className="p-2 px-4 search col-12" value={userSpeciality}
              onChange={(event) => specialityChangeHandler(event.target.value)}>
              <option value="" className='text-secondary'>Specialities</option>
              {specialities.map((speciality) => (
                <option value={speciality._id} key={speciality._id}>{speciality.sub_speciality}</option>
              ))}
            </select>
          </div>
        </div>
        {/* /////////////////////// */}
        <div className="col-12 col-lg-6 row p-2 ">
          <h3 className="col-10 col-md-5  edit-form-lable text-start p-2 fw-bold"> Country :</h3>
          <p className={!editFull ? "d-inline col-12 col-md-6 py-2 edit-form-p details-data fw-bold" : 'd-none'}> {freeLancer.country} </p>
          <div className={editFull ? "d-inline col-12 col-md-6 py-2 " : 'd-none'} >
            <input type='text' placeholder={freeLancer.country}
              value={countryState.value}
              onChange={countryChangeHandler}
              onBlur={countryTouchHandler}
              isvalid={countryState.isvalid.toString()}
              className={`search w-100 p-2 ${!countryState.isvalid &&
                countryState.isTouched &&
                "form-control-invalid"
                }`}
            />
          </div>
        </div>
        {/* /////////////////////// */}
        <div className="col-12 col-lg-6 row p-2 ">
          <h3 className="col-10 col-md-5  edit-form-lable text-start p-2 fw-bold"> Currency :</h3>
          <p className={!editFull ? "d-inline col-12 col-md-6 py-2 edit-form-p details-data fw-bold" : 'd-none'}> {freeLancer.currency && freeLancer.currency.currencyname} </p>
          <div className={editFull ? "d-inline col-12 col-md-6 py-2 " : 'd-none'} >
            <select id="Currency" name="Currency" className="p-2 px-4 search col-12" value={currency}
              onChange={(event) => setCurreny(event.target.value)}>
              <option value="" className='text-secondary'>Currencies</option>
              {currencies.map((currency) => (
                <option value={currency._id} key={currency._id}>{currency.currencyname}</option>
              ))}
            </select>
          </div>
        </div>
        {/* /////////////////////// */}


        <div className="col-12  p-3">
          {!editFull ?
            <button
              className="edit-user-btn p-3 col-10 col-lg-4 fw-bold"
              onClick={() => { setEditFull(!editFull) }}
            >
              Edit
            </button> : ''
          }
          {editFull ?
            <>
              <button
                disabled={
                  !fullNameState.isvalid &&
                  !numberState.isvalid &&
                  !emailState.isvalid &&
                  !countryState.isvalid &&
                  !currency &&
                  !userSpeciality
                }
                className="edit-user-btn p-3 col-8 col-lg-4 fw-bold"
                onClick={editFreeLancerHandler}
              >
                Submit
              </button>
              <button
                className="bg-danger cancel-btn p-3 col-3 col-md-1 mx-2 fw-bold"
                onClick={() => { setEditFull(!editFull) }}
              >
                <ImCancelCircle className="fs-3" />
              </button>
            </>
            : ''
          }
        </div>

      </div>

      <div className="row analysis adduser-form p-1 py-3 m-1 justify-content-center">
        <div className="bg-white adduser-form col-11 col-sm-5 col-lg-3 col-xl-2 p-2 row m-2">
          <h6 className="text-secondary fw-bold col-8 pt-3 text-start">Tasks Count </h6>
          <div className="bg-warning col-4 icon p-3"><FaTasks className="fs-3" /></div>
          <h4 className="text-center col-4 fw-bold">{freeLancer.tasksCount}</h4>
        </div>
        <div className="bg-white adduser-form col-11 col-sm-5 col-lg-3 col-xl-2 p-2 row m-2">
          <h6 className="text-secondary fw-bold col-8 pt-3 text-start">Completed Count </h6>
          <div className="bg-info col-4 icon p-3"><AiOutlineFileDone className="fs-3" /></div>
          <h4 className="text-center col-4 fw-bold">{freeLancer.completedCount}</h4>
        </div>
        <div className="bg-white adduser-form col-11 col-sm-5 col-lg-3 col-xl-2 p-2 row m-2">
          <h6 className="text-secondary fw-bold col-8 pt-3 text-start">FreeLancer Gain </h6>
          <div className="bg-success col-4 icon p-3"><FaCoins className="fs-3 " /></div>
          <h4 className="text-center col-4 fw-bold">{freeLancer.totalGain}</h4>
        </div>
        <div className="bg-white adduser-form col-11 col-sm-5 col-lg-3 col-xl-2 p-2 row m-2">
          <h6 className="text-secondary fw-bold col-8 pt-3 text-start">Total Profit </h6>
          <div className="bg-danger col-4 icon p-3"><GiProfit className="fs-3" /></div>
          <h4 className="text-center col-4 fw-bold">{freeLancer.totalProfit}</h4>
        </div>
        <div className="bg-white adduser-form col-11 col-sm-5 col-lg-3 col-xl-2 p-2 row m-2">
          <h6 className="text-secondary fw-bold col-8 pt-3 text-start">Account Details: </h6>
          <div className="bg-danger col-4 icon p-3"><FaCcVisa className="fs-3 " /></div>
          {freeLancerAccount && freeLancerAccount.map((acc) => (
            <div className="text-center col-8 fw-bold" key={acc._id}>
              <a href={`/account/${acc._id}`} className="text-dark fw-bold">Click Here </a>
            </div>
          ))}
        </div>
      </div>

      {/* /////////////////////////////////////////////////// */}
      <div className="row p-0 m-0 justify-content-center adduser-form">
        <div className="col-12 col-md-9 text-secondary row p-2">
        <h3 htmlFor="Speciality" className="my-2 col-12 text-center text-dark fw-bold">Filter:</h3>
          <label htmlFor="Speciality" className="mt-2 col-4 col-sm-2 text-start"> <FiFilter className="" /> From:</label>
          <input type="date" className="search col-8 col-sm-4  p-2 mt-1"
            onChange={(e) => { setStart(e.target.value); setDateFilterData(true); setwithoutFilterData(false)}}
          />
          <label htmlFor="Speciality" className="mt-2 col-4 col-sm-2 text-start"> <FiFilter className="" />To:</label>
          <input type="date" className="search col-8 col-sm-4  p-2 mt-1"
            onChange={(e) => { setEnd(e.target.value); setDateFilterData(true); setwithoutFilterData(false) }}
          />
        </div>

      </div>

      <div className="row analysis-tasks adduser-form p-1 py-3 m-1 justify-content-center">
        {withoutFilterData ? freeLancerTasks && !freeLancerTasks.length == 0 ? freeLancerTasks.map((task) => (
          <div key={task._id} className="task-card bg-white p-2 py-3 row users-data col-11 my-1 text-start">
            <div className="col-12 fw-bold row text-center">
              <span
                className={
                  task.taskStatus.statusname == 'pending' ? 'bg-warning p-3 status col-12 ' :
                  task.taskStatus.statusname == 'waiting offer' ? 'waiting-offer   p-3 status col-12 ' :
                    task.taskStatus.statusname == 'approved' ? 'bg-info   p-3 status col-12 ' :
                      task.taskStatus.statusname == 'working on' ? 'bg-primary   p-3 status col-12 ' :
                        task.taskStatus.statusname == 'done' ? 'bg-success  p-3 status col-12 ' :
                          task.taskStatus.statusname == 'delivered' ? 'bg-secondary  p-3 status col-12' :
                            task.taskStatus.statusname == 'rejected' ? 'bg-danger   p-3 status col-12 ' :
                              task.taskStatus.statusname == 'not available' ? 'bg-dark   p-3 status col-12 ' :
                                task.taskStatus.statusname == 'on going' ? 'on-going  p-3 status col-12 ' :
                                  task.taskStatus.statusname == 'offer submitted' ? ' offer-submitted   p-3 status col-12 ' :
                                    task.taskStatus.statusname == 'edit' ? 'edit   p-3 status col-12 ' :
                                      task.taskStatus.statusname == 'cancel' ? 'cancel   p-3 status col-12 ' :
                                        'anystatus  p-3 status col-12 '
                }>
               
                {task.taskStatus.statusname}
              </span>

            </div>

            <div className="col-12 row text-center justify-content-end my-2">
            <div className="fw-bold col-5 col-sm-7 col-md-8 col-lg-10 text-center row p-0 m-0">
                <span className="col-11 col-sm-7 col-md-4 col-lg-2 serial-number p-3">
                  {task.serialNumber}
                </span>
              </div>
              <button className="details-btn p-3 fw-bold col-7 col-sm-5 col-md-4 col-lg-2" onClick={() => { window.location.href = `/task/${task._id}` }}>
                <BsFillFolderSymlinkFill className="fs-4" /> Details
              </button>
            </div>

            <p className="col-12 col-sm-6 edit-form-p  fw-bold"> <span className="edit-form-lable">Title :</span> {task.title}</p>
            <p className="col-12 col-sm-6 edit-form-p  fw-bold"> <span className="edit-form-lable">Speciality :</span> {task.speciality.sub_speciality}</p>
            <p className="col-12 col-sm-6 edit-form-p  fw-bold"> <span className="edit-form-lable">Client :</span> {task.client.clientname}</p>
            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Created By :</span> {task.created_by && task.created_by.fullname}</p>
            <p className="col-12 col-sm-6 edit-form-p  fw-bold"> <span className="edit-form-lable">Deadline :</span> {task.deadline.split('T')[0]}</p>
            {task.freelancer &&
              <p className="col-12 col-sm-6 edit-form-p  fw-bold"> <span className="edit-form-lable">Freelancer :</span> {task.freelancer.freelancername}</p>
            }
          </div>
        )) :
          <div className="row col-12  p-2 text-center">
            <h3 className=" text-danger edit-form-lable">This User Didn't Do Any Tasks Yet</h3>
          </div> :''
        } 
      {dateFilterData ? !DateFilter.length == 0 ? DateFilter.map((task) => (
          <div key={task._id} className="task-card bg-white p-2 py-3 row users-data col-11 my-1 text-start">
            <div className="col-12 fw-bold row text-center">
              <span
                className={
                  task.taskStatus.statusname == 'pending' ? 'bg-warning p-3 status col-12 ' :
                  task.taskStatus.statusname == 'waiting offer' ? 'waiting-offer   p-3 status col-12 ' :
                    task.taskStatus.statusname == 'approved' ? 'bg-info   p-3 status col-12 ' :
                      task.taskStatus.statusname == 'working on' ? 'bg-primary   p-3 status col-12 ' :
                        task.taskStatus.statusname == 'done' ? 'bg-success  p-3 status col-12 ' :
                          task.taskStatus.statusname == 'delivered' ? 'bg-secondary  p-3 status col-12' :
                            task.taskStatus.statusname == 'rejected' ? 'bg-danger   p-3 status col-12 ' :
                              task.taskStatus.statusname == 'not available' ? 'bg-dark   p-3 status col-12 ' :
                                task.taskStatus.statusname == 'on going' ? 'on-going  p-3 status col-12 ' :
                                  task.taskStatus.statusname == 'offer submitted' ? ' offer-submitted   p-3 status col-12 ' :
                                    task.taskStatus.statusname == 'edit' ? 'edit   p-3 status col-12 ' :
                                      task.taskStatus.statusname == 'cancel' ? 'cancel   p-3 status col-12 ' :
                                        'anystatus  p-3 status col-12 '
                }>
               
                {task.taskStatus.statusname}
              </span>

            </div>

            <div className="col-12 row text-center justify-content-end my-2">
            <div className="fw-bold col-5 col-sm-7 col-md-8 col-lg-10 text-center row p-0 m-0">
                <span className="col-11 col-sm-7 col-md-4 col-lg-2 serial-number p-3">
                  {task.serialNumber}
                </span>
              </div>
              <button className="details-btn p-3 fw-bold col-7 col-sm-5 col-md-4 col-lg-2" onClick={() => { window.location.href = `/task/${task._id}` }}>
                <BsFillFolderSymlinkFill className="fs-4" /> Details
              </button>
            </div>
            <p className="col-12 col-sm-6 edit-form-p  fw-bold"> <span className="edit-form-lable">Title :</span> {task.title}</p>
            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Speciality :</span> {task.speciality.sub_speciality}</p>
            <p className="col-12 col-sm-6 edit-form-p  fw-bold"> <span className="edit-form-lable">Client :</span> {task.client.clientname}</p>
            <p className="col-12 col-sm-6 edit-form-p  fw-bold"> <span className="edit-form-lable">Created By :</span> {task.created_by && task.created_by.fullname}</p>
            <p className="col-12 col-sm-6 edit-form-p  fw-bold"> <span className="edit-form-lable">Deadline :</span> {task.deadline.split('T')[0]}</p>
            {task.freelancer &&
              <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Freelancer :</span> {task.freelancer.freelancername}</p>
            }
          </div>
        )) :
          <div className="row col-12  p-2 text-center">
            <h3 className=" text-danger edit-form-lable">No Tasks With This Date</h3>
          </div> :''
        } 
      </div>

    </div>
  )
}

export default FreeLancerDetails
