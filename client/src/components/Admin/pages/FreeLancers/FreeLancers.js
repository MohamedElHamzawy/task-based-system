import "./FreeLancers.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import { SiFreelancer } from "react-icons/si";
import { FiFilter } from "react-icons/fi";

//search filter
const getSearchFilter = (searchName, freeLancers) => {
  if (!searchName) {
    return freeLancers;
  }
  return freeLancers.filter((freeLancer) =>
    freeLancer.freelancername.toLowerCase().includes(searchName.toLowerCase())
  );
};

// Speciality filter
const getSpecialityFilter = (speciality, freeLancers) => {
  if (!speciality) {
    return freeLancers;
  }
  return freeLancers.filter((freeLancer) =>
    freeLancer.speciality._id.includes(speciality)
  );
};

const FreeLancers = () => {
  const [freeLancers, setFreeLancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [specialities, setSpecialities] = useState([]);

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios
          .get(" http://localhost:5000/api/freelancer/")
          .then((res) => {
            setFreeLancers(res.data.freelancers);

            setLoading(false);
            setIsLoading(false);
          });
      });
      timerId = setTimeout(async () => {
        await axios
          .get(" http://localhost:5000/api/speciality/")
          .then((res) => {
            setSpecialities(res.data.specialities);
          });
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  const [speciality, setSpeciality] = useState("");
  const [searchName, setSearchName] = useState("");
  const [sortedFreelancers, setSortedFreelancers] = useState("");

  const [searchFilterData, setSearchFilterData] = useState(true);
  const [SpecialityFilterData, setSpecialityFilterData] = useState(false);
  const [sortFilterData, setSortFilterData] = useState(false);

  const searchFilter = getSearchFilter(searchName, freeLancers);
  const SpecialityFilter = getSpecialityFilter(speciality, freeLancers);

  const sortHandler = async (value) => {
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        " http://localhost:5000/api/freelancer/sort/filter/",
        {
          sort: value,
        }
      );
      const responseData = await response;
      if (!(response.statusText === "OK")) {
        throw new Error(responseData.data.message);
      }
      setSortedFreelancers(response.data.freelancers);

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
    <div className="row w-100 p-0 m-0 ">
      <div className="col-12 row text-center system-head p-2">
        <div className="col-6 col-md-3">
          <h1 className="logo text-white bg-danger p-2">Admin</h1>
        </div>
        <h1 className="col-12 col-md-6 text-center  fw-bold">
          System FreeLancers
        </h1>
      </div>

      <div className="row p-0 m-0 ">
        <div className="col-10 col-sm-6 col-lg-3 p-2">
          <input
            type="name"
            className="search p-2 w-100"
            placeholder=" Search By Name"
            value={searchName}
            onChange={(e) => {
              setSearchName(e.target.value);
              setSpecialityFilterData(false);
              setSearchFilterData(true);
              setSortFilterData(false);
              setSpeciality("");
            }}
          />
        </div>

        <div className="col-12 col-sm-5 col-lg-3 text-secondary row p-2">
          <label htmlFor="Speciality" className="mt-2 col-4 col-sm-5 text-end">
            {" "}
            <FiFilter className="" /> Filter:
          </label>
          <select
            id="speciality"
            name="speciality"
            className="search col-8 col-sm-7 p-2"
            value={speciality}
            onChange={(e) => {
              setSpeciality(e.target.value);
              setSpecialityFilterData(true);
              setSearchFilterData(false);
              setSortFilterData(false);
              setSearchName("");
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
        </div>

        <div className="col-12 col-sm-7 col-lg-3 text-secondary row p-2">
          <label htmlFor="role" className="mt-2 col-4 col-sm-5 text-end">
            {" "}
            <FiFilter /> Sort:
          </label>
          <select
            id="role"
            name="role"
            className=" search col-8 col-sm-7 p-2"
            onChange={(e) => {
              sortHandler(e.target.value);
              setSearchFilterData(false);
              setSpecialityFilterData(false);
              setSortFilterData(true);
              setSearchName("");
              setSpeciality("");
            }}
          >
            <option value="" className="text-secondary">
              sort
            </option>
            <option value="completed">Completed</option>
            <option value="profit">Profit</option>
          </select>
        </div>

        <div className="col-12 col-sm-5 col-lg-3 p-2 text-center">
          <button
            onClick={() => {
              window.location.href = "/addfreeLancer";
            }}
            className="new-user p-2"
          >
            <SiFreelancer className="fs-3" /> Add New FreeLancer
          </button>
        </div>
      </div>

      <div className=" w-100 row p-0 m-0 mt-2 justify-content-center">
        {searchFilterData ? (
          !searchFilter.length == 0 ? (
            searchFilter.map((freeLancer) => (
              <div
                key={freeLancer._id}
                className="task-card bg-white  p-2 py-3 row users-data col-11 my-1"
              >
                <div className="col-12 fw-bold row text-start">
                  <div className="col-12 p-2 ">
                    <SiFreelancer className="fs-1 text-danger" />
                  </div>

                  <p className="col-12 col-sm-6 col-md-4 edit-form-p fw-bold">
                    {" "}
                    <span className="edit-form-lable">Name : </span>
                    <a
                      className="text-dark fw-bold"
                      href={`/freeLancer/${freeLancer._id}`}
                    >
                      {freeLancer.freelancername}
                    </a>
                  </p>
                  <p className="col-12 col-sm-6 col-md-4 edit-form-p ">
                    <span className="edit-form-lable">Speciality :</span>{" "}
                    {freeLancer.speciality &&
                      freeLancer.speciality.sub_speciality}
                  </p>

                  <p className="col-12 col-sm-6 col-md-4 edit-form-p fw-bold">
                    {" "}
                    <span className="edit-form-lable">TaskCount :</span>{" "}
                    {freeLancer.tasksCount}
                  </p>
                  <p className="col-12 col-sm-6 col-md-4 edit-form-p fw-bold">
                    {" "}
                    <span className="edit-form-lable">
                      CompletedTasks :
                    </span>{" "}
                    {freeLancer.completedCount}
                  </p>
                  <p className="col-12 col-sm-6 col-md-4 edit-form-p fw-bold">
                    {" "}
                    <span className="edit-form-lable">TotalCost :</span>{" "}
                    {freeLancer.totalGain}
                  </p>
                  <p className="col-12 col-sm-6 col-md-4 edit-form-p fw-bold">
                    {" "}
                    <span className="edit-form-lable">TotalProfit :</span>{" "}
                    {freeLancer.totalProfit}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="row  p-3 m-0 text-center">
              <h2>There Is No FreeLancers</h2>
            </div>
          )
        ) : (
          ""
        )}

        {SpecialityFilterData ? (
          !SpecialityFilter.length == 0 ? (
            SpecialityFilter.map((freeLancer) => (
              <div
                key={freeLancer._id}
                className="task-card bg-white  p-2 py-3 row users-data col-11 my-1"
              >
                <div className="col-12 fw-bold row text-start">
                  <div className="col-12 p-2 ">
                    <SiFreelancer className="fs-1 text-danger" />
                  </div>

                  <p className="col-12 col-sm-6 col-md-4 edit-form-p fw-bold">
                    {" "}
                    <span className="edit-form-lable">Name : </span>
                    <a
                      className="text-dark fw-bold"
                      href={`/freeLancer/${freeLancer._id}`}
                    >
                      {freeLancer.freelancername}
                    </a>
                  </p>
                  <p className="col-12 col-sm-6 col-md-4 edit-form-p ">
                    <span className="edit-form-lable">Speciality :</span>{" "}
                    {freeLancer.speciality &&
                      freeLancer.speciality.sub_speciality}
                  </p>
                  <p className="col-12 col-sm-6 col-md-4 edit-form-p fw-bold">
                    {" "}
                    <span className="edit-form-lable">TaskCount :</span>{" "}
                    {freeLancer.tasksCount}
                  </p>
                  <p className="col-12 col-sm-6 col-md-4 edit-form-p fw-bold">
                    {" "}
                    <span className="edit-form-lable">
                      CompletedTasks :
                    </span>{" "}
                    {freeLancer.completedCount}
                  </p>
                  <p className="col-12 col-sm-6 col-md-4 edit-form-p fw-bold">
                    {" "}
                    <span className="edit-form-lable">TotalCost :</span>{" "}
                    {freeLancer.totalGain}
                  </p>
                  <p className="col-12 col-sm-6 col-md-4 edit-form-p fw-bold">
                    {" "}
                    <span className="edit-form-lable">TotalProfit :</span>{" "}
                    {freeLancer.totalProfit}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="row  p-3 m-0 text-center">
              <h2>There Is No FreeLancers</h2>
            </div>
          )
        ) : (
          ""
        )}
        {sortFilterData ? (
          !sortedFreelancers.length == 0 ? (
            sortedFreelancers.map((freeLancer) => (
              <div
                key={freeLancer._id}
                className="task-card bg-white  p-2 py-3 row users-data col-11 my-1"
              >
                <div className="col-12 fw-bold row text-start">
                  <div className="col-12 p-2 ">
                    <SiFreelancer className="fs-1 text-danger" />
                  </div>

                  <p className="col-12 col-sm-6 col-md-4 edit-form-p fw-bold">
                    {" "}
                    <span className="edit-form-lable">Name : </span>
                    <a
                      className="text-dark fw-bold"
                      href={`/freeLancer/${freeLancer._id}`}
                    >
                      {freeLancer.freelancername}
                    </a>
                  </p>
                  <p className="col-12 col-sm-6 col-md-4 edit-form-p ">
                    <span className="edit-form-lable">Speciality :</span>{" "}
                    {freeLancer.speciality &&
                      freeLancer.speciality.sub_speciality}
                  </p>
                  <p className="col-12 col-sm-6 col-md-4 edit-form-p fw-bold">
                    {" "}
                    <span className="edit-form-lable">TaskCount :</span>{" "}
                    {freeLancer.tasksCount}
                  </p>
                  <p className="col-12 col-sm-6 col-md-4 edit-form-p fw-bold">
                    {" "}
                    <span className="edit-form-lable">
                      CompletedTasks :
                    </span>{" "}
                    {freeLancer.completedCount}
                  </p>
                  <p className="col-12 col-sm-6 col-md-4 edit-form-p fw-bold">
                    {" "}
                    <span className="edit-form-lable">TotalCost :</span>{" "}
                    {freeLancer.totalGain}
                  </p>
                  <p className="col-12 col-sm-6 col-md-4 edit-form-p fw-bold">
                    {" "}
                    <span className="edit-form-lable">TotalProfit :</span>{" "}
                    {freeLancer.totalProfit}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="row  p-3 m-0 text-center">
              <h2>There Is No FreeLancers</h2>
            </div>
          )
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default FreeLancers;
