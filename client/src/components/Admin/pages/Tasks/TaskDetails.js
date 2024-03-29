import React, { useEffect, useState, useReducer } from "react";
import { validate, VALIDATOR_MINLENGTH } from "../../../../util/validators";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";

import { useParams } from "react-router-dom";
import { RiDeleteBinFill } from "react-icons/ri";
import { TiArrowBack } from "react-icons/ti";
import { FaEdit } from "react-icons/fa";
import { IoMdRemoveCircle } from "react-icons/io";

import GetCookie from "../../../../hooks/getCookie";
import FreelancerOffer from "./FreelancerOffer";
import Paid from "./Paid";
import EditTask from "./EditTask";
import ShareWith from "./ShareWith";

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
  const token = GetCookie("AdminToken");
  const userId = JSON.parse(localStorage.getItem("AdminData"));
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  let { id } = useParams();

  const [editTask, setEditTask] = useState(false);
  const [task, setTask] = useState([]);
  const [offer, setOffer] = useState("");
  const [notes, setNotes] = useState([]);
  const [comments, setComments] = useState([]);
  const [client, setClient] = useState([]);
  const [speciality, setSpeciality] = useState([]);
  const [user, setUser] = useState([]);
  const [status, setStatus] = useState([]);
  const [currency, setCurrency] = useState([]);

  const [statuses, setStatuses] = useState([]);
  const [changeStatus, setChangeStatus] = useState("");

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios
          .get(` https://smarteduservices.com:5000/api/task/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            setTask(res.data.task);
            setOffer(res.data.offer);
            setClient(res.data.task.client);
            setCurrency(res.data.task.task_currency);
            setSpeciality(res.data.task.speciality);
            setStatus(res.data.task.taskStatus);
            setUser(res.data.task.created_by);

            setNotes(res.data.notes);
            setComments(res.data.comments);

            console.log(res.data);
          });
        setLoading(false);
        setIsLoading(false);
      });
      timerId = setTimeout(async () => {
        await axios
          .get(" https://smarteduservices.com:5000/api/status/", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            setStatuses(res.data.statuses);
          });
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  /////////////////////////////////////////
  //Change State
  const changeStatusHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        ` https://smarteduservices.com:5000/api/task/partial/${id}`,
        {
          statusID: changeStatus,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const responseData = await response;

      if (!(response.statusText === "OK")) {
        throw new Error(responseData.data.msg);
      }
      setError(responseData.data.msg);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err.message && "SomeThing Went Wrong , Please Try Again .");
    }
  };
  //////////////////////////////////////

  //delete task
  const deleteTaskHandler = async () => {
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.delete(
        `  https://smarteduservices.com:5000/api/task/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const responseData = await response;

      setError(responseData.data.message);
      setIsLoading(false);
      window.location.href = "/tasks";
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "SomeThing Went Wrong , Please Try Again .");
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
        ` https://smarteduservices.com:5000/api/comment/`,
        {
          content: commentState.value,
          task_id: task._id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
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

  //delete Comment
  const deleteCommentHandler = async (commentId) => {
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.delete(
        `  https://smarteduservices.com:5000/api/comment/`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { commentID: commentId },
        }
      );
      const responseData = await response;
      setError(responseData.data.message);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "SomeThing Went Wrong , Please Try Again .");
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
    <div className="text-center row w-100 m-0 justify-content-center">
      <ErrorModal error={error} onClear={errorHandler} />
      <div className="row  p-2">
        <div className="col-3 text-center">
          <button
            className="back-btn p-2 px-3 fs-3 "
            onClick={() => {
              window.location.href = "/tasks";
            }}
          >
            <TiArrowBack />{" "}
          </button>
        </div>
        <h2 className="col-8 col-sm-6 col-md-3 text-center system-head pt-3  fw-bold">
          {" "}
          Task Details
        </h2>
        <div className="col-12 col-sm-3 text-end">
          <button
            className="task-edit-btn p-2 px-4 fs-3 "
            onClick={() => setEditTask(!editTask)}
          >
            <FaEdit />{" "}
          </button>
        </div>
      </div>
      {/* ////////////////////////////////////////////// */}
      <div className="row col-12 col-lg-8 justify-content-center p-1 mx-1 h-100">
        {!editTask ? (
          <div className="row bg-white adduser-form p-0 m-0 justify-content-start ">
            <div className="col-12 row p-3 justify-content-center">
              <div className="col-12 fw-bold pt-3 row text-center">
                {status && (
                  <span
                    className={
                      status.statusname == "pending"
                        ? "bg-warning p-3 status col-12 "
                        : status.statusname == "waiting offer"
                        ? " waiting-offer  p-3 status col-12 "
                        : status.statusname == "approved"
                        ? "bg-info   p-3 status col-12 "
                        : status.statusname == "working on"
                        ? "bg-primary   p-3 status col-12 "
                        : status.statusname == "done"
                        ? "bg-success  p-3 status col-12 "
                        : status.statusname == "delivered"
                        ? "bg-secondary  p-3 status col-12"
                        : status.statusname == "rejected"
                        ? "bg-danger p-3 status col-12 "
                        : status.statusname == "not available"
                        ? "bg-dark   p-3 status col-12 "
                        : status.statusname == "on going"
                        ? "on-going  p-3 status col-12 "
                        : status.statusname == "offer submitted"
                        ? "offer-submitted   p-3 status col-12 "
                        : status.statusname == "edit"
                        ? "edit   p-3 status col-12 "
                        : status.statusname == "cancel"
                        ? "cancel   p-3 status col-12 "
                        : "anystatus  p-3 status col-12 "
                    }
                  >
                    {status.statusname}
                  </span>
                )}
              </div>
              <div className="col-12 text-end py-2 row">
                <div className="fw-bold col-5 col-sm-7 col-md-8 col-lg-10 text-center row p-0 m-0">
                  <span className="col-11 col-sm-7 col-md-4 col-lg-2 serial-number p-3">
                    {task.serialNumber}
                  </span>
                </div>
                <div className="col-7 col-sm-5 col-md-4 col-lg-2 text-end justify-content-end p-0 m-0">
                  <button
                    className="delete-btn px-3 p-1 fs-4 "
                    onClick={deleteTaskHandler}
                  >
                    <RiDeleteBinFill />
                  </button>
                </div>
              </div>
            </div>
            {/* /////////////////////// */}
            <div className="col-12 col-md-6 row ">
              <h5 className="col-12 col-sm-6 edit-form-lable text-start pt-2 data  fw-bold">
                {" "}
                Title :
              </h5>
              <p className="d-inline col-12 col-sm-6  p-2 edit-form-p details-data fw-bold data text-center">
                {" "}
                {task.title}{" "}
              </p>
            </div>
            <div className="col-12 col-md-6  row ">
              <h5 className="col-6 edit-form-lable text-start pt-2 data  fw-bold">
                {" "}
                Speciality :
              </h5>
              <p className="d-inline col-6  p-2 edit-form-p details-data fw-bold data text-center">
                {" "}
                {speciality && speciality.sub_speciality}{" "}
              </p>
            </div>

            <div className="col-12 col-md-6  row ">
              <h5 className="col-6 edit-form-lable text-start pt-2 data  fw-bold">
                {" "}
                Channel :
              </h5>
              <p className="d-inline col-6  p-2 edit-form-p details-data fw-bold data text-center">
                {" "}
                {task.channel}{" "}
              </p>
            </div>

            <div className="col-12 col-md-6 row">
              <h5 className="col-4 col-sm-6 edit-form-lable text-start pt-2 data  fw-bold">
                Country:
              </h5>
              <p className="d-inline col-8 col-sm-6  p-2 edit-form-p details-data fw-bold data text-center">
                {" "}
                {task.country && task.country.countryName}{" "}
              </p>
            </div>

            <div className="col-12 col-md-6  row ">
              <h5 className="col-4 col-sm-6 edit-form-lable text-start pt-2 data  fw-bold">
                {" "}
                Client :
              </h5>
              <p className="d-inline col-8 col-sm-6  p-2 edit-form-p details-data fw-bold data text-center">
                <a className="text-dark fw-bold" href={`/client/${client._id}`}>
                  {client.clientname}
                </a>
              </p>
            </div>

            <div className="col-12 col-md-6  row">
              <h5 className="col-12 col-sm-6 edit-form-lable text-start pt-2 data  fw-bold">
                Client Offer:
              </h5>
              <p className="d-inline col-12 col-sm-6 p-2 edit-form-p details-data fw-bold text-danger data text-center">
                ({offer.customerOfferMax} - {offer.customerOfferMin})
              </p>
            </div>

            {task.paid && (
              <div className="col-12 col-md-6  row ">
                <h5 className="col-7 col-sm-6  edit-form-lable text-start pt-2 data  fw-bold">
                  Client Price:
                </h5>
                <p className="d-inline col-5 col-sm-6  p-2 edit-form-p details-data fw-bold text-danger data text-center">
                  {task.paid}{" "}
                </p>
              </div>
            )}
            <div className="col-12 col-md-6 row">
              <h5 className="col-7 col-sm-6 edit-form-lable text-start pt-2 data  fw-bold">
                Currency:
              </h5>
              <p className="d-inline col-5 col-sm-6  p-2 edit-form-p details-data fw-bold data text-center">
                {" "}
                {currency.currencyname}{" "}
              </p>
            </div>

            {task.freelancer && (
              <>
                <div className="col-12 col-md-6 row ">
                  <h5 className="col-12 col-sm-6 edit-form-lable text-start pt-2 data  fw-bold">
                    {" "}
                    Freelancer :
                  </h5>
                  <p className="d-inline col-12 col-sm-6  p-2 edit-form-p details-data fw-bold data text-center">
                    <a
                      className="text-dark fw-bold"
                      href={`/freelancer/${task.freelancer._id}`}
                    >
                      {task.freelancer.freelancername}
                    </a>
                  </p>
                </div>

                <div className="col-12 col-md-6  row">
                  <h5 className="col-12 col-sm-6 edit-form-lable text-start pt-2 data  fw-bold">
                    Suggested offer:
                  </h5>
                  <p className="d-inline col-12 col-sm-6 p-2 edit-form-p details-data fw-bold text-danger data text-center">
                    ({Math.floor(offer.specialistOfferMax)} -{" "}
                    {Math.floor(offer.specialistOfferMin)})
                  </p>
                </div>

                <div className="col-12 col-md-6 row ">
                  <h5 className="col-12 col-sm-6 edit-form-lable text-start pt-2 data  fw-bold">
                    {" "}
                    Freelancer Price:
                  </h5>
                  <p className="d-inline col-12 col-sm-6 p-2 edit-form-p details-data fw-bold text-danger data text-center">
                    {" "}
                    {task.cost}{" "}
                  </p>
                </div>
              </>
            )}

            {task.profit_amount ? (
              <div className="col-12 col-md-6  row ">
                <h5 className="col-12 col-sm-6 edit-form-lable text-start pt-2 data  fw-bold">
                  {" "}
                  Profit :
                </h5>
                <p className="d-inline col-12 col-sm-6  p-2 edit-form-p details-data fw-bold data text-center">
                  {task.profit_amount}
                </p>
              </div>
            ) : (
              ""
            )}

            <div className="col-12 col-md-6  row ">
              <h5 className="col-12 col-sm-6 edit-form-lable text-start pt-2 data  fw-bold">
                {" "}
                UserName :
              </h5>
              <p className="d-inline col-12 col-sm-6  p-2 edit-form-p details-data fw-bold data text-center">
                <a
                  className="text-dark fw-bold"
                  href={`/user/${user && user._id}`}
                >
                  {user && user.fullname}
                </a>
              </p>
            </div>

            <div className="col-12 col-md-6  row ">
              <h5 className="col-12 col-sm-6 edit-form-lable text-start pt-2 data  fw-bold">
                {" "}
                UserRole :
              </h5>
              <p className="d-inline col-12 col-sm-6  p-2 edit-form-p details-data fw-bold data text-center">
                {" "}
                {user && user.user_role}{" "}
              </p>
            </div>

            {task.show_created && (
              <div className="col-12 col-md-6  row ">
                <h5 className="col-12 col-sm-6 edit-form-lable text-start pt-2 data  fw-bold">
                  {" "}
                  SharedWith:
                </h5>
                <p className="d-inline col-12 col-sm-6  p-2 edit-form-p details-data fw-bold data text-center">
                  {" "}
                  {task.show_created.fullname}{" "}
                </p>
              </div>
            )}
            {task.show_accepted && (
              <div className="col-12 col-md-6  row ">
                <h5 className="col-12 col-sm-6 edit-form-lable text-start pt-2 data  fw-bold">
                  {" "}
                  AcceptedWith:
                </h5>
                <p className="d-inline col-12 col-sm-6  p-2 edit-form-p details-data fw-bold data text-center">
                  {" "}
                  {task.show_accepted.fullname}{" "}
                </p>
              </div>
            )}

            <div className="col-12 row p-0 m-0 justify-content-center justify-content-md-start">
              <h5 className="col-md-3 col-12 edit-form-lable text-start pt-2 data  fw-bold">
                DeadLine :
              </h5>
              <p className="d-inline col-md-4 col-6 p-2 edit-form-p details-data fw-bold date data text-center">
                <span className="text-danger">Date:</span>
                {task.deadline && task.deadline.split("T")[0]}{" "}
              </p>
              <p className="d-inline col-md-4 col-6  p-2 edit-form-p details-data fw-bold date data text-center">
                <span className="text-danger">Time:</span>{" "}
                {task.deadline && task.deadline.split("T")[1].split(".")[0]}
              </p>
            </div>
            <div className="col-12 row justify-content-center justify-content-md-start p-0 m-0">
              <h5 className="col-md-3 col-12 edit-form-lable text-start pt-2  fw-bold">
                {" "}
                Description :
              </h5>
              <p className="d-inline col-md-8 col-12 p-2 edit-form-p details-data fw-bold text-center">
                {" "}
                {task.description}{" "}
              </p>
            </div>
          </div>
        ) : (
          <EditTask id={id} token={token} task={task} />
        )}

        {/* ///on status approved */}

        <div className=" bg-white adduser-form pt-5 p-4 m-1">
          <div className="row justify-content-center">
            <h4 className="col-12 col-lg-5 fw-bold add-user-p text-start py-2">
              Change Status :
            </h4>
            <select
              id="status"
              name="status"
              className="p-2 px-4 search col-12 col-lg-7"
              value={changeStatus}
              onChange={(event) => setChangeStatus(event.target.value)}
            >
              <option value="" className="text-secondary">
                Statuses
              </option>
              {statuses.map((status) => (
                <option value={status._id} key={status._id}>
                  {status.statusname}
                </option>
              ))}
            </select>
          </div>

          {/* // server status conditions */}
          {(changeStatus == "6517380ae979f2bb0fb8a3db" && !task.freelancer) ||
          changeStatus == "65173822e979f2bb0fb8a3e1" ? (
            <FreelancerOffer id={id} statusID={changeStatus} />
          ) : changeStatus == "6517375de979f2bb0fb8a3cc" ? (
            <Paid id={id} statusID={changeStatus} />
          ) : changeStatus == "651737ebe979f2bb0fb8a3d5" ? (
            <ShareWith id={id} statusID={changeStatus} />
          ) : (
            <div className="row col-12 p-3 justify-content-center">
              <button
                className="edit-user-btn p-3 col-10 col-lg-4 fw-bold"
                onClick={changeStatusHandler}
              >
                Change
              </button>
            </div>
          )}
        </div>

        {/* /////////////////////////////////////////////////////////////////////////*/}

        <div className="row bg-white adduser-form p-3 my-2 justify-content-center">
          <h1 className="edit-form-lable  fw-bold">Comments</h1>
          <div className="row w-100 p-0 m-0">
            {!comments.length == 0 ? (
              comments.map((comment) => (
                <div
                  className="comment text-start row p-2 pt-3 my-1 p-0 m-0"
                  key={comment._id}
                >
                  <h6 className="col-12 col-sm-4 edit-form-lable fw-bold ">
                    {comment.user_id && comment.user_id.fullname} :{" "}
                  </h6>
                  <p className="col-12 col-sm-7 fw-bold text-sm-start text-center">
                    {comment.content}{" "}
                  </p>
                  {comment.user_id && comment.user_id._id == userId ? (
                    <div className="col-2 col-sm-1">
                      <button
                        onClick={() => deleteCommentHandler(comment._id)}
                        className="delete-comment-btn p-0"
                      >
                        <IoMdRemoveCircle className="fs-2" />
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ))
            ) : (
              <div className="col-12 comment my-2 fw-bold p-3 ">
                <p className="">There Is No Comments </p>
              </div>
            )}
          </div>

          <div className="row w-100 p-0 m-0 my-3 justify-content-center">
            <textarea
              type="text"
              placeholder="Add Comment"
              rows="2"
              value={commentState.value}
              onChange={commentChangeHandler}
              onBlur={commentTouchHandler}
              isvalid={commentState.isvalid.toString()}
              className={`col-12 col-md-8 search p-2 ${
                !commentState.isvalid &&
                commentState.isTouched &&
                "form-control-invalid"
              }`}
            />
            <div className="col-8 col-md-4 my-2">
              <button
                onClick={addCommentHandler}
                disabled={!commentState.isvalid}
                className="comment-btn p-3 fw-bold"
              >
                Add Comment
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* /////////////////////////////////////////////// */}
      <div className="row notes-component col-11 col-lg-3 row bg-white adduser-form p-1  m-1 justify-content-center">
        <div>
          <h1 className="edit-form-lable p-4 fw-bold">Notes</h1>
          <div className="row p-0 m-0">
            <div className="p-0 m-0">
              {!notes.length == 0 ? (
                notes.map((note) => (
                  <div
                    className="col-12 note my-2 fw-bold p-3 text-start"
                    key={note._id}
                  >
                    <p className="">{note.content.split("GMT")[0]}</p>
                  </div>
                ))
              ) : (
                <div className="col-12 note my-2 fw-bold p-3 ">
                  <p className="">There Is No Notes </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* /////////////////////////////////////////////// */}
    </div>
  );
};

export default TaskDetails;
