import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import Filter from "../../../Filter";
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

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
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URL}:5000/api/freelancer/`)
          .then((res) => {
            setFreeLancers(res.data.freelancers);

            setLoading(false);
            setIsLoading(false);
          });
      });
      timerId = setTimeout(async () => {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URL}:5000/api/speciality/`)
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
  const navigate = useNavigate();

  const sortHandler = async (value) => {
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/freelancer/sort/filter/`,
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
    <>
      <Filter filterOpen={filterOpen} setFilterOpen={setFilterOpen}>
        <select
          id="speciality"
          name="speciality"
          className="w-full focus:ring-0 focus:border-black"
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
          {specialities.map((speciality) => {
            if (speciality.sub_speciality === "All") return null;
            return (
              <option value={speciality._id} key={speciality._id}>
                {speciality.sub_speciality}
              </option>
            );
          })}
        </select>
        <select
          id="role"
          name="role"
          className="w-full focus:ring-0 focus:border-black"
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
      </Filter>
      <div className="min-h-[calc(100vh-100px)] ml-44">
        <div className="flex justify-between items-center my-8">
          <h1 className="text-2xl">System Users</h1>
          {/* <div className="">FILTERS</div> */}
        </div>
        <div className="py-4 rounded-sm">
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              className="rounded-sm w-1/3 drop-shadow-sm"
              placeholder="Search By Name"
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);
                setSpecialityFilterData(false);
                setSearchFilterData(true);
                setSortFilterData(false);
                setSpeciality("");
              }}
            />

            <button
              className="text-white px-4 py-2 flex items-center rounded-sm drop-shadow-sm"
              style={{ backgroundColor: "#00E38C" }}
              type="button"
              onClick={() => navigate("/addfreeLancer")}
            >
              <IoMdAdd className="text-xl" />
              Add New Freelancer
            </button>
          </div>

          <table className="transition-all table drop-shadow">
            <thead>
              <tr className="text-center">
                <th>
                  <p className="text-blue-500 m-0">Freelancer Name</p>
                </th>
                <th>
                  <p className="text-blue-500 m-0">Speciality</p>
                </th>
                <th>
                  <p className="text-blue-500 m-0">Task Count</p>
                </th>
                <th>
                  <p className="text-blue-500 m-0">Completed Tasks</p>
                </th>
                <th>
                  <p className="text-blue-500 m-0">Total Cost</p>
                </th>
                <th>
                  <p className="text-blue-500 m-0">Total Profit</p>
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              {searchFilterData &&
                (!searchFilter.length == 0 ? (
                  searchFilter.map((freelancer) => (
                    <tr key={freelancer._id}>
                      <td>
                        <Link
                          className="text-black no-underline hover:underline"
                          to={`/freeLancer/${freelancer._id}`}
                        >
                          {freelancer.freelancername}
                        </Link>
                      </td>
                      <td>
                        {freelancer.speciality &&
                          freelancer.speciality.sub_speciality}
                      </td>
                      <td>{freelancer.tasksCount}</td>
                      <td>{freelancer.completedCount}</td>
                      <td>{freelancer.totalGain}</td>
                      <td>{freelancer.totalProfit}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">There Is No Users</td>
                  </tr>
                ))}
              {SpecialityFilterData &&
                (!SpecialityFilter.length == 0 ? (
                  SpecialityFilter.map((freelancer) => (
                    <tr key={freelancer._id}>
                      <td>{freelancer.freelancername}</td>
                      <td>
                        {freelancer.speciality &&
                          freelancer.speciality.sub_speciality}
                      </td>
                      <td>{freelancer.tasksCount}</td>
                      <td>{freelancer.completedCount}</td>
                      <td>{freelancer.totalGain}</td>
                      <td>{freelancer.totalProfit}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">There Is No Users</td>
                  </tr>
                ))}
              {sortFilterData &&
                (!sortedFreelancers.length == 0 ? (
                  sortedFreelancers.map((freelancer) => (
                    <tr key={freelancer._id}>
                      <td>{freelancer.freelancername}</td>
                      <td>
                        {freelancer.speciality &&
                          freelancer.speciality.sub_speciality}
                      </td>
                      <td>{freelancer.tasksCount}</td>
                      <td>{freelancer.completedCount}</td>
                      <td>{freelancer.totalGain}</td>
                      <td>{freelancer.totalProfit}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">There Is No Users</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default FreeLancers;
