import React, { useEffect, useReducer, useState } from "react";
import { validate, VALIDATOR_MINLENGTH } from "../../../../util/validators";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import { useNavigate, useParams } from "react-router-dom";
import { BsFillFolderSymlinkFill } from "react-icons/bs";
import DateFilterComponent from "../../../DateFilter";
import { RiDeleteBinFill } from "react-icons/ri";
import { FaCoins, FaTasks } from "react-icons/fa";
import { GiProfit } from "react-icons/gi";
import { AiOutlineFileDone } from "react-icons/ai";

// Date filter
const getDateFilter = (start, end, tasks) => {
  if (!start || !end) {
    return tasks;
  }
  return tasks.filter(
    (task) =>
      start <= new Date(task.deadline.split("T")[0]) &&
      new Date(task.deadline.split("T")[0]) <= end
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
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
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
  const [numberState, dispatclabel] = useReducer(numberReducer, {
    value: user.phone,
    isvalid: false,
    isTouched: false,
  });
  const numberChangeHandler = (event) => {
    dispatclabel({
      type: "CHANGE",
      number: event.target.value,
      validators: [VALIDATOR_MINLENGTH(11)],
    });
  };
  const numbertouchHandler = () => {
    dispatclabel({
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

  const onDateChange = (dates) => {
    const [start, end] = dates;
    setStart(start);
    setEnd(end);
    setDateFilterData(true);
    setwithoutFilterData(false);
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
        return "text-blue-500";
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

  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="flex flex-col w-full p-3 min-h-[calc(100vh-65px)]">
      <div className="relative flex items-center justify-between w-full p-1 mb-4">
        {/* <button
          className="absolute top-0 left-0 p-2 text-3xl"
          onClick={() => navigate("/users")}
        >
          <TiArrowBack />
        </button> */}
        <h2 className="text-center text-2xl font-bold lg:text-3xl">
          User Details
        </h2>
        <div>
          <DateFilterComponent
            startDate={start}
            endDate={end}
            onChange={onDateChange}
          />
        </div>
      </div>

      <div className="relative flex items-center justify-betwen border-2 space-x-8 rounded-md shadow p-4 bg-[#F4F7FC]">
        {user.user_role !== "admin" && (
          <button
            className="absolute top-2 right-1.5 w-10 h-10"
            onClick={deleteUserHandler}
          >
            <RiDeleteBinFill className="text-gray-400 w-10 h-10" />
          </button>
        )}

        <div className="w-1/2 grid grid-cols-2 gap-4">
          <div className="flex flex-col w-full">
            <label className="w-full font-bold">Full Name</label>
            <p
              className={
                !editFull ? "ml-2 text-gray-500 font-medium" : "hidden"
              }
            >
              {user.fullname}
            </p>

            {editFull && (
              <input
                type="text"
                placeholder={user.fullname}
                value={fullNameState.value}
                onChange={fullNameChangeHandler}
                onBlur={fullNameTouchHandler}
                isvalid={fullNameState.isvalid.toString()}
                className={`w-11/12 ml-2 rounded-sm p-2 ${
                  !fullNameState.isvalid &&
                  fullNameState.isTouched &&
                  "border-red-500"
                }`}
              />
            )}
          </div>

          <div className="flex flex-col w-full">
            <label className="w-full font-bold">User Name</label>
            <p
              className={
                !editFull ? "ml-2 text-gray-500 font-medium" : "hidden"
              }
            >
              {user.username}
            </p>
            {editFull && (
              <input
                type="text"
                placeholder={user.username}
                value={userNameState.value}
                onChange={userNameChangeHandler}
                onBlur={userNameTouchHandler}
                isvalid={userNameState.isvalid.toString()}
                className={`w-11/12 ml-2 rounded-sm p-2 ${
                  !userNameState.isvalid &&
                  userNameState.isTouched &&
                  "border-red-500"
                }`}
              />
            )}
          </div>

          <div className="flex flex-col w-full">
            <label className="w-full font-bold">Phone</label>
            <p
              className={
                !editFull ? "ml-2 text-gray-500 font-medium" : "hidden"
              }
            >
              {user.phone}
            </p>
            {editFull && (
              <input
                type="number"
                placeholder={user.phone}
                value={numberState.value}
                onChange={numberChangeHandler}
                onBlur={numbertouchHandler}
                isvalid={numberState.isvalid.toString()}
                className={`w-11/12 ml-2 rounded-sm p-2 ${
                  !numberState.isvalid &&
                  numberState.isTouched &&
                  "border-red-500"
                }`}
              />
            )}
          </div>

          <div className="flex flex-col w-full">
            <label className="w-full font-bold">Country</label>
            <p
              className={
                !editFull ? "ml-2 text-gray-500 font-medium" : "hidden"
              }
            >
              {user.country && user.country.countryName}
            </p>
            {editFull && (
              <select
                id="country"
                name="country"
                className="w-11/12 ml-2 rounded-sm p-2"
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
            )}
          </div>

          <div className="flex flex-col w-full">
            <label className="w-full font-bold">User Role</label>
            <p
              className={
                !editFull ? "ml-2 text-gray-500 font-medium" : "hidden"
              }
            >
              {user.user_role}
            </p>
            {editFull && (
              <select
                id="role"
                name="role"
                className="w-11/12 ml-2 rounded-sm p-2"
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
            )}
          </div>

          {visable && (
            <div className="flex flex-col w-full">
              <label className="w-full font-bold">Speciality</label>
              <p
                className={
                  !editFull ? "ml-2 text-gray-500 font-medium" : "hidden"
                }
              >
                {user.speciality && user.speciality.sub_speciality}
              </p>

              {editFull && (
                <select
                  id="speciality"
                  name="speciality"
                  className="w-11/12 ml-2 rounded-sm p-2"
                  value={userSpeciality}
                  onChange={(event) =>
                    specialityChangeHandler(event.target.value)
                  }
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
              )}
            </div>
          )}
          <div className="col-span-2 flex items-center justify-center space-x-2">
            {!editFull && user.user_role !== "admin" && (
              <button
                type="button"
                className="bg-cyan-600 rounded-sm transition-all hover:bg-cyan-400 text-white px-12 py-1"
                onClick={() => setEditFull(!editFull)}
              >
                Edit
              </button>
            )}
            {editFull && (
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
                  type="button"
                  className="bg-green-500 rounded-sm transition-all hover:bg-green-400 text-white px-3 py-1"
                  onClick={editUserHandler}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="bg-red-500 rounded-sm transition-all hover:bg-red-400 text-white px-3 py-1"
                  onClick={() => {
                    setEditFull(false);
                  }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        <div className="w-1/2 grid grid-cols-2 gap-2">
          <div className="bg-white rounded drop-shadow flex items-center space-x-2 px-4 py-2.5">
            <FaTasks className="bg-blue-100 text-blue-500 w-10 h-10 p-2 rounded" />
            <div>
              <h6 className="m-0 p-0 text-sm font-semibold">Tasks Count</h6>
              <h4 className="font-light ml-1 my-0 p-0">{user.tasksCount}</h4>
            </div>
          </div>
          <div className="bg-white rounded drop-shadow flex items-center space-x-2 px-4 py-2.5">
            <AiOutlineFileDone className="bg-orange-100 text-orange-500 w-10 h-10 p-2 rounded" />
            <div>
              <h6 className="m-0 p-0 text-sm font-semibold">Completed Count</h6>
              <h4 className="font-light ml-1 my-0 p-0">
                {user.completedCount}
              </h4>
            </div>
          </div>
          {user.user_role === "userB" ? (
            <div className="bg-white rounded drop-shadow flex items-center space-x-2 px-4 py-2.5">
              <FaCoins className="bg-teal-100 text-teal-500 w-10 h-10 p-2 rounded" />
              <div>
                <h6 className="m-0 p-0 text-sm font-semibold">Total Cost</h6>
                <h4 className="font-light ml-1 my-0 p-0">{user.totalCost}</h4>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded drop-shadow flex items-center space-x-2 px-4 py-2.5">
              <FaCoins className="bg-teal-100 text-teal-500 w-10 h-10 p-2 rounded" />
              <div>
                <h6 className="m-0 p-0 text-sm font-semibold">Total Gain</h6>
                <h4 className="font-light ml-1 my-0 p-0">{user.totalGain}</h4>
              </div>
            </div>
          )}

          <div className="bg-white rounded drop-shadow flex items-center space-x-2 px-4 py-2.5">
            <GiProfit className="bg-green-100 text-green-500 w-10 h-10 p-2 rounded" />
            <div>
              <h6 className="m-0 p-0 text-sm font-semibold">Total Profit</h6>
              <h4 className="font-light ml-1 my-0 p-0">{user.totalProfit}</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="py-3 drop-shadow">
        {withoutFilterData &&
          (userTasks && !userTasks.length == 0 ? (
            <table className="table-auto w-full rounded-lg overflow-hidden text-center">
              <thead>
                <tr className="drop-shadow bg-white text-cyan-600">
                  <th className="px-4 py-3 font-medium text-sm">ID</th>
                  <th className="px-4 py-3 font-medium text-sm w-1/5">Title</th>
                  <th className="px-4 py-3 font-medium text-sm">Client</th>
                  <th className="px-4 py-3 font-medium text-sm">Freelancer</th>
                  <th className="px-4 py-3 font-medium text-sm">Profit</th>
                  <th className="px-4 py-3 font-medium text-sm">Deadline</th>
                  <th className="px-4 py-3 font-medium text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {userTasks.map((task, index) => (
                  <tr
                    key={task._id}
                    className={`bg-white ${
                      index !== 0 && "border-t-4 border-[#F4F7FC]"
                    }`}
                  >
                    <td
                      className="cursor-pointer hover:underline px-4 py-3"
                      onClick={() => {
                        navigate(`/task/${task._id}`);
                      }}
                    >
                      {task.serialNumber}
                    </td>
                    <td className="px-4 py-3">{task.title}</td>
                    <td className="px-4 py-3">{task.client.clientname}</td>
                    <td className="px-4 py-3">
                      {task.freelancer ? task.freelancer.freelancername : "-"}
                    </td>
                    <td className="px-4 py-3">
                      {task.profit_amount || 0}{" "}
                      {task.task_currency && task.task_currency.currencyname}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(task.deadline).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div
                        className={`w-full rounded-md px-2 py-1 text-xs font-bold ${getRowClass(
                          task.taskStatus.statusname
                        )} ${getStatusClass(task.taskStatus.statusname)}`}
                      >
                        {task.taskStatus.statusname}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="row col-12 p-2 text-center">
              <h3 className="text-danger edit-form-lable">
                This User Didn't Do Any Tasks Yet
              </h3>
            </div>
          ))}
        {dateFilterData &&
          (DateFilter && !DateFilter.length == 0 ? (
            <table className="table-auto w-full rounded-lg overflow-hidden text-center">
              <thead>
                <tr className="drop-shadow bg-white text-cyan-600">
                  <th className="px-4 py-3 font-medium text-sm">ID</th>
                  <th className="px-4 py-3 font-medium text-sm w-1/5">Title</th>
                  <th className="px-4 py-3 font-medium text-sm">Client</th>
                  <th className="px-4 py-3 font-medium text-sm">Freelancer</th>
                  <th className="px-4 py-3 font-medium text-sm">Profit</th>
                  <th className="px-4 py-3 font-medium text-sm">Deadline</th>
                  <th className="px-4 py-3 font-medium text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {DateFilter.map((task, index) => (
                  <tr
                    key={task._id}
                    className={`bg-white ${
                      index !== 0 && "border-t-4 border-[#F4F7FC]"
                    }`}
                  >
                    <td
                      className="cursor-pointer hover:underline px-4 py-3"
                      onClick={() => {
                        navigate(`/task/${task._id}`);
                      }}
                    >
                      {task.serialNumber}
                    </td>
                    <td className="px-4 py-3">{task.title}</td>
                    <td className="px-4 py-3">{task.client.clientname}</td>
                    <td className="px-4 py-3">
                      {task.freelancer ? task.freelancer.freelancername : "-"}
                    </td>
                    <td className="px-4 py-3">
                      {task.profit_amount || 0}{" "}
                      {task.task_currency && task.task_currency.currencyname}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(task.deadline).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div
                        className={`w-full rounded-md px-2 py-1 text-xs font-bold ${getRowClass(
                          task.taskStatus.statusname
                        )} ${getStatusClass(task.taskStatus.statusname)}`}
                      >
                        {task.taskStatus.statusname}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center p-2">
              <h3 className="text-3xl text-red-500">
                This User Didn't Do Any Tasks Yet
              </h3>
            </div>
          ))}
      </div>
    </div>
  );
};

export default UserDetails;
