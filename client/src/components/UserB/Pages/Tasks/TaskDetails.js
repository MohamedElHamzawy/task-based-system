import React, { useEffect, useState, useReducer } from 'react'
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";
import { validate, VALIDATOR_MINLENGTH } from "../../../../util/validators";

import { useParams } from "react-router-dom";
import { TiArrowBack } from 'react-icons/ti';
import { MdPendingActions } from 'react-icons/md';
import { MdRateReview } from 'react-icons/md';
import { BiSolidOffer } from 'react-icons/bi';
import { GiProgression } from 'react-icons/gi';
import { AiOutlineFileDone } from 'react-icons/ai';
import { TbTruckDelivery } from 'react-icons/tb';
import { IoMdRemoveCircle } from 'react-icons/io';

import GetCookie from "../../../../hooks/getCookie";
import FreelancerOffer from '../Tasks/FreelancerOffer';

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
  const token = GetCookie("UserB")
  const userId = JSON.parse(localStorage.getItem('UserBData'));

  const [editName, setEditName] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  let { id } = useParams();

  const [task, setTask] = useState([]);
  const [comments, setComments] = useState([]);
  const [offer, setOffer] = useState('');
  const [speciality, setSpeciality] = useState([]);
  const [status, setStatus] = useState([]);

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios.get(`http://localhost:5000/api/task/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
          setTask(res.data.task);
          setOffer(res.data.offer)
          setSpeciality(res.data.task.speciality)
          setStatus(res.data.task.taskStatus)
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

    //comment validation
    const [commentState, dispatch4] = useReducer(commentReducer, {
      value: "",
      isvalid: false,
      isTouched: false,
    });
  
    const commentChangeHandler = (event) => {
      dispatch4({
        type: "CHANGE",
        comment: event.target.value,
        validators: [VALIDATOR_MINLENGTH(3)],
      });
    };
    const commentTouchHandler = () => {
      dispatch4({
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
    <div className="text-center row w-100 p-4 m-0">
      <ErrorModal error={error} onClear={errorHandler} />

      <div className="row mb-4">
        <div className="col-3 text-center">
          <button className="back-btn p-2 px-3 fs-3 " onClick={() => { status.statusname == 'pending' ? window.location.href = '/' :  window.location.href = '/yourtasks' }}><TiArrowBack /> </button>
        </div>
        <h2 className="col-12 col-lg-7 text-center system-head p-0">  Task Details</h2>
      </div>

      <div className="row bg-white adduser-form p-1 m-0 justify-content-start">

        <div className="col-12 row p-3 justify-content-center">

          <div className=" col-12 fw-bold pt-2 row text-center">
            {
              status &&
              <span
                className={
                  status.statusname == 'pending' ? 'bg-warning  p-3 status col-12 ' :
                    status.statusname == 'admin review' ? 'bg-danger  p-3 status col-12 ' :
                      status.statusname == 'in negotiation' ? 'bg-info  p-3 status col-12 ' :
                        status.statusname == 'in progress' ? 'bg-primary  p-3 status col-12 ' :
                          status.statusname == 'completed' ? 'bg-success  p-3 status col-12 ' :
                            status.statusname == 'delivered to client' ? 'bg-secondary  p-3 status col-12' :
                              'anystatus p-3 status col-12 '
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
        </div>
        {/* /////////////////////// */}
        <div className="col-12 col-md-6  row">
          <h4 className="col-12 col-md-6 edit-form-lable text-start pt-3">  Title :</h4>
          <p className="d-inline col-12 col-md-6  pt-3 edit-form-p fw-bold "> {task.title} </p>
        </div>
        <div className="col-12 col-md-6  row ">
          <h4 className="col-6 edit-form-lable text-start pt-3">  Speciality :</h4>
          <p className="d-inline col-6  pt-3 edit-form-p fw-bold "> {speciality.specialityName} </p>
        </div>
        <div className="col-12 col-md-6 row ">
          <h4 className="col-12 col-sm-6 edit-form-lable text-start pt-3">  Dead Line :</h4>
          <p className="d-inline col-12 col-sm-6  pt-3 edit-form-p fw-bold "> {task.deadline && task.deadline.split('T')[0]} </p>
        </div>

        <div className="col-12 col-md-6 row ">
          <h4 className="col-6 edit-form-lable text-start pt-3">  Channel :</h4>
          <p className="d-inline col-6  pt-3 edit-form-p fw-bold "> {task.channel} </p>
        </div>

        {task.freelancer &&
          <>
            <div className="col-12 col-md-6 row ">
              <h4 className="col-12 col-sm-6 edit-form-lable text-start pt-3">  Freelancer :</h4>
              <p className="d-inline col-12 col-sm-6  pt-3 edit-form-p fw-bold "> {task.freelancer.freelancername} </p>
            </div>

            <div className="col-12 col-md-6 row ">
              <h4 className="col-7 col-md-6  edit-form-lable text-start pt-3">  TaskPrice :</h4>
              <p className="d-inline col-5 col-md-6  pt-3 edit-form-p fw-bold ">{task.cost} </p>
            </div>
            <div className="col-12 col-md-8 col-lg-6 row ">
              <h4 className="col-12 col-sm-6  edit-form-lable text-start pt-3">  Freelancer Email:</h4>
              <p className="d-inline col-12 col-sm-6 pt-3 edit-form-p fw-bold freelanceremail"> {task.freelancer.email} </p>
            </div>
          </>
        }


        <div className="col-12 row ">
          {/* <hr></hr> */}
          <h4 className="col-md-3 col-12 edit-form-lable text-start pt-3">  Description :</h4>
          <p className="d-inline col-md-9 col-12  pt-3 edit-form-p fw-bold freelanceremail"> {task.description} </p>
        </div>
        {/* /////////////////////// */}

      </div>

      {status.statusname == 'pending' &&
        <div className="row bg-white adduser-form p-1 my-1 m-0 justify-content-center">
          <h2 className="text-start py-3 edit-form-lable">Task is Pending .. Waiting To Choose Freelancer : </h2>
          <FreelancerOffer id={id} />
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

        <div className='row bg-white adduser-form p-3 my-2 m-0 justify-content-center'>
          <h1 className='edit-form-lable '>Comments</h1>
          <div className='row w-100 p-0 m-0'>
            {!comments.length == 0 ? comments.map((comment) => (

              <div className='comment text-start row p-2 pt-3 my-1 m-0' key={comment._id}>
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
            <div className='col-12 col-md-4 my-2'>
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
  )
}

export default TaskDetails
