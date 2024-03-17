import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import "./Tasks.css";
import { FaPlus, FaSortAmountDownAlt } from "react-icons/fa";
import Filter from "../../../Filter";

import GetCookie from "../../../../hooks/getCookie";
import { useNavigate } from "react-router";
import ReactDatePicker from "react-datepicker";
import DateFilter from "../../../DateFilter";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";
import TasksTable from "../../../TasksTable";

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
  const limit = 10;
  const [page, setPage] = useState(1);
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
        try {
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
        } catch (error) {
          setError(error.response.data.err);
          setIsLoading(false);
          setLoading(false);
        }
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  const [searchName, setSearchName] = useState("");

  const [speciality, setSpeciality] = useState("");
  const [status, setStatus] = useState("");
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
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
      setTasks(response.data.tasks);
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

  const errorHandler = () => {
    setError(null);
  };

  const onFirstPage = () => {
    setPage(1);
  };
  const onLastPage = () => {
    setPage(Math.ceil(tasksCount / limit));
  };
  const onNextPage = () => {
    setPage((prev) => prev + 1);
  };
  const onPreviousPage = () => {
    setPage((prev) => prev - 1);
  };

  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="min-h-[calc(100vh-65px)] ml-44 py-4 flex flex-col space-y-2">
      <ErrorModal error={error} onClear={errorHandler} />
      <Filter
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
        applyFunction={filterHandler}
        clear={clearFilterHandler}
      >
        {/* <div className="flex flex-col w-full">
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
        </div> */}
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
              {client?.clientname}
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
        <div className="w-1/3">
          <input
            type="text"
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
        </div>

        <button
          className="inline-flex items-center rounded-md border px-3 py-2 text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
          type="button"
          onClick={() => navigate("/addtask")}
        >
          <FaPlus className="mr-2" />
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
        <div className="w-1/5 flex items-center justify-between space-x-2">
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
            <option value="" defaultValue disabled className="text-secondary">
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

      {searchFilterData &&
        (!searchFilter.length == 0 ? (
          <TasksTable
            pagination
            page={page}
            totalPages={Math.ceil(tasksCount / limit)}
            onFirstPage={onFirstPage}
            onLastPage={onLastPage}
            onNextPage={onNextPage}
            onPreviousPage={onPreviousPage}
            tasks={searchFilter}
          />
        ) : (
          <div className="text-center">
            <h2>There Is No Tasks</h2>
          </div>
        ))}

      {allFilterData &&
        (!filterData.length == 0 ? (
          <TasksTable
            pagination
            page={page}
            totalPages={Math.ceil(tasksCount / limit)}
            onFirstPage={onFirstPage}
            onLastPage={onLastPage}
            onNextPage={onNextPage}
            onPreviousPage={onPreviousPage}
            tasks={filterData}
          />
        ) : (
          <div className="row  p-3 m-0 text-center">
            <h2>There Is No Tasks</h2>
          </div>
        ))}
    </div>
  );
};

export default Tasks;
