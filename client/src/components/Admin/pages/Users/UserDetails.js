import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";

import { useParams } from "react-router-dom";
import { BiSolidEditAlt } from 'react-icons/bi';
import { RiDeleteBinFill } from 'react-icons/ri';
import { TiArrowBack } from 'react-icons/ti';
import { FaTasks } from 'react-icons/fa';
import { FaCoins } from 'react-icons/fa';
import { TbListDetails } from 'react-icons/tb';



const UserDetails = () => {

  const [visable, setVisable] = useState(false);

  const [editFull, setEditFull] = useState(false);
  const [editUser, setEditUser] = useState(false);
  const [editNumber, setEditNumber] = useState(false);
  const [editCountry, setEditCountry] = useState(false);

  const [editRole, setEditRole] = useState(false);
  const [editSpeciality, setEditSpeciality] = useState(false);



  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  let { id } = useParams();

  const [user, setUser] = useState([]);
  const [fullName, setFullName] = useState();
  const [userName, setUserName] = useState();
  const [userRole, setUserRole] = useState();
  const [country, setCountry] = useState();
  const [phone, setPhone] = useState();
  const [userSpeciality, setUserSpeciality] = useState();

  const [specialityId, setspecialityId] = useState();
  const [specialities, setSpecialities] = useState([]);

  const [tasksCount, setTasksCount] = useState();
  const [totalCost, setTotalCost] = useState();
  const [totalGain, setTotalGain] = useState();

  const [userTasks, setUserTasks] = useState([]);

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios.get(`http://localhost:5000/api/user/${id}`).then((res) => {
          setUser(res.data.user);
          setTasksCount(res.data.tasksCount)
          setTotalCost(res.data.totalCost)
          setTotalGain(res.data.totalGain)
          setUserTasks(res.data.userTasks)

          setFullName(res.data.user.fullname);
          setUserName(res.data.user.username);
          setUserRole(res.data.user.user_role);
          setCountry(res.data.user.country);
          setPhone(res.data.user.phone);
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
        await axios.get("http://localhost:5000/api/speciality/").then((res) => {
          setSpecialities(res.data.specialities);
        });
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);


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
        `http://localhost:5000/api/user/${user._id}`,
        {
          fullName: fullName,
          userName: userName,
          userRole: userRole,
          speciality: userSpeciality,
          country: country,
          phone: phone,
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
        ` http://localhost:5000/api/user/${id}`
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

  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="text-center row w-100 p-2 m-0">
      <ErrorModal error={error} onClear={errorHandler} />

      <div className="row mb-2">
        <div className="col-3 text-center">
          <button className="back-btn p-2 px-3 fs-3 " onClick={() => { window.location.href = '/' }}><TiArrowBack /> </button>
        </div>
        <h2 className="col-12 col-lg-7 text-center edit-form-lable p-2 pt-4">  User Details</h2>
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
        <div className="col-12 col-md-6  row ">
          <h5 className="col-10 col-md-5 edit-form-lable text-start pt-3"> Full Name :</h5>
          <p className={!editFull ? "d-inline col-10 col-md-5 pt-3 edit-form-p fw-bold name" : 'd-none'}> {user.fullname} </p>
          <div className={editFull ? "d-inline col-10 col-md-5 pt-3 " : 'd-none'} >
            <input type="text" onChange={(e) => { setFullName(e.target.value) }} className="search w-100 p-2" />
          </div>

          {user.user_role == 'admin' ?
            ''
            :
            <div className="col-1 ">
              <button onClick={() => { setEditFull(!editFull) }} className="edit-btn fs-2">
                <BiSolidEditAlt />
              </button>
            </div>
          }
        </div>
        {/* /////////////////////// */}

        <div className="col-12 col-md-6  row p-2 ">
          <h5 className="col-10 col-md-5  edit-form-lable text-start pt-3"> User Name:</h5>
          <p className={!editUser ? "d-inline col-10 col-md-5 pt-3 edit-form-p fw-bold name" : 'd-none'}> {user.username} </p>
          <div className={editUser ? "d-inline col-10 col-md-5 pt-3 " : 'd-none'} >
            <input type="text" onChange={(e) => { setUserName(e.target.value) }} className="search w-100 p-2" />
          </div>
          {user.user_role == 'admin' ?
            ''
            :
            <div className="col-1 ">
              <button onClick={() => { setEditUser(!editUser) }} className="edit-btn fs-2">
                <BiSolidEditAlt />
              </button>
            </div>}
        </div>
        {/* /////////////////////// */}
        <div className="col-12 col-md-6  row p-2 ">
          <h5 className="col-10 col-md-5  edit-form-lable text-start pt-3"> Phone :</h5>
          <p className={!editNumber ? "d-inline col-10 col-md-5 pt-3 edit-form-p fw-bold" : 'd-none'}> {user.phone} </p>
          <div className={editNumber ? "d-inline col-10 col-md-5 pt-3 " : 'd-none'} >
            <input type="text" onChange={(e) => { setPhone(e.target.value) }} className="search w-100 p-2" />
          </div>

          {user.user_role == 'admin' ?
            ''
            :
            <div className="col-1 ">
              <button onClick={() => { setEditNumber(!editNumber) }} className="edit-btn fs-2">
                <BiSolidEditAlt />
              </button>
            </div>}

        </div>
        {/* /////////////////////// */}
        <div className="col-12 col-md-6  row p-2 ">
          <h5 className="col-10 col-md-5  edit-form-lable text-start pt-3"> Country :</h5>
          <p className={!editCountry ? "d-inline col-10 col-md-5 pt-3 edit-form-p fw-bold" : 'd-none'}> {user.country} </p>
          <div className={editCountry ? "d-inline col-10 col-md-5 pt-3 " : 'd-none'} >
            <input type="text" onChange={(e) => { setCountry(e.target.value) }} className="search w-100 p-2" />
          </div>
          {user.user_role == 'admin' ?
            ''
            :
            <div className="col-1 ">
              <button onClick={() => { setEditCountry(!editCountry) }} className="edit-btn fs-2">
                <BiSolidEditAlt />
              </button>
            </div>
          }
        </div>
        {/* /////////////////////// */}
        <div className="col-12 col-md-6  row p-2 ">
          <h5 className="col-10 col-md-5  edit-form-lable text-start pt-3"> User Role :</h5>
          <p className={!editRole ? "d-inline col-10 col-md-5 pt-3 edit-form-p fw-bold" : 'd-none'}> {user.user_role} </p>
          <div className={editRole ? "d-inline col-10 col-md-5 pt-3 " : 'd-none'} >
            <select id="role" name="role" className="search w-100 p-2" value={userRole}
              onChange={(e) => { setUserRole(e.target.value); if (e.target.value == 'userB') { setVisable(true); setEditSpeciality(true) } else { setVisable(false) } }} >
              <option value="" className='text-secondary'>Role</option>
              <option value="admin">Admin</option>
              <option value="userA">UserA</option>
              <option value="userB">UserB</option>
            </select>
          </div>
          {user.user_role == 'admin' ?
            ''
            :
            <div className="col-1 ">
              <button onClick={() => { setEditRole(!editRole); if (user.user_role == 'userB') { setVisable(true) } else { setVisable(false) }; setUserRole(user.user_role) }} className="edit-btn fs-2">
                <BiSolidEditAlt />
              </button>
            </div>
          }
        </div>
        {/* /////////////////////// */}
        <div className={visable ? "d-flex col-12 col-md-6  row p-2 " : 'd-none'}>
          <h5 className="col-10 col-md-5  edit-form-lable text-start pt-3">Speciality :</h5>
          {specialities.map((speciality) => (
            speciality._id == specialityId ?
              <p key={speciality._id} className={!editSpeciality ? "d-inline col-10 col-md-5 py-3 edit-form-p fw-bold" : 'd-none'}>{speciality.specialityName}</p>
              : ''
          ))}
          <div className={editSpeciality ? "d-inline col-10 col-md-5 pt-3 " : 'd-none'} >
            <select id="speciality" name="speciality" className="p-2 px-4 search col-12" value={userSpeciality}
              onChange={(event) => specialityChangeHandler(event.target.value)}>
              <option value="" className='text-secondary'>Specialities</option>
              {specialities.map((speciality) => (
                <option value={speciality._id} key={speciality._id}>{speciality.specialityName}</option>
              ))}
            </select>
          </div>
          {user.user_role == 'admin' ?
            ''
            :
            <div className="col-1 ">
              <button onClick={() => { if (user.speciality) { setEditSpeciality(!editSpeciality) } else { setEditSpeciality(true) } }} className="edit-btn fs-2">
                <BiSolidEditAlt />
              </button>
            </div>}
        </div>
        {/* /////////////////////// */}


        <div className="col-12  p-3">
          {user.user_role == 'admin' ?
            ''
            :
            <button
              disabled={
                !editFull &&
                !editUser &&
                !editNumber &&
                !editRole &&
                !editSpeciality &&
                !editCountry
              }
              className="edit-user-btn p-3 col-10 col-lg-4 fw-bold" onClick={editUserHandler}>
              Edit
            </button>
          }
        </div>

      </div>
      <div className="row analysis adduser-form p-1 py-3 m-1 justify-content-center">
        <div className="bg-white adduser-form col-11 col-sm-5 col-lg-3 col-xl-2 p-2 row m-2">
          <h6 className="text-secondary fw-bold col-8 pt-3 text-start">Tasks Count </h6>
          <div className="bg-info col-4 icon p-3"><FaTasks className="fs-3" /></div>
          <h4 className="text-center col-4 fw-bold">{tasksCount ? tasksCount : '0'}</h4>
        </div>
        {user.user_role == 'userB'?
        <div className="bg-white adduser-form col-11 col-sm-5 col-lg-3 col-xl-2 p-2 row m-2">
          <h6 className="text-secondary fw-bold col-8 pt-3 text-start">Total Cost </h6>
          <div className="bg-success col-4 icon p-3"><FaCoins className="fs-3 " /></div>
          <h4 className="text-center col-4 fw-bold">{totalCost ? totalCost : '0'}</h4>
        </div>
         : 
        <div className="bg-white adduser-form col-11 col-sm-5 col-lg-3 col-xl-2 p-2 row m-2">
          <h6 className="text-secondary fw-bold col-8 pt-3 text-start">Total Gain </h6>
          <div className="bg-success col-4 icon p-3"><FaCoins className="fs-3 " /></div>
          <h4 className="text-center col-4 fw-bold">{totalGain ? totalGain : '0'}</h4>
        </div>       
        }

      </div>

      <div className="row analysis-tasks adduser-form p-1 py-3 m-1 justify-content-center">
        {userTasks && !userTasks.length == 0 ? userTasks.map((task) => (
          <div key={task._id} className="bg-white adduser-form p-4 row m-2 col-10">

            <div className="col-12 justify-content-end row p-0 m-0">
              <div className="bg-primary icon p-3 col-4 col-md-2 col-lg-1 ">
                <TbListDetails className="fs-2  " />
              </div>
            </div>

            <div className="row col-12 col-xl-5 p-2 text-start ">
              <h3 className="col-12 col-md-5 col-xl-7 text-danger edit-form-lable ">Task Details:</h3>
              <div className="col-12 col-md-3 col-xl-5 pt-2 text-end text-md-start">
                <a href={`/task/${task._id}`} className="text-dark fw-bold">Click Here </a>
              </div>
            </div>

            <div className="row col-12 col-md-6 col-xl-4 p-2 text-start">
              <h3 className="col-12 col-md-7 text-danger edit-form-lable">Task Title:</h3>
              <p className="col-12 col-md-5 text-dark fw-bold pt-1 text-end text-md-start">{task.title} </p>
            </div>

            <div className="row col-12 col-md-6 col-xl-3 p-2 text-start">
              <h3 className="col-10 col-md-9 text-danger edit-form-lable ">Task Price:</h3>
              <p className="col-2 col-md-3 text-dark fw-bold pt-1 text-end text-md-start">{task.paid * task.task_currency.priceToEGP} </p>
            </div>

          </div>
        )) : 
        <div className="row col-12  p-2 text-center">
          <h3 className=" text-danger edit-form-lable">This User Didn't Do Any Tasks Yet</h3>
        </div>
        }
      </div>

    </div>
  )
}

export default UserDetails
