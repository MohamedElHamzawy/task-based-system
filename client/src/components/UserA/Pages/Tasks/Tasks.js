import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import "./Tasks.css";
import { FaTasks } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";

import { BsFillFolderSymlinkFill } from "react-icons/bs";
import { AiOutlineClear } from "react-icons/ai";

import GetCookie from "../../../../hooks/getCookie";

//search filter
// const getSearchFilter = (searchName, tasks) => {
//   if (!searchName) {
//     return tasks;
//   }
//   return tasks.filter(
//     (task) =>
//       task.title.toLowerCase().includes(searchName.toLowerCase()) ||
//       task.serialNumber.includes(searchName)
//   );
// };

const Tasks = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const token = GetCookie("UserA");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const [specialities, setSpecialities] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [countries, setCountries] = useState([]);
  const [clients, setClients] = useState([]);

  const [speciality, setSpeciality] = useState("");
  const [status, setStatus] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [client, setClient] = useState("");
  const [country, setCountry] = useState("");

  const [searchName, setSearchName] = useState("");

  const [searchFilterData, setSearchFilterData] = useState(true);
  const [allFilterData, setAllFilterData] = useState(false);

  const [searchFilter, setSearchFilter] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const [filterData, setFilterData] = useState([]);

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios
          .get(" https://smarteduservices.com:5000/api/status/filter/all/", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            setStatuses(res.data.statuses);
          });
      });
      timerId = setTimeout(async () => {
        await axios
          .get(" https://smarteduservices.com:5000/api/speciality/")
          .then((res) => {
            setSpecialities(res.data.specialities);
          });
      });
      timerId = setTimeout(async () => {
        await axios
          .get(" https://smarteduservices.com:5000/api/country/")
          .then((res) => {
            setCountries(res.data.countries);
          });
      });
      timerId = setTimeout(async () => {
        await axios
          .get(" https://smarteduservices.com:5000/api/client/")
          .then((res) => {
            setClients(res.data.clients);
          });
      });
      timerId = setTimeout(async () => {
        await axios
          .get(
            `https://smarteduservices.com:5000/api/task/?limit=${limit}&page=${page}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          .then((res) => {
            setTasks(res.data.tasks);
            setSearchFilter(res.data.tasks);
          });
        setIsLoading(false);
        setLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

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
        `https://smarteduservices.com:5000/api/task/filter/result/customer?limit=${limit}&page=${page}`,
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

  const searchHandler = async (e) => {
    setSearchName(e.target.value);
    if (e.target.value === "") {
      setSearchFilterData(tasks);
    }
    try {
      // loading
      setIsSearchLoading(true);
      const { data } = await axios.get(
        `https://smarteduservices.com:5000/api/task/search/result?limit=${limit}&page=${page}&searchValue=${e.target.value}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSearchFilter(data.tasks);
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.message);
      } else {
        console.log(error.message);
      }
    } finally {
      setIsSearchLoading(false);
      setSearchFilterData(true);
      setAllFilterData(false);
      setClient("");
      setCountry("");
      setSpeciality("");
      setStatus("");
      setStart("");
      setEnd("");
    }
  };

  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="row w-100 p-0 m-0 justify-content-center">
      <div className="col-12 row text-center system-head p-2">
        <div className="col-10 col-md-6 col-lg-4">
          <h1 className="logo text-white bg-danger p-2">Customer Service</h1>
        </div>
        <h1 className="col-12 col-md-6 text-center  fw-bold">System Tasks</h1>
      </div>

      <div className="row p-0 m-0 justify-content-center">
        <label
          htmlFor="Speciality"
          className="my-3 col-2 col-md-1 text-start text-muted"
        >
          Filter:
        </label>

        <div className="col-8 col-md-3 p-2">
          <input
            type="name"
            className="search p-2 w-100"
            placeholder="Search By Name or Serial Number"
            value={searchName}
            onChange={searchHandler}
          />
        </div>

        <div className="col-10 col-md-7 text-secondary row p-2">
          <label
            htmlFor="Speciality"
            className="mt-2 col-4 col-sm-2 text-start text-sm-end"
          >
            From:
          </label>
          <input
            type="date"
            className="search col-8 col-sm-4  p-2 mt-1"
            value={start}
            onChange={(e) => {
              setStart(e.target.value);
            }}
          />
          <label
            htmlFor="Speciality"
            className="mt-2 col-4 col-sm-2 text-start text-sm-end"
          >
            To:
          </label>
          <input
            type="date"
            className="search col-8 col-sm-4  p-2 mt-1"
            value={end}
            onChange={(e) => {
              setEnd(e.target.value);
            }}
          />
        </div>

        <div className="col-12  text-secondary row p-2 justify-content-center">
          <select
            id="speciality"
            name="speciality"
            className="search col-sm-4 col-md-3 col-lg-2 col-10  m-1 p-2"
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
            className="search col-sm-4 col-md-3 col-lg-2 col-10 p-2 m-1"
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
            className="search col-sm-4 col-md-3 col-lg-2 col-10 p-2 m-1"
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
            className="search col-sm-4 col-md-3 col-lg-2 col-10 p-2 m-1"
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
        </div>

        <div className="col-8 p-2 text-start ">
          <button onClick={filterHandler} className="filter-btn p-2 mx-1">
            <FiFilter className="fs-3" /> Filter
          </button>
          <button
            onClick={() => {
              setSearchFilterData(true);
              setAllFilterData(false);
              setClient("");
              setSearchName("");
              setCountry("");
              setSpeciality("");
              setStatus("");
              setStart("");
              setEnd("");
            }}
            className="clear-filter-btn p-2"
          >
            <AiOutlineClear className="fs-3" /> Clear
          </button>
        </div>
        <div className="col-7 col-sm-4 p-2 text-end">
          <button
            onClick={() => {
              window.location.href = "/addtask";
            }}
            className="new-user p-2"
          >
            <FaTasks className="fs-3" /> Add New Task
          </button>
        </div>
      </div>

      <div className="row justify-content-center p-0 m-0">
        {isSearchLoading ? (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {searchFilterData ? (
              !searchFilter.length == 0 ? (
                searchFilter.map((task) => (
                  <div
                    key={task._id}
                    className="task-card bg-white p-2 py-3 row users-data col-11 my-1"
                  >
                    <div className="col-12 fw-bold row text-center">
                      <span
                        className={
                          task.taskStatus.statusname == "pending"
                            ? "bg-warning p-3 status col-12 "
                            : task.taskStatus.statusname == "waiting offer"
                            ? "waiting-offer   p-3 status col-12 "
                            : task.taskStatus.statusname == "approved"
                            ? "bg-info   p-3 status col-12 "
                            : task.taskStatus.statusname == "working on"
                            ? "bg-primary   p-3 status col-12 "
                            : task.taskStatus.statusname == "done"
                            ? "bg-success  p-3 status col-12 "
                            : task.taskStatus.statusname == "delivered"
                            ? "bg-secondary  p-3 status col-12"
                            : task.taskStatus.statusname == "rejected"
                            ? "bg-danger   p-3 status col-12 "
                            : task.taskStatus.statusname == "not available"
                            ? "bg-dark   p-3 status col-12 "
                            : task.taskStatus.statusname == "on going"
                            ? "on-going  p-3 status col-12 "
                            : task.taskStatus.statusname == "offer submitted"
                            ? " offer-submitted   p-3 status col-12 "
                            : task.taskStatus.statusname == "edit"
                            ? "edit   p-3 status col-12 "
                            : task.taskStatus.statusname == "cancel"
                            ? "cancel   p-3 status col-12 "
                            : "anystatus  p-3 status col-12 "
                        }
                      >
                        {task.taskStatus.statusname}
                      </span>
                    </div>

                    <div className="col-12 row text-center justify-content-end my-2">
                      <div className="fw-bold col-5 col-sm-7 col-md-8 col-lg-10 text-center row p-0 m-0">
                        <span className="col-11 col-sm-7 col-md-4 col-lg-2 serial-number p-3">
                          {task.serialNumber}
                        </span>
                      </div>
                      <button
                        className="details-btn p-3 fw-bold col-7 col-sm-5 col-md-4 col-lg-2"
                        onClick={() => {
                          window.location.href = `/task/${task._id}`;
                        }}
                      >
                        <BsFillFolderSymlinkFill className="fs-4" /> Details
                      </button>
                    </div>
                    <p className="col-12 col-sm-6 edit-form-p fw-bold">
                      {" "}
                      <span className="edit-form-lable">Title :</span>{" "}
                      {task.title}
                    </p>
                    <p className="col-12 col-sm-6 edit-form-p fw-bold">
                      {" "}
                      <span className="edit-form-lable">Created At :</span>{" "}
                      {task.createdAt.split("T")[0]}
                    </p>
                    <p className="col-12 col-sm-6 edit-form-p fw-bold">
                      {" "}
                      <span className="edit-form-lable">Speciality :</span>{" "}
                      {task.speciality.sub_speciality}
                    </p>
                    <p className="col-12 col-sm-6 edit-form-p fw-bold">
                      {" "}
                      <span className="edit-form-lable">Client :</span>{" "}
                      {task.client.clientname}
                    </p>
                    <p className="col-12 col-sm-6 edit-form-p fw-bold">
                      {" "}
                      <span className="edit-form-lable">Country :</span>{" "}
                      {task.country.countryName}
                    </p>
                    <p className="col-12 col-sm-6 edit-form-p fw-bold">
                      {" "}
                      <span className="edit-form-lable">Created By :</span>{" "}
                      {task.created_by && task.created_by.fullname}
                    </p>
                    <p className="col-12 col-sm-6 edit-form-p fw-bold">
                      {" "}
                      <span className="edit-form-lable">Deadline :</span>{" "}
                      {task.deadline.split("T")[0]}
                    </p>
                    {task.paid ? (
                      <p className="col-12 col-sm-6 edit-form-p fw-bold">
                        {" "}
                        <span className="edit-form-lable">
                          Customer Price :{" "}
                        </span>
                        {task.paid}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                ))
              ) : (
                <div className="row  p-3 m-0 text-center">
                  <h2>There Is No Tasks</h2>
                </div>
              )
            ) : (
              ""
            )}{" "}
          </>
        )}

        {allFilterData ? (
          !filterData.length == 0 ? (
            filterData.map((task) => (
              <div
                key={task._id}
                className="task-card bg-white p-2 py-3 row users-data col-11 my-1"
              >
                <div className="col-12 fw-bold row text-center">
                  <span
                    className={
                      task.taskStatus.statusname == "pending"
                        ? "bg-warning p-3 status col-12 "
                        : task.taskStatus.statusname == "waiting offer"
                        ? "waiting-offer   p-3 status col-12 "
                        : task.taskStatus.statusname == "approved"
                        ? "bg-info   p-3 status col-12 "
                        : task.taskStatus.statusname == "working on"
                        ? "bg-primary   p-3 status col-12 "
                        : task.taskStatus.statusname == "done"
                        ? "bg-success  p-3 status col-12 "
                        : task.taskStatus.statusname == "delivered"
                        ? "bg-secondary  p-3 status col-12"
                        : task.taskStatus.statusname == "rejected"
                        ? "bg-danger   p-3 status col-12 "
                        : task.taskStatus.statusname == "not available"
                        ? "bg-dark   p-3 status col-12 "
                        : task.taskStatus.statusname == "on going"
                        ? "on-going  p-3 status col-12 "
                        : task.taskStatus.statusname == "offer submitted"
                        ? " offer-submitted   p-3 status col-12 "
                        : task.taskStatus.statusname == "edit"
                        ? "edit   p-3 status col-12 "
                        : task.taskStatus.statusname == "cancel"
                        ? "cancel   p-3 status col-12 "
                        : "anystatus  p-3 status col-12 "
                    }
                  >
                    {task.taskStatus.statusname}
                  </span>
                </div>

                <div className="col-12 row text-center justify-content-end my-2">
                  <div className="fw-bold col-5 col-sm-7 col-md-8 col-lg-10 text-center row p-0 m-0">
                    <span className="col-11 col-sm-7 col-md-4 col-lg-2 serial-number p-3">
                      {task.serialNumber}
                    </span>
                  </div>
                  <button
                    className="details-btn p-3 fw-bold col-7 col-sm-5 col-md-4 col-lg-2"
                    onClick={() => {
                      window.location.href = `/task/${task._id}`;
                    }}
                  >
                    <BsFillFolderSymlinkFill className="fs-4" /> Details
                  </button>
                </div>

                <p className="col-12 col-sm-6 edit-form-p fw-bold">
                  {" "}
                  <span className="edit-form-lable">Title :</span> {task.title}
                </p>
                <p className="col-12 col-sm-6 edit-form-p fw-bold">
                  {" "}
                  <span className="edit-form-lable">Created At :</span>{" "}
                  {task.createdAt.split("T")[0]}
                </p>
                <p className="col-12 col-sm-6 edit-form-p fw-bold">
                  {" "}
                  <span className="edit-form-lable">Speciality :</span>{" "}
                  {task.speciality.sub_speciality}
                </p>
                <p className="col-12 col-sm-6 edit-form-p fw-bold">
                  {" "}
                  <span className="edit-form-lable">Client :</span>{" "}
                  {task.client.clientname}
                </p>
                <p className="col-12 col-sm-6 edit-form-p fw-bold">
                  {" "}
                  <span className="edit-form-lable">Country :</span>{" "}
                  {task.country.countryName}
                </p>
                <p className="col-12 col-sm-6 edit-form-p fw-bold">
                  {" "}
                  <span className="edit-form-lable">Created By :</span>{" "}
                  {task.created_by && task.created_by.fullname}
                </p>
                <p className="col-12 col-sm-6 edit-form-p fw-bold">
                  {" "}
                  <span className="edit-form-lable">Deadline :</span>{" "}
                  {task.deadline.split("T")[0]}
                </p>
              </div>
            ))
          ) : (
            <div className="row  p-3 m-0 text-center">
              <h2>There Is No Tasks</h2>
            </div>
          )
        ) : (
          ""
        )}
        <h3 className="row p-0 m-0 justify-content-center">
          Current Page: {page}
        </h3>

        <div className="row p-0 m-0 justify-content-center">
          <div className="col-12 text-center p-2">
            <button
              className="p-2 m-1"
              onClick={() => {
                setPage(page - 1 < 1 ? 1 : page - 1);
                setLoading(true);
              }}
            >
              Prev
            </button>
            <button
              className="p-2 m-1"
              onClick={() => {
                setPage(page + 1);
                setLoading(true);
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
