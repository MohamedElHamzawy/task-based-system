import React, { useEffect, useState, useReducer } from "react";
import { validate, VALIDATOR_MINLENGTH } from "../../../../util/validators";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";

import { Link, useNavigate, useParams } from "react-router-dom";
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
  const navigate = useNavigate();

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URL}:5000/api/task/${id}`, {
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
          });
        setLoading(false);
        setIsLoading(false);
      });
      timerId = setTimeout(async () => {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URL}:5000/api/status/`, {
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
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/task/partial/${id}`,
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
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/task/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const responseData = await response;

      setError(responseData.data.message);
      setIsLoading(false);
      window.location.to = "/tasks";
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
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/comment/`,
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
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/comment/`,
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

  function getRowClass(statusname) {
    switch (statusname) {
      case "pending":
        return "bg-yellow-100";
      case "waiting offer":
        return "bg-blue-100";
      case "approved":
        return "bg-sky-100";
      case "working on":
        return "bg-purple-100";
      case "done":
        return "bg-green-100";
      case "delivered":
        return "bg-gray-100";
      case "rejected":
        return "bg-red-100";
      case "not available":
        return "bg-slate-100";
      case "on going":
        return "bg-teal-100";
      case "offer submitted":
        return "bg-orange-100";
      case "edit":
        return "bg-indigo-100";
      case "cancel":
        return "bg-pink-100";
      default:
        return "";
    }
  }

  function getStatusClass(statusname) {
    switch (statusname) {
      case "pending":
        return "text-yellow-400";
      case "waiting offer":
        return "text-blue-400";
      case "approved":
        return "text-sky-400";
      case "working on":
        return "text-purple-400";
      case "done":
        return "text-green-400";
      case "delivered":
        return "text-gray-400";
      case "rejected":
        return "text-red-400";
      case "not available":
        return "text-slate-400";
      case "on going":
        return "text-teal-400";
      case "offer submitted":
        return "text-orange-400";
      case "edit":
        return "text-indigo-400";
      case "cancel":
        return "text-pink-400";
      default:
        return "";
    }
  }

  //error message
  const errorHandler = () => {
    setError(null);
    window.location.reload(true);
  };

  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="flex flex-col w-full p-3 min-h-[calc(100vh-65px)]">
      <ErrorModal error={error} onClear={errorHandler} />

      <div className="relative flex flex-row justify-center w-full p-1 mb-4">
        <button
          className="absolute top-0 left-0 p-2 text-3xl"
          onClick={() => navigate("/tasks")}
        >
          <TiArrowBack />
        </button>
        <h2 className="text-center text-2xl font-bold lg:text-3xl">
          Task Details
        </h2>
      </div>

      <div className="w-full max-w-3xl mx-auto">
        <div className="flex items-center justify-between bg-white rounded px-8 py-3 border-2">
          <div className="font-bold">{task.serialNumber}</div>
          <div
            className={`rounded-md px-4 py-2 text-xs font-bold ${getRowClass(
              status.statusname
            )} ${getStatusClass(status.statusname)}`}
          >
            {status.statusname}
          </div>
          <button onClick={deleteTaskHandler}>
            <RiDeleteBinFill className="text-red-500 w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="row col-12 col-lg-8 justify-content-center p-1 mx-1 h-100">
        {!editTask ? (
          <div className="row bg-white adduser-form p-0 m-0 justify-content-start ">
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
                <Link
                  className="text-dark fw-bold"
                  to={`/client/${client._id}`}
                >
                  {client.clientname}
                </Link>
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
                    <Link
                      className="text-dark fw-bold"
                      to={`/freelancer/${task.freelancer._id}`}
                    >
                      {task.freelancer.freelancername}
                    </Link>
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
                <Link
                  className="text-dark fw-bold"
                  to={`/user/${user && user._id}`}
                >
                  {user && user.fullname}
                </Link>
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
                  className="comment text-start row p-2 pt-3 my-1 m-0"
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
