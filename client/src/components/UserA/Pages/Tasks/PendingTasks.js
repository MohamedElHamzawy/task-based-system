import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import GetCookie from "../../../../hooks/getCookie";
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

// statuses filter
const getStatusFilter = (status, tasks) => {
  if (!status) {
    return tasks;
  }
  return tasks.filter((tasks) => tasks.taskStatus._id.includes(status));
};

const PendingTasks = () => {
  const token = GetCookie("UserA");
  const [tasks, setTasks] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

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
          .get(`${process.env.REACT_APP_BACKEND_URL}:5000/api/task/`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            setTasks(res.data.pendingTasks);
          });
        setIsLoading(false);
        setLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  const [status, setStatus] = useState("");

  const [searchName, setSearchName] = useState("");
  const [searchFilterData, setSearchFilterData] = useState(true);

  const [statusFilterData, setStatusFilterData] = useState(false);

  const searchFilter = getSearchFilter(searchName, tasks);

  const StatusFilter = getStatusFilter(status, tasks);

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
      <Filter filterOpen={filterOpen} setFilterOpen={setFilterOpen}>
        <select
          id="status"
          name="status"
          className="w-full"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setStatusFilterData(true);
            setSearchFilterData(false);
            setSearchName("");
          }}
        >
          <option value="" disabled className="text-secondary">
            Statuses
          </option>
          {statuses.map((status) => (
            <option value={status._id} key={status._id}>
              {status.statusname}
            </option>
          ))}
        </select>
      </Filter>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl">Pending Tasks</h1>
      </div>
      <div className="flex items-center justify-between">
        <input
          type="text"
          className="w-1/3 p-2 border border-gray-400 rounded-md"
          placeholder="Search By Name or Serial Number"
          value={searchName}
          onChange={(e) => {
            setSearchName(e.target.value);
            setSearchFilterData(true);
            setStatusFilterData(false);
            setStatus("");
          }}
        />
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

      {statusFilterData &&
        (!StatusFilter.length == 0 ? (
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
              {StatusFilter.map((task, index) => (
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

export default PendingTasks;
