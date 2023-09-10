import React, { useEffect, useState } from "react";
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
import { MdPendingActions } from 'react-icons/md';
import { MdRateReview } from 'react-icons/md';
import { BiSolidOffer } from 'react-icons/bi';
import { GiProgression } from 'react-icons/gi';
import { AiOutlineFileDone } from 'react-icons/ai';
import { TbTruckDelivery } from 'react-icons/tb';
import { GiProfit} from 'react-icons/gi';
import { GiPayMoney} from 'react-icons/gi';

const UserDetails = () => {

  const [visable, setVisable] = useState(false);

  const [editFull, setEditFull] = useState(false);
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


  const [userTasks, setUserTasks] = useState([]);

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios.get(`http://localhost:5000/api/user/${id}`).then((res) => {
          setUser(res.data.user);
          // setTasksCount(res.data.tasksCount)
          // setTotalCost(res.data.totalCost)
          // setTotalGain(res.data.totalGain)
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
        <h2 className="col-12 col-lg-7 text-center system-head p-2 pt-4">  User Details</h2>
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
          <div className={editFull ? "d-inline col-10 col-md-5 pt-2" : 'd-none'} >
            <input type="text" onChange={(e) => { setFullName(e.target.value) }} className="search w-100 p-2" />
          </div>

          {/* {user.user_role == 'admin' ?
            ''
            :
            <div className="col-1 ">
              <button onClick={() => { setEditFull(!editFull) }} className="edit-btn fs-2">
                <BiSolidEditAlt />
              </button>
            </div>
          } */}
        </div>
        {/* /////////////////////// */}

        <div className="col-12 col-md-6  row py-2 ">
          <h5 className="col-10 col-md-5  edit-form-lable text-start pt-3"> User Name:</h5>
          <p className={!editFull ? "d-inline col-10 col-md-5 pt-3 edit-form-p fw-bold name" : 'd-none'}> {user.username} </p>
          <div className={editFull ? "d-inline col-10 col-md-5  pt-2" : 'd-none'} >
            <input type="text" onChange={(e) => { setUserName(e.target.value) }} className="search w-100 p-2" />
          </div>

        </div>
        {/* /////////////////////// */}
        <div className="col-12 col-md-6  row p-2 ">
          <h5 className="col-10 col-md-5  edit-form-lable text-start pt-3"> Phone :</h5>
          <p className={!editFull ? "d-inline col-10 col-md-5 pt-3 edit-form-p fw-bold" : 'd-none'}> {user.phone} </p>
          <div className={editFull ? "d-inline col-10 col-md-5 pt-2 " : 'd-none'} >
            <input type="text" onChange={(e) => { setPhone(e.target.value) }} className="search w-100 p-2" />
          </div>

        </div>
        {/* /////////////////////// */}
        <div className="col-12 col-md-6  row p-2 ">
          <h5 className="col-10 col-md-5  edit-form-lable text-start pt-3"> Country :</h5>
          <p className={!editFull ? "d-inline col-10 col-md-5 pt-3 edit-form-p fw-bold" : 'd-none'}> {user.country} </p>
          <div className={editFull ? "d-inline col-10 col-md-5 pt-2 " : 'd-none'} >
            <input type="text" onChange={(e) => { setCountry(e.target.value) }} className="search w-100 p-2" />
          </div>

        </div>
        {/* /////////////////////// */}
        <div className="col-12 col-md-6  row p-2 ">
          <h5 className="col-10 col-md-5  edit-form-lable text-start pt-3"> User Role :</h5>
          <p className={!editFull ? "d-inline col-10 col-md-5 pt-3 edit-form-p fw-bold" : 'd-none'}> {user.user_role} </p>
          <div className={editFull ? "d-inline col-10 col-md-5 pt-2 " : 'd-none'} >
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
        <div className={visable ? "d-flex col-12 col-md-6  row p-2 " : 'd-none'}>
          <h5 className="col-10 col-md-5  edit-form-lable text-start pt-3">Speciality :</h5>
          <p  className={!editFull ? "d-inline col-10 col-md-5 py-3 edit-form-p fw-bold" : 'd-none'}>{user.speciality && user.speciality.sub_speciality}</p>

          <div className={editFull ? "d-inline col-10 col-md-5 pt-3 " : 'd-none'} >
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
                  !fullName &&
                  !userName &&
                  !userRole &&
                  !country &&
                  !phone &&
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
            <h4 className="text-center col-4 fw-bold">{user.totalCost }</h4>
          </div>
          :
          <div className="bg-white adduser-form col-11 col-sm-5 col-lg-3 col-xl-2 p-2 row m-2">
            <h6 className="text-secondary fw-bold col-8 pt-3 text-start">Total Gain </h6>
            <div className="bg-success col-4 icon p-3"><FaCoins className="fs-3 " /></div>
            <h4 className="text-center col-4 fw-bold">{ user.totalGain }</h4>
          </div>
        }
        <div className="bg-white adduser-form col-11 col-sm-5 col-lg-3 col-xl-2 p-2 row m-2">
          <h6 className="text-secondary fw-bold col-8 pt-3 text-start">Total Profit </h6>
          <div className="bg-danger col-4 icon p-3"><GiProfit className="fs-3" /></div>
          <h4 className="text-center col-4 fw-bold">{ user.totalProfit }</h4>
        </div>

      </div>

      {/* /////////////////////////////////////////////////// */}

      <div className="row analysis-tasks adduser-form p-1 py-3 m-1 justify-content-center">
        {userTasks && !userTasks.length == 0 ? userTasks.map((task) => (
          <div key={task._id} className="task-card bg-white p-2 py-3 row users-data col-11 my-1 text-start">

            <div className="col-12 fw-bold row text-center">

              <span
                className={
                  task.taskStatus.statusname == 'pending' ? 'bg-warning p-3 status col-12 ' :
                    task.taskStatus.statusname == 'admin review' ? 'bg-danger   p-3 status col-12 ' :
                      task.taskStatus.statusname == 'in negotiation' ? 'bg-info   p-3 status col-12 ' :
                        task.taskStatus.statusname == 'in progress' ? 'bg-primary   p-3 status col-12 ' :
                          task.taskStatus.statusname == 'completed' ? 'bg-success   p-3 status col-12 ' :
                            task.taskStatus.statusname == 'delivered to client' ? 'bg-secondary  p-3 status col-12' :
                              'anystatus  p-3 status col-12 '
                }>
                {
                  task.taskStatus.statusname == 'pending' ?
                    <MdPendingActions />
                    :
                    task.taskStatus.statusname == 'admin review' ?
                      <MdRateReview />
                      :
                      task.taskStatus.statusname == 'in negotiation' ?
                        <BiSolidOffer />
                        :
                        task.taskStatus.statusname == 'in progress' ?
                          <GiProgression />
                          :
                          task.taskStatus.statusname == 'completed' ?
                            <AiOutlineFileDone />
                            :
                            task.taskStatus.statusname == 'delivered to client' ?
                              <TbTruckDelivery />
                              :
                              ''
                }
                {task.taskStatus.statusname}
              </span>

            </div>

            <p className="col-12 text-end  fs-5 "> <a className="view-details fs-4" href={`/task/${task._id}`}><BsFillFolderSymlinkFill /></a> </p>

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
          </div>
        }
      </div>

    </div>
  )
}

export default UserDetails
