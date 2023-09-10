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
import { IoMdRemoveCircle } from 'react-icons/io';

import GetCookie from "../../../../hooks/getCookie";
import FreelancerOffer from "./FreelancerOffer";


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
//Comment validation
const commentReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.comment,
        isvalid: validate(action.comment, action.validators),
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


const TaskDetails = () => {
  const token = GetCookie("AdminToken")
  const userId = JSON.parse(localStorage.getItem('AdminData'));
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  let { id } = useParams();

  const [task, setTask] = useState([]);
  const [offer, setOffer] = useState('');
  const [notes, setNotes] = useState([]);
  const [comments, setComments] = useState([]);
  const [client, setClient] = useState([]);
  const [speciality, setSpeciality] = useState([]);
  const [user, setUser] = useState([]);
  const [status, setStatus] = useState([]);
  const [currency, setCurrency] = useState([]);

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios.get(`http://localhost:5000/api/task/${id}`,
         { headers: { Authorization: `Bearer ${token}` } }
         ).then((res) => {
          setTask(res.data.task);
          setOffer(res.data.offer)
          setClient(res.data.task.client)
          setCurrency(res.data.task.task_currency)
          setSpeciality(res.data.task.speciality)
          setStatus(res.data.task.taskStatus)
          setUser(res.data.task.created_by)

          setNotes(res.data.notes)
          setComments(res.data.comments)
          console.log(res.data)
        });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);


  //////////////////////////////////////
  //percentage validation
  const [percentageState, dispatch] = useReducer(percentageReducer, {
    value: "",
    isvalid: false,
    isTouched: false,
  });

  const percentageChangeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      percentage: event.target.value,
      validators: [VALIDATOR_MINLENGTH(1)],
    });
  };
  const percentageTouchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  //delete user 
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
      window.location.href = '/tasks';
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "SomeThing Went Wrong , Please Try Again .");
    };
  }

  //Put Admin Percentage
  const putAdminPercentage = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        `http://localhost:5000/api/task/addPercentage/${id}`,
        {
          percentage: percentageState.value,
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
      setError(err.message && "SomeThing Went Wrong , Please Try Again .");
    }
  };
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

  //comment validation
  const [commentState, dispatch5] = useReducer(commentReducer, {
    value: "",
    isvalid: false,
    isTouched: false,
  });

  const commentChangeHandler = (event) => {
    dispatch5({
      type: "CHANGE",
      comment: event.target.value,
      validators: [VALIDATOR_MINLENGTH(3)],
    });
  };
  const commentTouchHandler = () => {
    dispatch5({
      type: "TOUCH",
    });
  };

  //add Comment
  const addCommentHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        `http://localhost:5000/api/comment/`,
        {
          content: commentState.value,
          task_id: task._id
        }
        , { headers: { Authorization: `Bearer ${token}` } }
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
  
  //delete Comment
  const deleteCommentHandler = async (commentId) => {
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.delete(
        ` http://localhost:5000/api/comment/`, {
       headers: {'Authorization': `Bearer ${token}`},
       data:{commentID: commentId}
        
      })
      const responseData = await response;
      setError(responseData.data.message);
      setIsLoading(false);
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
    <div className="text-center row w-100 m-0 justify-content-center">
      <ErrorModal error={error} onClear={errorHandler} />

      <div className="row mb-4 p-2">
        <div className="col-3 text-center">
          <button className="back-btn p-2 px-3 fs-3 " onClick={() => { window.location.href = '/tasks' }}><TiArrowBack /> </button>
        </div>
        <h2 className="col-12 col-lg-7 text-center system-head p-0">  Task Details</h2>
      </div>
      {/* ////////////////////////////////////////////// */}
      <div className='row co-12 col-lg-8 justify-content-center p-1 mx-1'>
        <div className="row bg-white adduser-form p-0 m-0 justify-content-start ">

          <div className="col-12 row p-3 justify-content-center">

            <div className="col-12 fw-bold pt-2 row text-center">
              {
                status &&
                <span
                  className={
                    status.statusname == 'pending' ? 'bg-warning  p-3 status col-12 ' :
                      status.statusname == 'admin review' ? 'bg-danger   p-3 status col-12 ' :
                        status.statusname == 'in negotiation' ? 'bg-info   p-3 status col-12 ' :
                          status.statusname == 'in progress' ? 'bg-primary   p-3 status col-12 ' :
                            status.statusname == 'completed' ? 'bg-success   p-3 status col-12 ' :
                              status.statusname == 'delivered to client' ? 'bg-secondary  p-3 status col-12 ' :
                                'anystatus  p-3 status col-12 '
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
            <div className="col-12 text-end py-2">
              <button className="delete-btn px-3 p-1 fs-4" onClick={deleteTaskHandler}>
                <RiDeleteBinFill />
              </button>
            </div>
          </div>
          {/* /////////////////////// */}
          <div className="col-12 col-md-6  row">
            <h5 className="col-6  edit-form-lable text-start pt-3">  Title :</h5>
            <p className="d-inline col-6  pt-3 edit-form-p fw-bold "> {task.title} </p>
          </div>
          <div className="col-12 col-md-6  row ">
            <h5 className="col-6 edit-form-lable text-start pt-3">  Speciality :</h5>
            <p className="d-inline col-6  pt-3 edit-form-p fw-bold "> {speciality.specialityName} </p>
          </div>
          <div className="col-12 col-md-6  row ">
            <h5 className="col-6  edit-form-lable text-start pt-3">  Dead Line :</h5>
            <p className="d-inline col-6   pt-3 edit-form-p fw-bold "> {task.deadline && task.deadline.split('T')[0]} </p>
          </div>
          <div className="col-12 col-md-6  row ">
            <h5 className="col-6 edit-form-lable text-start pt-3">  Channel :</h5>
            <p className="d-inline col-6  pt-3 edit-form-p fw-bold "> {task.channel} </p>
          </div>
          <div className="col-12 col-md-6  row ">
            <h5 className="col-6 edit-form-lable text-start pt-3">  Client :</h5>
            <p className="d-inline col-6  pt-3 edit-form-p fw-bold "> {client.clientname} </p>
          </div>
          <div className="col-12 col-md-6  row ">
            <h5 className="col-12 col-sm-6 edit-form-lable text-start pt-3">  Client Email:</h5>
            <p className="d-inline col-12 col-sm-6 pt-3 edit-form-p fw-bold "> {client.email} </p>
          </div>
          {status.statusname == 'in progress' || status.statusname == 'completed' || status.statusname == 'delivered to client' ?
            <div className='col-12 col-md-6  row'>
              <h5 className="col-6 edit-form-lable text-start pt-3">  Task Price:</h5>
              <p className="d-inline col-6 pt-3 edit-form-p fw-bold text-danger "> {task.paid*currency.priceToEGP}EGP </p>
            </div> 
          :  
          <>
            <div className='col-12 col-md-6  row'>
              <h5 className="col-6 edit-form-lable text-start pt-3">  Client Price:</h5>
              <p className="d-inline col-6 pt-3 edit-form-p fw-bold "> {task.paid} </p>
            </div>  
            <div className='col-12 col-md-6 row'>
              <h5 className="col-6 edit-form-lable text-start pt-3">  Currency:</h5>
              <p className="d-inline col-6  pt-3 edit-form-p fw-bold "> {currency.currencyname} </p>
            </div>
          </>
          }



          {status.statusname == 'admin review' || status.statusname == 'in negotiation' || status.statusname == 'in progress' || status.statusname == 'completed' || status.statusname == 'delivered to client' ?
            <div className="col-12 col-md-6  row ">
              <h5 className="col-12 col-sm-6  edit-form-lable text-start pt-3">  Freelancer Price:</h5>
              <p className="d-inline col-12  col-sm-6  pt-3 edit-form-p fw-bold text-danger "> {task.cost}EGP </p>
            </div> : ''
          }

          <div className="col-12 col-md-6 row " >
            <h5 className="col-6  edit-form-lable text-start pt-3">  Profit :</h5>
            <p className="d-inline col-6   pt-3 edit-form-p fw-bold text-danger"> {task.profit_percentage} %</p>
          </div>


          <div className="col-12 col-md-6  row ">
            <h5 className="col-12 col-sm-6 edit-form-lable text-start pt-3">  UserName :</h5>
            <p className="d-inline col-12 col-sm-6  pt-3 edit-form-p fw-bold "> {user && user.fullname} </p>
          </div>
          <div className="col-12 col-md-6  row ">
            <h5 className="col-6 edit-form-lable text-start pt-3">  UserRole :</h5>
            <p className="d-inline col-6  pt-3 edit-form-p fw-bold "> {user && user.user_role} </p>
          </div>
          {task.freelancer &&
            <>
              <div className="col-12 col-md-6 row ">
                <h5 className="col-12 col-sm-6 edit-form-lable text-start pt-3">  Freelancer :</h5>
                <p className="d-inline col-12 col-sm-6  pt-3 edit-form-p fw-bold "> {task.freelancer.freelancername} </p>
              </div>
              <div className="col-12 row ">
                <h5 className="col-12 col-sm-6 col-md-4 edit-form-lable text-start pt-3 ">  Freelancer Email:</h5>
                <p className="d-inline col-12 col-sm-3 pt-3 edit-form-p fw-bold  "> {task.freelancer.email} </p>
              </div>
            </>
          }

          <div className="col-12 row ">
            {/* <hr></hr> */}
            <h5 className="col-md-3 col-12 edit-form-lable text-start pt-3">  Description :</h5>
            <p className="d-inline col-md-9 col-12  pt-3 edit-form-p fw-bold "> {task.description} </p>
          </div>
          {/* /////////////////////// */}

        </div>

        {status.statusname == 'pending' &&
          <div className="row bg-white adduser-form p-1 m-1 justify-content-center">
            <h2 className="text-start py-3 edit-form-lable">Task is Pending .. Waiting To Choose Freelancer : </h2>
            <FreelancerOffer id={id} />
          </div>}

        {status.statusname == 'admin review' &&
          <div className="row bg-white adduser-form p-1 m-1 justify-content-center">
            <h2 className="text-start py-3 edit-form-lable">Task Status is Admin Review .. Waiting To Put Percentage : </h2>

            <div className='col-12 col-lg-7 pt-4 p-0'>

              <label className='col-12 col-lg-6 fw-bold add-user-p py-2'>Admin Percentage :</label>
              <input type='number' placeholder='Task Percentage '
                value={percentageState.value}
                onChange={percentageChangeHandler}
                onBlur={percentageTouchHandler}
                isvalid={percentageState.isvalid.toString()}
                className={`col-10 col-lg-4 search p-2 ${!percentageState.isvalid &&
                  percentageState.isTouched &&
                  "form-control-invalid"
                  }`}
              />
              <span className='col-1 px-2'>
                %
              </span>
            </div>

            <div className="col-12 col-sm-5  p-3">
              <button
                disabled={
                  !percentageState.value
                }
                className="edit-user-btn p-3 fw-bold"
                onClick={putAdminPercentage}
              >
                Add Percentage
              </button>
            </div>
          </div>}

        {status.statusname == 'in negotiation' &&
          <div className="row bg-white adduser-form p-3 m-1 justify-content-center">
            <h5 className="text-start py-3 edit-form-lable">Task Is In Negotiation .. Waiting To Accept The Offer To Start : </h5>

            <div className='row col-12 col-md-7 p-4'>
              <h5 className="col-12 col-sm-6  edit-form-lable">  The Offer:</h5>
              <p className="col-12  col-sm-6 edit-form-p fw-bold "> {offer} <span className='text-danger'>{currency.currencyname}</span> </p>
            </div>

            <div className='col-12 col-md-5'>
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
            <h5 className="text-start py-3 edit-form-lable">Task Is Completed .. When It Delivered Click Here : </h5>

            <div className="col-12 col-sm-7  p-3">
              <button
                className="edit-user-btn p-3 col-10 col-lg-6 fw-bold"
                onClick={taskDelivered}
              >
                Task Delivered
              </button>
            </div>
          </div>}

        <div className='row bg-white adduser-form p-3 my-2 justify-content-center'>
          <h1 className='edit-form-lable '>Comments</h1>
          <div className='row w-100 p-0 m-0'>
            {!comments.length == 0 ? comments.map((comment) => (

              <div className='comment text-start row p-2 pt-3 my-1' key={comment._id}>
                <h6 className='col-12 col-sm-4 edit-form-lable fw-bold '>{comment.user_id && comment.user_id.fullname} : </h6>
                <p className='col-10 col-sm-7 fw-bold text-sm-start text-center'>{comment.content} </p>
                {comment.user_id &&
                  comment.user_id._id == userId ?
                  <div className='col-2 col-sm-1'>
                  <button onClick={() => deleteCommentHandler(comment._id)} className='delete-comment-btn p-0'>
                    <IoMdRemoveCircle className='fs-2' />
                  </button>
                </div> : ''
                } 

              </div>

            )) :
              <div className='col-12 comment my-2 fw-bold p-3 '>
                <p className=''>There Is No Comments </p>
              </div>
            }
          </div>

          <div className='row w-100 p-0 m-0 my-3 justify-content-center'>
            <textarea type='text' placeholder='Add Comment' rows="2"
              value={commentState.value}
              onChange={commentChangeHandler}
              onBlur={commentTouchHandler}
              isvalid={commentState.isvalid.toString()}
              className={`col-12 col-md-8 search p-2 ${!commentState.isvalid &&
                commentState.isTouched &&
                "form-control-invalid"
                }`}
            />
            <div className='col-8 col-md-4 my-2'>
              <button
                onClick={addCommentHandler}
                disabled={
                  !commentState.isvalid
                }
                className='comment-btn p-3 fw-bold'>Add Comment</button>
            </div>
          </div>

        </div>

      </div>

      <div className='row col-11 col-lg-3 row bg-white adduser-form p-1  m-1 justify-content-center'>
        <div>
          <h1 className='edit-form-lable p-4'>Notes</h1>
          <div className='row p-0 m-0'>
            <div className='p-0 m-0'>
              {!notes.length == 0 ? notes.map((note) => (
                <div className='col-12 note my-2 fw-bold p-3 text-start' key={note._id}>
                  <p className=''>{note.content.split('GMT')[0]}</p>
                </div>
              )) :
                <div className='col-12 note my-2 fw-bold p-3 '>
                  <p className=''>There Is No Notes </p>
                </div>
              }
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default TaskDetails
