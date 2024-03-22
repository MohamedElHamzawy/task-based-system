import React, { useEffect, useState, useReducer } from "react";
import { validate, VALIDATOR_MINLENGTH } from "../../../../util/validators";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";

import { Link, useNavigate, useParams } from "react-router-dom";
import { RiDeleteBinFill } from "react-icons/ri";
import { TiArrowBack } from "react-icons/ti";
import { FaBell, FaEdit } from "react-icons/fa";
import { IoMdRemoveCircle } from "react-icons/io";
import { MdCancel, MdEdit } from "react-icons/md";

import GetCookie from "../../../../hooks/getCookie";
import FreelancerOffer from "./FreelancerOffer";
import Paid from "./Paid";
import EditTask from "./EditTask";
import ShareWith from "./ShareWith";
import Status from "./Status";

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

  useEffect(() => {
    if (!task) return;
    console.log(task);
  }, [task]);

  return isLoading || !task || task.length === 0 ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="flex flex-col w-full p-3 min-h-[calc(100vh-65px)] space-y-2">
      <ErrorModal error={error} onClear={errorHandler} />

      <div className="relative flex flex-row justify-center w-full p-1 mb-4">
        <button
          className="absolute top-0 left-0 p-2 text-3xl"
          onClick={() => navigate("/tasks")}
        >
          <TiArrowBack />
        </button>
        <h2 className=" text-2xl font-bold lg:text-3xl">Task Details</h2>
      </div>

      <div className="w-full max-w-5xl 2xl:max-w-6xl mx-auto">
        <div className="flex items-center justify-between bg-white rounded px-8 py-3">
          <div className="font-bold">{task.serialNumber}</div>
          <div
            className={`rounded-md px-4 py-2 text-xs font-bold ${getRowClass(
              status?.statusname
            )} ${getStatusClass(status?.statusname)}`}
          >
            {status?.statusname || "N/A"}
          </div>
          <div className="space-x-2">
            {editTask ? (
              <button onClick={() => setEditTask(false)}>
                <MdCancel className="w-6 h-6" />
              </button>
            ) : (
              <button onClick={() => setEditTask(true)}>
                <MdEdit className="w-6 h-6" />
              </button>
            )}
            <button onClick={deleteTaskHandler}>
              <RiDeleteBinFill className="text-red-500 w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex w-full max-w-5xl 2xl:max-w-6xl mx-auto space-x-2">
        <div className="w-2/3 bg-white rounded px-8 py-3 drop-shadow">
          {!editTask ? (
            <div className="grid grid-cols-3 gap-2">
              <div className="">
                <h5 className="m-0 p-0 font-semibold text-base text-gray-400">
                  Title
                </h5>
                <p className="font-medium border rounded my-0 mr-0 p-2 flex-1  drop-shadow-sm">
                  {task.title}
                </p>
              </div>
              <div className="">
                <h5 className="m-0 p-0 font-semibold text-base text-gray-400">
                  Speciality
                </h5>
                <p className="font-medium border rounded my-0 mr-0 p-2 flex-1  drop-shadow-sm">
                  {speciality && speciality.sub_speciality}
                </p>
              </div>
              <div className="">
                <h5 className="m-0 p-0 font-semibold text-base text-gray-400">
                  Channel
                </h5>
                <p className="font-medium border rounded my-0 mr-0 p-2 flex-1  drop-shadow-sm">
                  {task.channel}
                </p>
              </div>
              <div className="">
                <h5 className="m-0 p-0 font-semibold text-base text-gray-400">
                  Country
                </h5>
                <p className="font-medium border rounded my-0 mr-0 p-2 flex-1  drop-shadow-sm">
                  {task.country && task.country.countryName}
                </p>
              </div>
              <div className="">
                <h5 className="m-0 p-0 font-semibold text-base text-gray-400">
                  Client
                </h5>
                <p className="font-medium border rounded my-0 mr-0 p-2 flex-1  drop-shadow-sm">
                  <Link
                    className="text-dark fw-bold"
                    to={`/client/${client._id}`}
                  >
                    {client.clientname}
                  </Link>
                </p>
              </div>
              <div className="">
                <h5 className="m-0 p-0 font-semibold text-base text-gray-400">
                  Client Offer
                </h5>
                <p className="font-medium border rounded my-0 mr-0 p-2 flex-1  drop-shadow-sm">
                  ({offer.customerOfferMax} - {offer.customerOfferMin})
                </p>
              </div>
              {task.paid && (
                <div className="">
                  <h5 className="m-0 p-0 font-semibold text-base text-gray-400">
                    Client Price
                  </h5>
                  <p className="font-medium border rounded my-0 mr-0 p-2 flex-1  drop-shadow-sm">
                    {task.paid}
                  </p>
                </div>
              )}
              <div className="">
                <h5 className="m-0 p-0 font-semibold text-base text-gray-400">
                  Currency
                </h5>
                <p className="font-medium border rounded my-0 mr-0 p-2 flex-1  drop-shadow-sm">
                  {currency.currencyname}
                </p>
              </div>
              {task.freelancer && (
                <>
                  <div className="">
                    <h5 className="m-0 p-0 font-semibold text-base text-gray-400">
                      Freelancer
                    </h5>
                    <p className="font-medium border rounded my-0 mr-0 p-2 flex-1  drop-shadow-sm">
                      <Link
                        className="text-dark fw-bold"
                        to={`/freelancer/${task.freelancer._id}`}
                      >
                        {task.freelancer.freelancername}
                      </Link>
                    </p>
                  </div>
                  <div className="">
                    <h5 className="m-0 p-0 font-semibold text-base text-gray-400">
                      Suggested offer
                    </h5>
                    <p className="font-medium border rounded my-0 mr-0 p-2 flex-1  drop-shadow-sm">
                      ({Math.floor(offer.specialistOfferMax)} -{" "}
                      {Math.floor(offer.specialistOfferMin)})
                    </p>
                  </div>
                  <div className="">
                    <h5 className="m-0 p-0 font-semibold text-base text-gray-400">
                      Freelancer Price
                    </h5>
                    <p className="font-medium border rounded my-0 mr-0 p-2 flex-1  drop-shadow-sm">
                      {task.cost}
                    </p>
                  </div>
                </>
              )}
              {task.profit_amount ? (
                <div className="">
                  <h5 className="m-0 p-0 font-semibold text-base text-gray-400">
                    Profit
                  </h5>
                  <p className="font-medium border rounded my-0 mr-0 p-2 flex-1  drop-shadow-sm">
                    {task.profit_amount}
                  </p>
                </div>
              ) : (
                ""
              )}
              <div className="">
                <h5 className="m-0 p-0 font-semibold text-base text-gray-400">
                  UserName
                </h5>
                <p className="font-medium border rounded my-0 mr-0 p-2 flex-1  drop-shadow-sm">
                  <Link
                    className="text-dark fw-bold"
                    to={`/user/${user && user._id}`}
                  >
                    {user && user.fullname}
                  </Link>
                </p>
              </div>
              <div className="">
                <h5 className="m-0 p-0 font-semibold text-base text-gray-400">
                  UserRole
                </h5>
                <p className="font-medium border rounded my-0 mr-0 p-2 flex-1  drop-shadow-sm">
                  {user && user.user_role}
                </p>
              </div>
              {task.show_created && (
                <div className="">
                  <h5 className="m-0 p-0 font-semibold text-base text-gray-400">
                    SharedWith
                  </h5>
                  <p className="font-medium border rounded my-0 mr-0 p-2 flex-1  drop-shadow-sm">
                    {task.show_created.fullname}
                  </p>
                </div>
              )}
              {task.show_accepted && (
                <div className="">
                  <h5 className="m-0 p-0 font-semibold text-base text-gray-400">
                    AcceptedWith
                  </h5>
                  <p className="font-medium border rounded my-0 mr-0 p-2 flex-1  drop-shadow-sm">
                    {task.show_accepted.fullname}
                  </p>
                </div>
              )}
              <div className="col-span-3">
                <h5 className="m-0 p-0 font-semibold text-base text-gray-400">
                  DeadLine
                </h5>
                <div className="flex space-x-2 items-center justify-between">
                  <p className="font-medium border rounded my-0 mr-0 p-2 flex-1  drop-shadow-sm">
                    <span className="text-danger">Date:</span>
                    {task.deadline && task.deadline.split("T")[0]}
                  </p>
                  <p className="font-medium border rounded my-0 mr-0 p-2 flex-1  drop-shadow-sm">
                    <span className="text-danger">Time:</span>
                    {task.deadline && task.deadline.split("T")[1].split(".")[0]}
                  </p>
                </div>
              </div>
              <div className="col-span-3">
                <h5 className="m-0 p-0 font-semibold text-base text-gray-400">
                  Description
                </h5>
                <p className="font-medium border rounded my-0 mr-0 p-2 flex-1  drop-shadow-sm">
                  {task.description}
                </p>
              </div>
            </div>
          ) : (
            <EditTask id={id} token={token} task={task} />
          )}
        </div>
        <div className="w-1/3 bg-white drop-shadow rounded p-2 overflow-y-auto max-h-[410px]">
          <h1 className="text-2xl text-gray-600 font-semibold">Notes</h1>
          <div className="row p-0 m-0">
            <div className="p-0 m-0 space-y-2">
              {!notes.length == 0 ? (
                notes.map((note) => (
                  <div
                    key={note._id}
                    className="p-4 rounded-lg shadow-md bg-white"
                  >
                    <div className="flex items-start">
                      <p className="text-base font-medium text-gray-900">
                        {note.content.split("GMT")[0]}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 note my-2 fw-bold p-3">
                  <p className="">There Is No Notes </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Status status={task.taskStatus?.statusname} task={task} />

      <div className="w-full max-w-5xl 2xl:max-w-6xl mx-auto bg-white drop-shadow rounded p-2">
        <h1 className="text-2xl text-gray-600 font-semibold">Comments</h1>
        <div className="space-y-1.5">
          {!comments.length == 0 ? (
            comments.map((comment) => (
              <div key={comment._id}>
                <h6 className="m-0 p-0 text-xs text-gray-400">
                  {comment.user_id && comment.user_id.fullname}
                </h6>
                <div className="flex items-center space-x-1">
                  {comment.user_id && comment.user_id._id == userId && (
                    <button
                      onClick={() => deleteCommentHandler(comment._id)}
                      className=""
                    >
                      <IoMdRemoveCircle className="text-red-500" />
                    </button>
                  )}
                  <p className="my-0 ml-2 p-0">{comment.content}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="">
              <p className="">There Is No Comments </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center space-x-2 justify-between">
          <textarea
            type="text"
            placeholder="Add Comment"
            value={commentState.value}
            onChange={commentChangeHandler}
            onBlur={commentTouchHandler}
            isvalid={commentState.isvalid.toString()}
            className={`flex-1 p-2 ${
              !commentState.isvalid && commentState.isTouched && "text-red-500"
            }`}
          />
          <button
            onClick={addCommentHandler}
            disabled={!commentState.isvalid}
            className="w-1/5 py-3.5 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Comment
          </button>
        </div>
      </div>

      <div className="flex max-w-5xl mx-auto space-x-2">
        {/* ///on status approved */}

        {/* <div className=" bg-white adduser-form pt-5 p-4 m-1">
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
                  {status?.statusname}
                </option>
              ))}
            </select>
          </div> */}

        {/* // server status conditions */}

        {/* {(changeStatus == "6517380ae979f2bb0fb8a3db" && !task.freelancer) ||
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
        </div> */}
      </div>

      {/* /////////////////////////////////////////////// */}
      {/* <div className="">
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
      </div> */}
      {/* /////////////////////////////////////////////// */}
    </div>
  );
};

export default TaskDetails;
