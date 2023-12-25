import React, { useEffect, useReducer, useState } from "react";
import { validate, VALIDATOR_MINLENGTH } from "../../../../util/validators";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";

import { useNavigate, useParams } from "react-router-dom";
import { RiDeleteBinFill } from "react-icons/ri";
import { TiArrowBack } from "react-icons/ti";
import { FaTasks, FaCoins } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import { BsFillFolderSymlinkFill } from "react-icons/bs";
import { AiOutlineFileDone } from "react-icons/ai";
import { GiProfit, GiPayMoney } from "react-icons/gi";
import { FiFilter } from "react-icons/fi";

// Date filter
const getDateFilter = (start, end, tasks) => {
  if (!start || !end) {
    return tasks;
  }
  return tasks.filter(
    (task) =>
      start <= task.deadline.split("T")[0] && task.deadline.split("T")[0] <= end
  );
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
  const [user, setUser] = useState([]);
  const [userSpeciality, setUserSpeciality] = useState();
  const [userRole, setUserRole] = useState();
  const [specialityId, setspecialityId] = useState();
  const [specialities, setSpecialities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [userTasks, setUserTasks] = useState([]);
  const [country, setCountry] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [withoutFilterData, setwithoutFilterData] = useState(true);
  const [dateFilterData, setDateFilterData] = useState(false);
  const DateFilter = getDateFilter(start, end, userTasks);
  const navigate = useNavigate();
  let { id } = useParams();

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URL}:5000/api/user/${id}`)
          .then((res) => {
            setUser(res.data.user);
            setUserTasks(res.data.userTasks);
            if (res.data.user.user_role == "specialistService") {
              setspecialityId(res.data.user.speciality);
              setVisable(true);
            }
          });
        setLoading(false);
        setIsLoading(false);
      });
      timerId = setTimeout(async () => {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URL}:5000/api/speciality/`)
          .then((res) => {
            setSpecialities(res.data.specialities);
          });
      });
      timerId = setTimeout(async () => {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URL}:5000/api/country/`)
          .then((res) => {
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
  const editUserHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/user/${user._id}`,
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
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/user/${id}`
        //  ,
        //  { headers :{
        //     'Authorization':`Bearer ${token}`
        //   }
        // }
      );
      const responseData = await response;

      setError(responseData.data.message);
      setIsLoading(false);
      window.location.href = "/";
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
    <>
      {/* Header */}
      <div className="flex items-center mb-2 drop-shadow">
        <div className="">
          <button
            className="p-2 px-3 text-xl"
            onClick={() => navigate("/users")}
          >
            <TiArrowBack />
          </button>
        </div>
        <h2 className="w-full p-2 pt-4 font-bold text-2xl">User Details</h2>
      </div>
      {/* Header */}

      {/* User Details */}
      <div className="row bg-white adduser-form p-3 m-1 justify-content-start">
        {user.user_role !== "admin" && (
          <div className="flex justify-end p-0">
            <button
              className="bg-red-600 text-white py-2 px-10"
              onClick={deleteUserHandler}
            >
              DELETE
            </button>
          </div>
        )}

        <div className="col-12 col-md-6 row py-2 ">
          <h5 className="col-10 col-md-5  text-start p-2 ">Full Name :</h5>
          <p
            className={
              !editFull
                ? "d-inline col-12 col-md-6 py-2 edit-form-p fw-bold name border rounded-sm"
                : "d-none"
            }
          >
            {user.fullname}
          </p>
          <div
            className={editFull ? "d-inline col-12 col-md-6 py-2 " : "d-none"}
          >
            <input
              type="text"
              placeholder={user.fullname}
              value={fullNameState.value}
              onChange={fullNameChangeHandler}
              onBlur={fullNameTouchHandler}
              isvalid={fullNameState.isvalid.toString()}
              className={`search w-100 p-2 ${
                !fullNameState.isvalid &&
                fullNameState.isTouched &&
                "form-control-invalid"
              }`}
            />
          </div>
        </div>

        <div className="col-12 col-md-6  row py-2 ">
          <h5 className="col-10 col-md-5   text-start p-2  ">User Name:</h5>
          <p
            className={
              !editFull
                ? "d-inline col-12 col-md-6 py-2 edit-form-p fw-bold name border rounded-sm"
                : "d-none"
            }
          >
            {user.username}
          </p>
          <div
            className={editFull ? "d-inline col-12 col-md-6 py-2" : "d-none"}
          >
            <input
              type="text"
              placeholder={user.username}
              value={userNameState.value}
              onChange={userNameChangeHandler}
              onBlur={userNameTouchHandler}
              isvalid={userNameState.isvalid.toString()}
              className={`search w-100 p-2 ${
                !userNameState.isvalid &&
                userNameState.isTouched &&
                "form-control-invalid"
              }`}
            />
          </div>
        </div>

        <div className="col-12 col-md-6  row p-2 ">
          <h5 className="col-10 col-md-5   text-start p-2 ">Phone :</h5>
          <p
            className={
              !editFull
                ? "d-inline col-12 col-md-6 py-2 edit-form-p fw-bold border rounded-sm"
                : "d-none"
            }
          >
            {user.phone}
          </p>
          <div
            className={editFull ? "d-inline col-12 col-md-6 py-2 " : "d-none"}
          >
            <input
              type="number"
              placeholder={user.phone}
              value={numberState.value}
              onChange={numberChangeHandler}
              onBlur={numbertouchHandler}
              isvalid={numberState.isvalid.toString()}
              className={`search w-100 p-2 ${
                !numberState.isvalid &&
                numberState.isTouched &&
                "form-control-invalid"
              }`}
            />
          </div>
        </div>

        <div className="col-12 col-md-6  row p-2 ">
          <h5 className="col-10 col-md-5   text-start p-2 ">Country :</h5>
          <p
            className={
              !editFull
                ? "d-inline col-12 col-md-6 py-2 edit-form-p fw-bold border rounded-sm"
                : "d-none"
            }
          >
            {user.country && user.country.countryName}
          </p>
          <div
            className={editFull ? "d-inline col-12 col-md-6 py-2 " : "d-none"}
          >
            <select
              id="country"
              name="country"
              className="p-2 search w-100"
              value={country}
              onChange={(event) => countryChangeHandler(event.target.value)}
            >
              <option value="" className="text-secondary">
                Countries
              </option>
              {countries.map((country) => (
                <option value={country._id} key={country._id}>
                  {country.countryName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-12 col-md-6 row p-2 ">
          <h5 className="col-10 col-md-5   text-start p-2 ">User Role :</h5>
          <p
            className={
              !editFull
                ? "d-inline col-12 col-md-6 py-2 edit-form-p fw-bold border rounded-sm"
                : "d-none"
            }
          >
            {user.user_role}
          </p>
          <div
            className={editFull ? "d-inline col-12 col-md-6 py-2 " : "d-none"}
          >
            <select
              id="role"
              name="role"
              className="search w-100 p-2"
              value={userRole}
              onChange={(e) => {
                setUserRole(e.target.value);
                if (e.target.value == "specialistService") {
                  setVisable(true);
                  setEditSpeciality(true);
                } else {
                  setVisable(false);
                }
              }}
            >
              <option value="" className="text-secondary">
                Role
              </option>
              <option value="admin">Admin</option>
              <option value="customerService">customerService</option>
              <option value="specialistService">specialistService</option>
            </select>
          </div>
        </div>

        <div className={visable ? "d-flex col-12 col-md-6 row p-2 " : "d-none"}>
          <h5 className="col-10 col-md-5   text-start p-2 fw-bold">
            Speciality :
          </h5>
          <p
            className={
              !editFull
                ? "d-inline col-12 col-md-6 py-2 edit-form-p fw-bold details-data"
                : "d-none"
            }
          >
            {user.speciality && user.speciality.sub_speciality}
          </p>

          <div
            className={editFull ? "d-inline col-12 col-md-6 py-2 " : "d-none"}
          >
            <select
              id="speciality"
              name="speciality"
              className="p-2 px-4 search col-12"
              value={userSpeciality}
              onChange={(event) => specialityChangeHandler(event.target.value)}
            >
              <option value="" className="text-secondary">
                Specialities
              </option>
              {specialities.map((speciality) => (
                <option value={speciality._id} key={speciality._id}>
                  {speciality.sub_speciality}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-center">
          {!editFull && user.user_role !== "admin" && (
            <button
              className="border bg-black text-white font-bold py-2 w-1/12"
              // onClick={editUserHandler}
              onClick={() => setEditFull(!editFull)}
            >
              Edit
            </button>
          )}
          {editFull && user.user_role !== "admin" && (
            <>
              <button
                disabled={
                  !fullNameState.isvalid &&
                  !userNameState.isvalid &&
                  !userRole &&
                  !country &&
                  !numberState.isvalid &&
                  !userSpeciality
                }
                className="border bg-black text-white font-bold py-2 w-1/12"
                onClick={editUserHandler}
              >
                Submit
              </button>
              <button
                className="transition-all text-red-600 hover:text-white hover:bg-red-600 ml-2 rounded-full"
                onClick={() => {
                  setEditFull(!editFull);
                }}
              >
                <ImCancelCircle className="fs-3" />
              </button>
            </>
          )}
        </div>
      </div>
      {/* User Details */}

      {/* Statistics */}
      <div className="bg-white rounded-sm p-3 m-1 mt-3 drop-shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-2">
          <div className="w-full flex space-x-4">
            <h5 className="text-gray-500">Tasks Count:</h5>
            <p className="font-bold">{user.tasksCount}</p>
          </div>

          <div className="w-full flex space-x-4">
            <h5 className="text-gray-500">Completed Count:</h5>
            <p className="font-bold">{user.completedCount}</p>
          </div>

          {user.user_role === "userB" ? (
            <div className="w-full flex space-x-4">
              <h5 className="text-gray-500">Total Cost:</h5>
              <p className="font-bold">{user.totalCost}</p>
            </div>
          ) : (
            <div className="w-full flex space-x-4">
              <h5 className="text-gray-500">Total Gain:</h5>
              <p className="font-bold">{user.totalGain}</p>
            </div>
          )}

          <div className="w-full flex space-x-4">
            <h5 className="text-gray-500">Total Profit:</h5>
            <p className="font-bold">{user.totalProfit}</p>
          </div>
        </div>
      </div>
      {/* Statistics */}

      {/* Filter */}
      <div className="bg-white rounded-sm p-3 m-1 mt-3 drop-shadow">
        <h5 className="text-gray-500 mt-1 text-center">Filter</h5>
        <div className="w-full flex space-x-8 items-center justify-center">
          <div className="flex items-center space-x-2">
            <span className="font-bold">From:</span>
            <input
              type="date"
              className="p-2 rounded-sm"
              onChange={(e) => {
                setStart(e.target.value);
                setDateFilterData(true);
                setwithoutFilterData(false);
              }}
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-bold">To:</span>
            <input
              type="date"
              className="p-2 rounded-sm"
              onChange={(e) => {
                setEnd(e.target.value);
                setDateFilterData(true);
                setwithoutFilterData(false);
              }}
            />
          </div>
        </div>
      </div>
      {/* Filter */}

      {/* Tasks */}
      <div className="row p-1 py-3 m-1 justify-content-center">
        {withoutFilterData &&
          (userTasks && !userTasks.length == 0 ? (
            userTasks.map((task) => (
              <div key={task._id} className="bg-white p-2 py-3 my-1">
                <div className="text-center border flex">
                  <span
                    className={`flex-1 p-3 rounded-sm ${
                      task.taskStatus.statusname === "pending"
                        ? "bg-warning"
                        : task.taskStatus.statusname === "waiting offer"
                        ? "waiting-offer text-white"
                        : task.taskStatus.statusname === "approved"
                        ? "bg-info"
                        : task.taskStatus.statusname === "working on"
                        ? "bg-primary"
                        : task.taskStatus.statusname === "done"
                        ? "bg-success"
                        : task.taskStatus.statusname === "delivered"
                        ? "bg-secondary"
                        : task.taskStatus.statusname === "rejected"
                        ? "bg-danger"
                        : task.taskStatus.statusname === "not available"
                        ? "bg-dark text-white"
                        : task.taskStatus.statusname === "on going"
                        ? "on-going text-white"
                        : task.taskStatus.statusname === "offer submitted"
                        ? "offer-submitted"
                        : task.taskStatus.statusname === "edit"
                        ? "edit"
                        : task.taskStatus.statusname === "cancel"
                        ? "cancel"
                        : "anystatus"
                    }`}
                  >
                    {task.taskStatus.statusname.charAt(0).toUpperCase() +
                      task.taskStatus.statusname.slice(1)}
                  </span>
                </div>

                <div className="flex items-center justify-between my-2 p-0">
                  <div className="p-3 font-bold flex items-center justify-center bg-gray-400 text-white rounded-sm">
                    <span className="">{task.serialNumber}</span>
                  </div>
                  <button
                    className="p-3 font-bold flex items-center justify-center bg-blue-500 text-white rounded-sm"
                    onClick={() => navigate(`/task/${task._id}`)}
                  >
                    <BsFillFolderSymlinkFill class="mr-2" /> Details
                  </button>
                </div>

                <div className="grid grid-cols-2 text-center">
                  <p className="col-span-1 font-bold">
                    <span className="text-gray-500 font-medium">Title :</span>{" "}
                    {task.title}
                  </p>
                  <p className="col-span-1 font-bold">
                    <span className="text-gray-500 font-medium">
                      Speciality :
                    </span>
                    {task.speciality.specialityName}
                  </p>
                  <p className="col-span-1 font-bold">
                    <span className="text-gray-500 font-medium">Client :</span>{" "}
                    {task.client.clientname}
                  </p>
                  <p className="col-span-1 font-bold">
                    <span className="text-gray-500 font-medium">
                      Created By :
                    </span>{" "}
                    {task.created_by && task.created_by.fullname}
                  </p>
                  <p className="col-span-1 font-bold">
                    <span className="text-gray-500 font-medium">
                      Deadline :
                    </span>{" "}
                    {task.deadline.split("T")[0]}
                  </p>
                  {task.freelancer && (
                    <p className="col-span-1 font-bold">
                      <span className="text-gray-500 font-medium">
                        Freelancer :
                      </span>{" "}
                      {task.freelancer.freelancername}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="row col-12  p-2 text-center">
              <h3 className=" text-danger ">
                This User Didn't Do Any Tasks Yet
              </h3>
            </div>
          ))}
        {dateFilterData &&
          (DateFilter && !DateFilter.length == 0 ? (
            DateFilter.map((task) => (
              <div key={task._id} className="bg-white p-2 py-3 my-1">
                <div className="text-center border flex">
                  <span
                    className={`flex-1 p-3 rounded-sm ${
                      task.taskStatus.statusname === "pending"
                        ? "bg-warning"
                        : task.taskStatus.statusname === "waiting offer"
                        ? "waiting-offer text-white"
                        : task.taskStatus.statusname === "approved"
                        ? "bg-info"
                        : task.taskStatus.statusname === "working on"
                        ? "bg-primary"
                        : task.taskStatus.statusname === "done"
                        ? "bg-success"
                        : task.taskStatus.statusname === "delivered"
                        ? "bg-secondary"
                        : task.taskStatus.statusname === "rejected"
                        ? "bg-danger"
                        : task.taskStatus.statusname === "not available"
                        ? "bg-dark text-white"
                        : task.taskStatus.statusname === "on going"
                        ? "on-going text-white"
                        : task.taskStatus.statusname === "offer submitted"
                        ? "offer-submitted"
                        : task.taskStatus.statusname === "edit"
                        ? "edit"
                        : task.taskStatus.statusname === "cancel"
                        ? "cancel"
                        : "anystatus"
                    }`}
                  >
                    {task.taskStatus.statusname.charAt(0).toUpperCase() +
                      task.taskStatus.statusname.slice(1)}
                  </span>
                </div>

                <div className="flex items-center justify-between my-2 p-0">
                  <div className="p-3 font-bold flex items-center justify-center bg-gray-400 text-white rounded-sm">
                    <span className="">{task.serialNumber}</span>
                  </div>
                  <button
                    className="p-3 font-bold flex items-center justify-center bg-blue-500 text-white rounded-sm"
                    onClick={() => navigate(`/task/${task._id}`)}
                  >
                    <BsFillFolderSymlinkFill class="mr-2" /> Details
                  </button>
                </div>

                <div className="grid grid-cols-2 text-center">
                  <p className="col-span-1 font-bold">
                    <span className="text-gray-500 font-medium">Title :</span>{" "}
                    {task.title}
                  </p>
                  <p className="col-span-1 font-bold">
                    <span className="text-gray-500 font-medium">
                      Speciality :
                    </span>
                    {task.speciality.specialityName}
                  </p>
                  <p className="col-span-1 font-bold">
                    <span className="text-gray-500 font-medium">Client :</span>{" "}
                    {task.client.clientname}
                  </p>
                  <p className="col-span-1 font-bold">
                    <span className="text-gray-500 font-medium">
                      Created By :
                    </span>{" "}
                    {task.created_by && task.created_by.fullname}
                  </p>
                  <p className="col-span-1 font-bold">
                    <span className="text-gray-500 font-medium">
                      Deadline :
                    </span>{" "}
                    {task.deadline.split("T")[0]}
                  </p>
                  {task.freelancer && (
                    <p className="col-span-1 font-bold">
                      <span className="text-gray-500 font-medium">
                        Freelancer :
                      </span>{" "}
                      {task.freelancer.freelancername}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-2">
              <h3 className="text-3xl text-red-500">
                This User Didn't Do Any Tasks Yet
              </h3>
            </div>
          ))}
      </div>
      {/* Tasks */}
    </>
  );
};

export default UserDetails;
