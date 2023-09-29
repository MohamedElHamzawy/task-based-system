import React, { useEffect, useReducer, useState } from 'react'
import { validate, VALIDATOR_MINLENGTH } from "../../../../util/validators";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";

import { useParams } from "react-router-dom";
import { RiDeleteBinFill } from 'react-icons/ri';
import { TiArrowBack } from 'react-icons/ti';
import { FaTasks } from 'react-icons/fa';
import { FaCoins } from 'react-icons/fa';
import { ImCancelCircle } from 'react-icons/im';
import { BsFillFolderSymlinkFill } from 'react-icons/bs';
import { AiOutlineFileDone } from 'react-icons/ai';
import { GiProfit } from 'react-icons/gi';
import { GiPayMoney } from 'react-icons/gi';
import { FiFilter } from 'react-icons/fi';

// Date filter
const getDateFilter = (start, end, tasks) => {
  if (!start || !end) {
    return tasks;
  } return tasks.filter((task) => start <= task.deadline.split('T')[0] && task.deadline.split('T')[0] <= end);
};

//userName validation
const userNameReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.userName,
        isvalid: validate(action.userName, action.validators),
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
const UserDetails = () => {

  const [visable, setVisable] = useState(false);

  const [editFull, setEditFull] = useState(false);
  const [editSpeciality, setEditSpeciality] = useState(false);

  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  let { id } = useParams();

  const [user, setUser] = useState([]);

  const [userSpeciality, setUserSpeciality] = useState();
  const [userRole, setUserRole] = useState();

  const [specialityId, setspecialityId] = useState();
  const [specialities, setSpecialities] = useState([]);
  const [countries, setCountries] = useState([]);

  const [userTasks, setUserTasks] = useState([]);

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios.get(`https://smarteduservices.com:5000/api/user/${id}`).then((res) => {
          setUser(res.data.user);
          setUserTasks(res.data.userTasks)
          if (res.data.user.user_role == 'specialistService') {
            setspecialityId(res.data.user.speciality);
            setVisable(true);
          }
          console.log(res.data)
        });
        setLoading(false);
        setIsLoading(false);
      });
      timerId = setTimeout(async () => {
        await axios.get("https://smarteduservices.com:5000/api/speciality/").then((res) => {
          setSpecialities(res.data.specialities);
        });
      });
      timerId = setTimeout(async () => {
        await axios.get("https://smarteduservices.com:5000/api/country/").then((res) => {
          setCountries(res.data.countries);
        });
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  //userName validation
  const [userNameState, dispatch] = useReducer(userNameReducer, {
    value: user.username,
    isvalid: false,
    isTouched: false,
  });

  const userNameChangeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      userName: event.target.value,
      validators: [VALIDATOR_MINLENGTH(3)],
    });
  };
  const userNameTouchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  //fullName validation
  const [fullNameState, dispatch2] = useReducer(fullNameReducer, {
    value: user.fullname,
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

  //country value
  const [country, setCountry] = useState('');
  const countryChangeHandler = (newOne) => {
    setCountry(newOne);
  };


  //Number validation
  const [numberState, dispatch5] = useReducer(numberReducer, {
    value: user.phone,
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


  //speciality value
  const specialityChangeHandler = (newOne) => {
    setUserSpeciality(newOne);
  };


  //////////////////////////////////////
  const editUserHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        `https://smarteduservices.com:5000/api/user/${user._id}`,
        {
          fullName: fullNameState.value,
          userName: userNameState.value,
          userRole: userRole,
          speciality: userSpeciality,
          country: country,
          phone: numberState.value,
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
  const deleteUserHandler = async () => {
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.delete(
        ` https://smarteduservices.com:5000/api/user/${id}`
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
      window.location.href = '/';
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "SomeThing Went Wrong , Please Try Again .");
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
  const DateFilter = getDateFilter(start, end, userTasks);

  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="text-center row w-100 p-2 m-0">
      <ErrorModal error={error} onClear={errorHandler} />

      <div className="row mb-2">
        <div className="col-3 text-center">
          <button className="back-btn p-2 px-3 fs-3 " onClick={() => { window.location.href = '/' }}><TiArrowBack /> </button>
        </div>
        <h2 className="col-12 col-lg-7 text-center system-head p-2 pt-4  fw-bold">  User Details</h2>
      </div>

      <div className="row bg-white adduser-form p-3 m-1 justify-content-start">
        {user.user_role == 'admin' ?
          ''
          :
          <div className="col-12 row justify-content-end ">
            <div className="col-4">
              <button className="delete-btn px-4 p-1 fs-3" onClick={deleteUserHandler}>
                <RiDeleteBinFill />
              </button>
            </div>
          </div>}

        {/* /////////////////////// */}
        <div className="col-12 col-md-6 row py-2 ">
          <h5 className="col-10 col-md-5 edit-form-lable text-start p-2 fw-bold"> Full Name :</h5>
          <p className={!editFull ? "d-inline col-12 col-md-6 py-2 edit-form-p fw-bold name details-data" : 'd-none'}> {user.fullname} </p>
          <div className={editFull ? "d-inline col-12 col-md-6 py-2 " : 'd-none'} >
            <input type='text' placeholder={user.fullname}
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

        <div className="col-12 col-md-6  row py-2 ">
          <h5 className="col-10 col-md-5  edit-form-lable text-start p-2  fw-bold"> User Name:</h5>
          <p className={!editFull ? "d-inline col-12 col-md-6 py-2 edit-form-p fw-bold name details-data" : 'd-none'}> {user.username} </p>
          <div className={editFull ? "d-inline col-12 col-md-6 py-2" : 'd-none'} >
            <input type='text' placeholder={user.username}
              value={userNameState.value}
              onChange={userNameChangeHandler}
              onBlur={userNameTouchHandler}
              isvalid={userNameState.isvalid.toString()}
              className={`search w-100 p-2 ${!userNameState.isvalid &&
                userNameState.isTouched &&
                "form-control-invalid"
                }`}
            />
          </div>

        </div>
        {/* /////////////////////// */}
        <div className="col-12 col-md-6  row p-2 ">
          <h5 className="col-10 col-md-5  edit-form-lable text-start p-2 fw-bold"> Phone :</h5>
          <p className={!editFull ? "d-inline col-12 col-md-6 py-2 edit-form-p fw-bold details-data" : 'd-none'}> {user.phone} </p>
          <div className={editFull ? "d-inline col-12 col-md-6 py-2 " : 'd-none'} >
            <input type='number' placeholder={user.phone}
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
        <div className="col-12 col-md-6  row p-2 ">
          <h5 className="col-10 col-md-5  edit-form-lable text-start p-2 fw-bold"> Country :</h5>
          <p className={!editFull ? "d-inline col-12 col-md-6 py-2 edit-form-p fw-bold details-data" : 'd-none'}> {user.country && user.country.countryName} </p>
          <div className={editFull ? "d-inline col-12 col-md-6 py-2 " : 'd-none'} >
          <select id="country" name="country" className="p-2 search w-100" value={country}
            onChange={(event) => countryChangeHandler(event.target.value)}>
            <option value="" className='text-secondary'>Countries</option>
            {countries.map((country) => (
              <option value={country._id} key={country._id}>{country.countryName}</option>
            ))}
          </select>
          </div>

        </div>
        {/* /////////////////////// */}
        <div className="col-12 col-md-6 row p-2 ">
          <h5 className="col-10 col-md-5  edit-form-lable text-start p-2 fw-bold"> User Role :</h5>
          <p className={!editFull ? "d-inline col-12 col-md-6 py-2 edit-form-p fw-bold details-data" : 'd-none'}> {user.user_role} </p>
          <div className={editFull ? "d-inline col-12 col-md-6 py-2 " : 'd-none'} >
            <select id="role" name="role" className="search w-100 p-2" value={userRole}
              onChange={(e) => { setUserRole(e.target.value); if (e.target.value == 'specialistService') { setVisable(true); setEditSpeciality(true) } else { setVisable(false) } }} >
              <option value="" className='text-secondary'>Role</option>
              <option value="admin">Admin</option>
              <option value="customerService">customerService</option>
              <option value="specialistService">specialistService</option>
            </select>
          </div>
        </div>
        {/* /////////////////////// */}
        <div className={visable ? "d-flex col-12 col-md-6 row p-2 " : 'd-none'}>
          <h5 className="col-10 col-md-5  edit-form-lable text-start p-2 fw-bold">Speciality :</h5>
          <p className={!editFull ? "d-inline col-12 col-md-6 py-2 edit-form-p fw-bold details-data" : 'd-none'}>{user.speciality && user.speciality.sub_speciality}</p>

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


        <div className="col-12  p-3">
          {!editFull ? user.user_role == 'admin' ?
            ''
            :
            <button
              className="edit-user-btn p-3 col-10 col-lg-4 fw-bold"
              // onClick={editUserHandler}
              onClick={() => { setEditFull(!editFull) }}
            >
              Edit
            </button> : ''
          }
          {editFull ? user.user_role == 'admin' ?
            ''
            :
            <>
              <button
                disabled={
                  !fullNameState.isvalid &&
                  !userNameState.isvalid &&
                  !userRole &&
                  !country&&
                  !numberState.isvalid &&
                  !userSpeciality
                }
                className="edit-user-btn p-3 col-8 col-lg-4 fw-bold"
                onClick={editUserHandler}
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
          <h4 className="text-center col-4 fw-bold">{user.tasksCount}</h4>
        </div>
        <div className="bg-white adduser-form col-11 col-sm-5 col-lg-3 col-xl-2 p-2 row m-2">
          <h6 className="text-secondary fw-bold col-8 pt-3 text-start">Completed Count </h6>
          <div className="bg-info col-4 icon p-3"><AiOutlineFileDone className="fs-3" /></div>
          <h4 className="text-center col-4 fw-bold">{user.completedCount}</h4>
        </div>
        {user.user_role == 'userB' ?
          <div className="bg-white adduser-form col-11 col-sm-5 col-lg-3 col-xl-2 p-2 row m-2">
            <h6 className="text-secondary fw-bold col-8 pt-3 text-start">Total Cost </h6>
            <div className="bg-success col-4 icon p-3"><GiPayMoney className="fs-3 " /></div>
            <h4 className="text-center col-4 fw-bold">{user.totalCost}</h4>
          </div>
          :
          <div className="bg-white adduser-form col-11 col-sm-5 col-lg-3 col-xl-2 p-2 row m-2">
            <h6 className="text-secondary fw-bold col-8 pt-3 text-start">Total Gain </h6>
            <div className="bg-success col-4 icon p-3"><FaCoins className="fs-3 " /></div>
            <h4 className="text-center col-4 fw-bold">{user.totalGain}</h4>
          </div>
        }
        <div className="bg-white adduser-form col-11 col-sm-5 col-lg-3 col-xl-2 p-2 row m-2">
          <h6 className="text-secondary fw-bold col-8 pt-3 text-start">Total Profit </h6>
          <div className="bg-danger col-4 icon p-3"><GiProfit className="fs-3" /></div>
          <h4 className="text-center col-4 fw-bold">{user.totalProfit}</h4>
        </div>

      </div>

      {/* /////////////////////////////////////////////////// */}


      <div className="row p-0 m-0 justify-content-center adduser-form">
        <div className="col-12 col-md-9 text-secondary row p-2">
          <h3 htmlFor="Speciality" className="my-2 col-12 text-center text-dark fw-bold">Filter:</h3>
          <label htmlFor="Speciality" className="mt-2 col-4 col-sm-2 text-start"> <FiFilter className="" /> From:</label>
          <input type="date" className="search col-8 col-sm-4  p-2 mt-1"
            onChange={(e) => { setStart(e.target.value); setDateFilterData(true); setwithoutFilterData(false) }}
          />
          <label htmlFor="Speciality" className="mt-2 col-4 col-sm-2 text-start"> <FiFilter className="" />To:</label>
          <input type="date" className="search col-8 col-sm-4  p-2 mt-1"
            onChange={(e) => { setEnd(e.target.value); setDateFilterData(true); setwithoutFilterData(false) }}
          />
        </div>

      </div>

      <div className="row analysis-tasks adduser-form p-1 py-3 m-1 justify-content-center">
        {withoutFilterData ? userTasks && !userTasks.length == 0 ? userTasks.map((task) => (
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
            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Title :</span> {task.title}</p>
            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Speciality :</span> {task.speciality.specialityName}</p>
            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Client :</span> {task.client.clientname}</p>
            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Created By :</span> {task.created_by && task.created_by.fullname}</p>
            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Deadline :</span> {task.deadline.split('T')[0]}</p>
            {task.freelancer &&
              <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Freelancer :</span> {task.freelancer.freelancername}</p>
            }
          </div>
        )) :
          <div className="row col-12  p-2 text-center">
            <h3 className=" text-danger edit-form-lable">This User Didn't Do Any Tasks Yet</h3>
          </div> :''
        }
        {dateFilterData ? DateFilter && !DateFilter.length == 0 ? DateFilter.map((task) => (
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

            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Title :</span> {task.title}</p>
            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Speciality :</span> {task.speciality.specialityName}</p>
            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Client :</span> {task.client.clientname}</p>
            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Created By :</span> {task.created_by && task.created_by.fullname}</p>
            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Deadline :</span> {task.deadline.split('T')[0]}</p>
            {task.freelancer &&
              <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Freelancer :</span> {task.freelancer.freelancername}</p>
            }
          </div>
        )) :
          <div className="row col-12  p-2 text-center">
            <h3 className=" text-danger edit-form-lable">This User Didn't Do Any Tasks Yet</h3>
          </div> :''
        }
      </div>

    </div>
  )
}

export default UserDetails
