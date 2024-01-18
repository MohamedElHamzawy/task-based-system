import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import "./Tasks.css";
import { FaPlus, FaTasks } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";

import { BsFillFolderSymlinkFill } from "react-icons/bs";
import { AiOutlineClear } from "react-icons/ai";

import GetCookie from "../../../../hooks/getCookie";
import DateFilter from "../../../DateFilter";
import Filter from "../../../Filter";
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
  const token = GetCookie("UserA");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const [specialities, setSpecialities] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [countries, setCountries] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios
          .get(
            `${process.env.REACT_APP_BACKEND_URL}:5000/api/status/filter/all/`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
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
          .get(`${process.env.REACT_APP_BACKEND_URL}:5000/api/client/`)
          .then((res) => {
            setClients(res.data.clients);
          });
      });
      timerId = setTimeout(async () => {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URL}:5000/api/task/`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            setTasks(res.data.tasks);
          });
        setIsLoading(false);
        setLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  const [speciality, setSpeciality] = useState("");
  const [status, setStatus] = useState("");
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [client, setClient] = useState("");
  const [country, setCountry] = useState("");

  const [searchName, setSearchName] = useState("");

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
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/task/filter/result/customer`,
        {
          speciality: speciality,
          status: status,
          country: country,
          start: start,
          end: end,
          client: client,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const responseData = await response;

      setFilterData(response.data.tasks);

      setLoading(false);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err.message && "SomeThing Went Wrong , Please Try Again .");
    }
  };

  const [datePickerOpen] = useState(false);
  const onChange = (dates) => {
    const [start, end] = dates;
    setStart(start);
    setEnd(end);
  };

  const dateHandler = async () => {
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/task/filter/result`,
        {
          start: start,
          end: end,
        }
      );
      const responseData = await response;
      if (!(response.statusText === "OK")) {
        throw new Error(responseData.data.message);
      }
      setTasks(response.data.tasks);
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
    setClient("");
    setSearchName("");
    setCountry("");
    setSpeciality("");
    setStatus("");
    setStart("");
    setEnd("");
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

  const [filterOpen, setFilterOpen] = useState(false);
  const navigate = useNavigate();

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

  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="min-h-[calc(100vh-100px)] ml-44 py-4 flex flex-col space-y-2">
      <Filter
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
        applyFunction={filterHandler}
        clear={clearFilterHandler}
      >
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
          id="status"
          name="status"
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
          id="status"
          name="status"
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
        <div className="">
          <DateFilter
            startDate={start}
            endDate={end}
            onChange={onChange}
            datePickerOpen={datePickerOpen}
            dateHandler={dateHandler}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <input
          type="name"
          className="w-1/3 p-2 border border-gray-400 rounded-md"
          placeholder="Search By Name or Serial Number"
          value={searchName}
          onChange={(e) => {
            setSearchName(e.target.value);
            setSearchFilterData(true);
            setAllFilterData(false);
            setClient("");
            setCountry("");
            setSpeciality("");
            setStatus("");
            setStart("");
            setEnd("");
          }}
        />
        <button
          onClick={() => navigate("/addtask")}
          className="inline-flex items-center rounded-md border px-3 py-2 text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
        >
          <FaPlus className="mr-2" />
          Add New Task
        </button>
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
          <div className="row  p-3 m-0 text-center">
            <h2>There Is No Tasks</h2>
          </div>
        ))}

      {allFilterData &&
        (!filterData.length == 0 ? (
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
