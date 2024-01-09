import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import "./Tasks.css";
import { FaSortAmountDownAlt } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import Filter from "../../../Filter";

import GetCookie from "../../../../hooks/getCookie";
import { useNavigate } from "react-router";

//search filter
const getSearchFilter = (searchName, tasks) => {
  if (!searchName) {
    return tasks;
  }
  return tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchName.toLowerCase()) ||
      task.serialNumber.includes(searchName)
  );
};

const Tasks = () => {
  const token = GetCookie("AdminToken");
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const [tasks, setTasks] = useState([]);

  const [specialities, setSpecialities] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [countries, setCountries] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);

  const [tasksCount, setTasksCount] = useState();
  const [totalGain, setTotalGain] = useState();
  const [totalCost, setTotalCost] = useState();
  const [totalProfit, setTotalProfit] = useState();
  const [completedCount, setCompletedCount] = useState();
  const [totalProfitPercentage, setTotalProfitPercentage] = useState();
  const [filterOpen, setFilterOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URL}:5000/api/status/`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            setStatuses(res.data.statuses);
          });
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
      timerId = setTimeout(async () => {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URL}:5000/api/freelancer/`)
          .then((res) => {
            setFreelancers(res.data.freelancers);
          });
      });
      timerId = setTimeout(async () => {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URL}:5000/api/client/`)
          .then((res) => {
            setClients(res.data.clients);
          });
      });
      timerId = setTimeout(async () => {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URL}:5000/api/user/`)
          .then((res) => {
            setUsers(res.data.users);
          });
      });
      timerId = setTimeout(async () => {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URL}:5000/api/task/`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            setTasks(res.data.tasks);

            setTasksCount(res.data.tasksCount);
            setTotalCost(res.data.totalCost);
            setTotalGain(res.data.totalGain);
            setTotalProfit(res.data.totalProfit);
            setCompletedCount(res.data.completedCount);
            setTotalProfitPercentage(res.data.totalProfitPercentage);
          });
        setIsLoading(false);
        setLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  const [searchName, setSearchName] = useState("");

  const [speciality, setSpeciality] = useState("");
  const [status, setStatus] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [freelancer, setFreelancer] = useState("");
  const [client, setClient] = useState("");
  const [country, setCountry] = useState("");
  const [user, setUser] = useState("");
  const [sort, setSort] = useState("");

  const [searchFilterData, setSearchFilterData] = useState(true);
  const [allFilterData, setAllFilterData] = useState(false);

  const searchFilter = getSearchFilter(searchName, tasks);

  const [filterData, setFilterData] = useState([]);

  //Filter Handler
  const filterHandler = async () => {
    setAllFilterData(true);
    setSearchFilterData(false);
    setSearchName("");
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/task/filter/result/`,
        {
          speciality: speciality,
          status: status,
          country: country,
          start: start,
          end: end,
          freelancer: freelancer,
          client: client,
          user: user,
          sort: sort,
        }
      );
      const responseData = await response;
      if (!(response.statusText === "OK")) {
        throw new Error(responseData.data.message);
      }
      setFilterData(response.data.tasks);

      setTasksCount(response.data.tasksCount);
      setTotalCost(response.data.totalCost);
      setTotalGain(response.data.totalGain);
      setTotalProfit(response.data.totalProfit);
      setCompletedCount(response.data.completedCount);
      setTotalProfitPercentage(response.data.totalProfitPercentage);

      setLoading(false);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err.message && "SomeThing Went Wrong , Please Try Again .");
    }
  };

  const clearFilterHandler = () => {
    setSearchFilterData(true);
    setAllFilterData(false);
    setFreelancer("");
    setClient("");
    setSearchName("");
    setCountry("");
    setSpeciality("");
    setStatus("");
    setStart("");
    setEnd("");
    setUser("");
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

  const sortHandler = async () => {
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/task/filter/result`,
        {
          sort: sort,
        }
      );
      const responseData = await response;
      if (!(response.statusText === "OK")) {
        throw new Error(responseData.data.message);
      }
      console.log(response.data.tasks);
      setTasks(response.data.tasks);
      setLoading(false);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err.message && "SomeThing Went Wrong , Please Try Again .");
    }
  };

  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="border-red-500 min-h-[calc(100vh-100px)] ml-44 py-4 flex flex-col space-y-2">
      <Filter
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
        applyFunction={filterHandler}
        clear={clearFilterHandler}
      >
        <div className="flex flex-col w-full">
          <label className="">From:</label>
          <input
            type="date"
            className="w-full"
            value={start}
            onChange={(e) => {
              setStart(e.target.value);
            }}
          />
          <label className="">To:</label>
          <input
            type="date"
            className="w-full"
            value={end}
            onChange={(e) => {
              setEnd(e.target.value);
            }}
          />
        </div>
        <select
          id="speciality"
          name="speciality"
          className="w-full"
          value={speciality}
          onChange={(e) => {
            setSpeciality(e.target.value);
          }}
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
        <select
          id="status"
          name="status"
          className="w-full"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
          }}
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

        <select
          id="freelancers"
          name="freelancers"
          className="w-full"
          value={freelancer}
          onChange={(e) => {
            setFreelancer(e.target.value);
          }}
        >
          <option value="" className="text-secondary">
            Freelanceres
          </option>
          {freelancers.map((freelancer) => (
            <option value={freelancer._id} key={freelancer._id}>
              {freelancer.freelancername}
            </option>
          ))}
        </select>

        <select
          id="clients"
          name="clients"
          className="w-full"
          value={client}
          onChange={(e) => {
            setClient(e.target.value);
          }}
        >
          <option value="" className="text-secondary">
            Clients
          </option>
          {clients.map((client) => (
            <option value={client._id} key={client._id}>
              {client.clientname}
            </option>
          ))}
        </select>

        <select
          id="users"
          name="users"
          className="w-full"
          value={user}
          onChange={(e) => {
            setUser(e.target.value);
          }}
        >
          <option value="" className="text-secondary">
            Users
          </option>
          {users.map((user) => (
            <option value={user._id} key={user._id}>
              {user.username}
            </option>
          ))}
        </select>

        <select
          id="countries"
          name="countries"
          className="w-full"
          value={country}
          onChange={(e) => {
            setCountry(e.target.value);
          }}
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
      </Filter>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl">Tasks</h1>
        <div className="">FILTERS</div>
      </div>

      <div className="flex items-center justify-between">
        <input
          type="text"
          className="w-1/3 p-2 border border-gray-400 rounded-md"
          placeholder="Search By Name or ID"
          value={searchName}
          onChange={(e) => {
            setSearchName(e.target.value);
            setSearchFilterData(true);
            setAllFilterData(false);
            setFreelancer("");
            setClient("");
            setCountry("");
            setSpeciality("");
            setStatus("");
            setStart("");
            setEnd("");
            setUser("");
          }}
        />
        <button
          className="text-white px-4 py-2 flex items-center rounded-sm transition-all duration-100 active:scale-95"
          style={{ backgroundColor: "#00E38C" }}
          type="button"
          onClick={() => navigate("/addtask")}
        >
          <IoMdAdd className="text-xl" />
          Add New Task
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white drop-shadow rounded flex flex-col justify-center px-4 pt-4 pb-1 border">
          <div className="flex items-center justify-between space-x-8">
            <div className="text-center">
              <h2 className="text-lg text-gray-400 font-semibold">
                Task Count
              </h2>
              <h2 className="text-2xl font-medium">
                {tasksCount ? tasksCount : "0"}
              </h2>
            </div>
            <div className="text-center">
              <h2 className="text-lg text-gray-400 font-semibold">
                Completed Count
              </h2>
              <h2 className="text-2xl font-medium">
                {completedCount ? completedCount : "0"}
              </h2>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center m-0 p-0">
            <h2 className="text-base text-sky-800 font-semibold m-0 p-0">
              Task Completion - {(completedCount / tasksCount) * 100} %
            </h2>
            <div className="w-2/3 bg-gray-300 rounded-full h-1.5">
              <div
                className="bg-green-400 h-1.5 rounded-full"
                style={{ width: `${(completedCount / tasksCount) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white drop-shadow rounded col-span-2 flex justify-between p-4">
          {[
            { label: "Total Gain", data: totalGain },
            { label: "Total Cost", data: totalCost },
            { label: "Total Profit", data: totalProfit },
            { label: "Profit Percentage", data: totalProfitPercentage },
          ].map((item, index) => (
            <div
              key={item.label}
              className="relative w-1/4 h-full flex items-center justify-between space-x-0.5"
            >
              <div className="text-center h-full">
                <h2 className="text-lg text-gray-400 font-semibold">
                  {item.label}
                </h2>
                <h2 className="text-2xl font-medium">
                  {item.label == "Profit Percentage" ? (
                    <span className="text-green-500">
                      {item.data ? (item.data * 100).toFixed(2) : "0"} %
                    </span>
                  ) : (
                    <span>{item.data ? item.data : "0"}</span>
                  )}
                </h2>
              </div>

              {index !== 0 && (
                <div className="absolute top-auto -left-8 w-[1.7px] h-2/3 my bg-black my-6"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="w-1/2 flex items-center space-x-2">
          <button
            type="button"
            className="py-1 px-4 border-2 border-blue-600 text-blue-600 rounded transition-all hover:bg-blue-600 hover:text-white active:scale-95"
          >
            Details
          </button>
          <button
            type="button"
            className="py-1 px-4 border-2 border-blue-600 text-blue-600 rounded transition-all hover:bg-blue-600 hover:text-white active:scale-95"
          >
            Download
          </button>
        </div>
        <div className="w-1/2 flex items-center justify-between space-x-2">
          <div className="flex items-center space-x-1">
            <input
              type="checkbox"
              name="prioriity"
              id="prioriity"
              className="appearance-non"
            />
            <label htmlFor="priority">Show High Priority Tasks</label>
          </div>
          <div className="w-1/2 flex items-center space-x-1">
            <FaSortAmountDownAlt />
            <select
              id="Sort"
              name="Sort"
              className="flex-1"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                sortHandler();
              }}
            >
              <option value="" selected disabled className="text-secondary">
                Sort By
              </option>
              <option value="date" className="">
                Date
              </option>
              <option value="profit" className="">
                Profit
              </option>
            </select>
          </div>
        </div>
      </div>

      {searchFilterData &&
        (!searchFilter.length == 0 ? (
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
              {searchFilter.map((task, index) => (
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
          <div className="text-center">
            <h2>There Is No Tasks</h2>
          </div>
        ))}

      {allFilterData &&
        (!filterData.length == 0 ? (
          <table className="table-auto w-full rounded-lg overflow-hidden text-center">
            <thead>
              <tr className="drop-shadow bg-white text-cyan-600">
                <th className="px-4 py-3 font-medium text-sm">ID</th>
                <th className="px-4 py-3 font-medium text-sm">Title</th>
                <th className="px-4 py-3 font-medium text-sm">Client</th>
                <th className="px-4 py-3 font-medium text-sm">Freelancer</th>
                <th className="px-4 py-3 font-medium text-sm">Profit</th>
                <th className="px-4 py-3 font-medium text-sm">Deadline</th>
                <th className="px-4 py-3 font-medium text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {filterData.map((task, index) => (
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
          <div className="row  p-3 m-0 text-center">
            <h2>There Is No Tasks</h2>
          </div>
        ))}
    </div>
  );
};

export default Tasks;
