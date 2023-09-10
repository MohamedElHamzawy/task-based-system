import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";

import { useParams } from "react-router-dom";
import { RiDeleteBinFill } from 'react-icons/ri';
import { TiArrowBack } from 'react-icons/ti';
import { FaTasks } from 'react-icons/fa';
import { FaCoins } from 'react-icons/fa';
import { FaCcVisa } from 'react-icons/fa';
import { ImCancelCircle } from 'react-icons/im';
import { TbListDetails } from 'react-icons/tb';
import { BsFillFolderSymlinkFill } from 'react-icons/bs';
import { MdPendingActions } from 'react-icons/md';
import { MdRateReview } from 'react-icons/md';
import { BiSolidOffer } from 'react-icons/bi';
import { GiProgression } from 'react-icons/gi';
import { AiOutlineFileDone } from 'react-icons/ai';
import { TbTruckDelivery } from 'react-icons/tb';
import { GiProfit} from 'react-icons/gi';

const ClientDetails = () => {

  const [edit, setEdit] = useState(false);

  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  let { id } = useParams();

  const [client, setClient] = useState([]);
  const [clientName, setClientName] = useState();
  const [clientEmail, setClientEmail] = useState();
  const [country, setCountry] = useState();
  const [city, setCity] = useState();
  const [phone, setPhone] = useState();

  const [tasksCount, setTasksCount] = useState();
  const [clientAccount, setClientAccount] = useState();
  const [totalGain, setTotalGain] = useState();

  const [clientTasks, setClientTasks] = useState([]);

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios.get(`http://localhost:5000/api/client/${id}`).then((res) => {
          setClient(res.data.client);

          setTasksCount(res.data.tasksCount)
          setTotalGain(res.data.totalGain)
          setClientTasks(res.data.clientTasks)
          setClientAccount(res.data.clientAccount)

          console.log(res.data)
        });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  //////////////////////////////////////
  const editClientHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        `http://localhost:5000/api/client/${client._id}`,
        {
          clientName: clientName,
          email: clientEmail,
          country: country,
          phone: phone,
          city: city
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
      setError(err.message && "SomeThing Went Wrong , Please Try Again .");
    }
  };

  //delete user 
  const deleteClientHandler = async () => {
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.delete(
        ` http://localhost:5000/api/client/${id}`
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
      window.location.href = '/clients';
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
    <div className="text-center row w-100 p-4 m-0">
      <ErrorModal error={error} onClear={errorHandler} />

      <div className="row mb-4">
        <div className="col-3 text-center">
          <button className="back-btn p-2 px-3 fs-3 " onClick={() => { window.location.href = '/clients' }}><TiArrowBack /> </button>
        </div>
        <h2 className="col-12 col-lg-7 text-center system-head p-2 pt-4">  Client Details</h2>
      </div>

      <div className="row bg-white adduser-form p-1 m-1 justify-content-start">

        <div className="col-12 row p-3 justify-content-end ">
          <div className="col-4">
            <button className="delete-btn px-4 p-1 fs-3" onClick={deleteClientHandler}>
              <RiDeleteBinFill />
            </button>
          </div>
        </div>
        {/* /////////////////////// */}
        <div className="col-12 col-lg-6 row ">
          <h3 className="col-10 col-md-5 edit-form-lable text-start pt-3"> Client Name:</h3>
          <p className={!edit ? "d-inline col-10 col-md-5 pt-3 edit-form-p fw-bold " : 'd-none'}> {client.clientname} </p>
          <div className={edit ? "d-inline col-10 col-md-5 pt-3 " : 'd-none'} >
            <input type="text" onChange={(e) => { setClientName(e.target.value) }} className="search w-100 p-2" />
          </div>
        </div>
        {/* /////////////////////// */}

        <div className="col-12 col-lg-6 row ">
          <h3 className="col-10 col-md-5  edit-form-lable text-start pt-3"> Client Email:</h3>
          <p className={!edit ? "d-inline col-10 col-md-5 pt-3 edit-form-p fw-bold" : 'd-none'}> {client.email} </p>
          <div className={edit ? "d-inline col-10 col-md-5 pt-3" : 'd-none'} >
            <input type="email" onChange={(e) => { setClientEmail(e.target.value) }} className="search w-100 p-2" />
          </div>
        </div>
        {/* /////////////////////// */}
        <div className="col-12 col-lg-6 row ">
          <h3 className="col-10 col-md-5  edit-form-lable text-start pt-3"> Phone:</h3>
          <p className={!edit ? "d-inline col-10 col-md-5 pt-3 edit-form-p fw-bold" : 'd-none'}> {client.phone} </p>
          <div className={edit ? "d-inline col-10 col-md-5 pt-3 " : 'd-none'} >
            <input type="text" onChange={(e) => { setPhone(e.target.value) }} className="search w-100 p-2" />
          </div>
        </div>
        {/* /////////////////////// */}
        <div className="col-12 col-md-6 row ">
          <h3 className="col-10 col-md-5  edit-form-lable text-start pt-3"> Country:</h3>
          <p className={!edit ? "d-inline col-10 col-md-5 pt-3 edit-form-p fw-bold" : 'd-none'}> {client.country} </p>
          <div className={edit ? "d-inline col-10 col-md-5  pt-3" : 'd-none'} >
            <input type="text" onChange={(e) => { setCountry(e.target.value) }} className="search w-100 p-2" />
          </div>
        </div>
        {/* /////////////////////// */}
        <div className="col-12 col-md-6 row  ">
          <h3 className="col-10 col-md-5  edit-form-lable text-start pt-3"> City :</h3>
          <p className={!edit ? "d-inline col-10 col-md-5 pt-3 edit-form-p fw-bold" : 'd-none'}> {client.city} </p>
          <div className={edit ? "d-inline col-10 col-md-5  pt-3" : 'd-none'} >
            <input type="text" onChange={(e) => { setCity(e.target.value) }} className="search w-100 p-2" />
          </div>
        </div>
        {/* /////////////////////// */}

        <div className="col-12  p-3">
          {!edit ?
            <button
              className="edit-user-btn p-3 col-10 col-lg-4 fw-bold"
              onClick={() => { setEdit(!edit) }}
            >
              Edit
            </button> : ''
          }
          {edit ?
            <>
              <button
                disabled={
                  !clientName &&
                  !clientEmail &&
                  !city &&
                  !country &&
                  !phone
                }
                className="edit-user-btn p-3 col-8 col-lg-4 fw-bold"
                onClick={editClientHandler}
              >
                Submit
              </button>
              <button
                className="bg-danger cancel-btn p-3 col-3 col-md-1 mx-2 fw-bold"
                onClick={() => { setEdit(!edit) }}
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
          <h4 className="text-center col-4 fw-bold">{client.tasksCount}</h4>
        </div>
        <div className="bg-white adduser-form col-11 col-sm-5 col-lg-3 col-xl-2 p-2 row m-2">
          <h6 className="text-secondary fw-bold col-8 pt-3 text-start">Completed Count </h6>
          <div className="bg-info col-4 icon p-3"><AiOutlineFileDone className="fs-3" /></div>
          <h4 className="text-center col-4 fw-bold">{client.completedCount}</h4>
        </div>
        <div className="bg-white adduser-form col-11 col-sm-5 col-lg-3 col-xl-2 p-2 row m-2">
          <h6 className="text-secondary fw-bold col-8 pt-3 text-start">Client Gain </h6>
          <div className="bg-success col-4 icon p-3"><FaCoins className="fs-3 " /></div>
          <h4 className="text-center col-4 fw-bold">{client.totalGain}</h4>
        </div>
        <div className="bg-white adduser-form col-11 col-sm-5 col-lg-3 col-xl-2 p-2 row m-2">
          <h6 className="text-secondary fw-bold col-8 pt-3 text-start">Total Profit </h6>
          <div className="bg-danger col-4 icon p-3"><GiProfit className="fs-3" /></div>
          <h4 className="text-center col-4 fw-bold">{client.totalProfit}</h4>
        </div>

        <div className="bg-white adduser-form col-11 col-sm-5 col-lg-3 col-xl-2 p-2 row m-2">
          <h6 className="text-secondary fw-bold col-8 pt-3 text-start">Account Details: </h6>
          <div className="bg-danger col-4 icon p-3"><FaCcVisa className="fs-3 " /></div>
          {clientAccount && clientAccount.map((acc) => (
            <div className="text-center col-8 fw-bold" key={acc._id}>
              <a href={`/account/${acc._id}`} className="text-dark fw-bold">Click Here </a>
            </div>
          ))}

        </div>
      </div>

      {/* /////////////////////////////////////////////////// */}

      <div className="row analysis-tasks adduser-form p-1 py-3 m-1 justify-content-center">
        {clientTasks && !clientTasks.length == 0 ? clientTasks.map((task) => (
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

export default ClientDetails
