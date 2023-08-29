import React, { useEffect, useState, useReducer } from 'react'
import { validate, VALIDATOR_MINLENGTH } from "../../../../util/validators";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";

import { useParams } from "react-router-dom";
import { RiDeleteBinFill } from 'react-icons/ri';
import { TiArrowBack } from 'react-icons/ti';
import { MdPendingActions } from 'react-icons/md';
import { MdRateReview } from 'react-icons/md';
import { BiSolidOffer } from 'react-icons/bi';
import { GiProgression } from 'react-icons/gi';
import { AiOutlineFileDone } from 'react-icons/ai';
import { TbTruckDelivery } from 'react-icons/tb';
import { FaCheck } from 'react-icons/fa';
import { CgClose } from 'react-icons/cg';

import GetCookie from "../../../../hooks/getCookie";


const TaskDetails = () => {
  const token = GetCookie("UserA")

  const [editName, setEditName] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  let { id } = useParams();

  const [task, setTask] = useState([]);
  const [offer, setOffer] = useState('');
  const [client, setClient] = useState([]);
  const [speciality, setSpeciality] = useState([]);
  const [status, setStatus] = useState([]);
  const [currency, setCurrency] = useState([]);

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios.get(`http://localhost:5000/api/task/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
          setTask(res.data.task);
          setOffer(res.data.offer)
          setClient(res.data.task.client)
          setCurrency(res.data.task.task_currency)
          setSpeciality(res.data.task.speciality)
          setStatus(res.data.task.taskStatus)
          console.log(res.data)
        });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);


  //////////////////////////////////////


  //delete task 
  const deleteTaskHandler = async () => {
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.delete(
        ` http://localhost:5000/api/task/${id}`
        ,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
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


  //accept Task Handler 
  const acceptTaskHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        `http://localhost:5000/api/task/confirm/${id}`,
        {}, { headers: { Authorization: `Bearer ${token}` } }
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
      setError(err.message && "SomeThing Went Wrong , Please Try Again .");
    }
  };

  //not accept Task Handler 
  const notAcceptTaskHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        `http://localhost:5000/api/task/refuse/${id}`,
        {}, { headers: { Authorization: `Bearer ${token}` } }
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
      setError(err.message && "SomeThing Went Wrong , Please Try Again .");
    }
  };

  // task completed 

  const taskCompleted = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        `http://localhost:5000/api/task/complete/${id}`,
        {}, { headers: { Authorization: `Bearer ${token}` } }
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
      setError(err.message && "SomeThing Went Wrong , Please Try Again .");
    }
  };

  // task delivered 

  const taskDelivered = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        `http://localhost:5000/api/task/deliver/${id}`,
        {}, { headers: { Authorization: `Bearer ${token}` } }
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
      setError(err.message && "SomeThing Went Wrong , Please Try Again .");
    }
  };
  //error message
  const errorHandler = () => {
    setError(null);
    window.location.reload(true);
  };

  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="text-center row w-100 p-4 m-0">
      <ErrorModal error={error} onClear={errorHandler} />

      <div className="row mb-4">
        <div className="col-3 text-center">
          <button className="back-btn p-2 px-3 fs-3 " onClick={() => { window.location.href = '/' }}><TiArrowBack /> </button>
        </div>
        <h2 className="col-12 col-lg-7 text-center edit-form-lable p-0">  Task Details</h2>
      </div>

      <div className="row bg-white adduser-form p-1 m-1 justify-content-center">

        <div className="col-12 row p-3 justify-content-center">

          <div className="col-9 fw-bold pt-2 text-start">
            {
              status &&
              <span
                className={
                  status.statusname == 'pending' ? 'bg-warning  p-1 py-3 status ' :
                    status.statusname == 'admin review' ? 'bg-danger  p-1 py-3 status ' :
                      status.statusname == 'in negotiation' ? 'bg-info  p-1 py-3 status ' :
                        status.statusname == 'in progress' ? 'bg-primary  p-1 py-3 status ' :
                          status.statusname == 'completed' ? 'bg-success  p-1 py-3 status ' :
                            status.statusname == 'delivered to client' ? 'bg-secondary  p-1 py-3 status ' :
                              'anystatus p-1 py-3 status '
                }>
                {
                  status.statusname == 'pending' ?
                    <MdPendingActions />
                    :
                    status.statusname == 'admin review' ?
                      <MdRateReview />
                      :
                      status.statusname == 'in negotiation' ?
                        <BiSolidOffer />
                        :
                        status.statusname == 'in progress' ?
                          <GiProgression />
                          :
                          status.statusname == 'completed' ?
                            <AiOutlineFileDone />
                            :
                            status.statusname == 'delivered to client' ?
                              <TbTruckDelivery />
                              :
                              ''
                }
                {status.statusname}
              </span>
            }
          </div>
          <div className="col-3">
            <button className="delete-btn px-3 p-1 fs-4" onClick={deleteTaskHandler}>
              <RiDeleteBinFill />
            </button>
          </div>
        </div>
        {/* /////////////////////// */}
        <div className="col-12 col-md-6 col-lg-4 row">
          <h4 className="col-7 col-md-4 edit-form-lable text-start pt-3">  Title :</h4>
          <p className="d-inline col-5 col-md-8  pt-3 edit-form-p fw-bold "> {task.title} </p>
        </div>
        <div className="col-12 col-md-6 col-lg-4 row ">
          <h4 className="col-7 edit-form-lable text-start pt-3">  Speciality :</h4>
          <p className="d-inline col-5  pt-3 edit-form-p fw-bold "> {speciality.specialityName} </p>
        </div>
        <div className="col-12 col-md-6 col-lg-4 row ">
          <h4 className="col-12 col-sm-7 edit-form-lable text-start pt-3">  Dead Line :</h4>
          <p className="d-inline col-12 col-sm-5  pt-3 edit-form-p fw-bold "> {task.deadline && task.deadline.split('T')[0]} </p>
        </div>
        <div className="col-12 col-md-6 col-lg-4 row ">
          <h4 className="col-7 edit-form-lable text-start pt-3">  Channel :</h4>
          <p className="d-inline col-5  pt-3 edit-form-p fw-bold "> {task.channel} </p>
        </div>
        <div className="col-12 col-md-6 col-lg-3 row ">
          <h4 className="col-7 col-md-6 edit-form-lable text-start pt-3">  Client :</h4>
          <p className="d-inline col-5 col-md-6  pt-3 edit-form-p fw-bold "> {client.clientname} </p>
        </div>
        <div className="col-12 col-md-6 col-lg-5 row ">
          <h5 className="col-12 col-sm-6 edit-form-lable text-start pt-3">  Client Email:</h5>
          <p className="d-inline col-12 col-sm-6 pt-3 edit-form-p fw-bold "> {client.email} </p>
        </div>
        <div className="col-12 col-md-6 col-lg-5 row ">
          <h5 className="col-8 col-md-6 edit-form-lable text-start pt-3">  Client Price:</h5>
          <p className="d-inline col-4 col-md-6 pt-3 edit-form-p fw-bold "> {task.paid} </p>
        </div>
        <div className="col-12 col-md-6 col-lg-4 row ">
          <h4 className="col-7 col-md-6 edit-form-lable text-start pt-3">  Currency:</h4>
          <p className="d-inline col-5 col-md-6  pt-3 edit-form-p fw-bold "> {currency.currencyname} </p>
        </div>

        <div className="col-12 row ">
          {/* <hr></hr> */}
          <h4 className="col-md-3 col-12 edit-form-lable text-start pt-3">  Description :</h4>
          <p className="d-inline col-md-9 col-12  pt-3 edit-form-p fw-bold freelanceremail"> {task.description} </p>
        </div>
        {/* /////////////////////// */}

      </div>

      {status.statusname == 'in negotiation' &&
        <div className="row bg-white adduser-form p-3 m-1 justify-content-center">
          <h4 className="text-start py-3 edit-form-lable">Task Is In Negotiation .. Waiting To Accept The Offer To Start : </h4>

          <div className='row col-12 col-md-6 p-4'>
            <h4 className="col-12 col-sm-6  edit-form-lable">  The Offer:</h4>
            <p className="col-12  col-sm-6 edit-form-p fw-bold "> {offer} </p>
          </div>

          <div className='col-12 col-md-6'>
            <button className='accept-btn p-3 mx-3' onClick={acceptTaskHandler}>
              <FaCheck className='fs-3' />
            </button>
            <button className=' p-3 cansle-btn delete-btn mx-3' onClick={notAcceptTaskHandler}>
              <CgClose className='fs-3' />
            </button>
          </div>

        </div>}

      {status.statusname == 'in progress' &&
        <div className="row bg-white adduser-form p-1 m-1 justify-content-center">
          <h2 className="text-start py-3 edit-form-lable">Task Is in Progress .. If It Finished Click Here : </h2>

          <div className="col-12 col-sm-7  p-3">
            <button
              className="edit-user-btn p-3 col-10 col-lg-4 fw-bold"
              onClick={taskCompleted}
            >
              Completed
            </button>
          </div>
        </div>}

      {status.statusname == 'completed' &&
        <div className="row bg-white adduser-form p-3 m-1 justify-content-center">
          <h4 className="text-start py-3 edit-form-lable">Task Is Completed .. When It Delivered Click Here : </h4>

          <div className="col-12 col-sm-7  p-3">
            <button
              className="edit-user-btn p-3 col-10 col-lg-4 fw-bold"
              onClick={taskDelivered}
            >
              Task Delivered
            </button>
          </div>
        </div>}


    </div>
  )
}

export default TaskDetails
