import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import { SiFreelancer } from "react-icons/si";
import { FaFilter, FaPlus } from "react-icons/fa";
import { RiDeleteBinFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import Filter from "../../../Filter";

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
  const [searchFilterData, setSearchFilterData] = useState(true);
  const [SpecialityFilterData, setSpecialityFilterData] = useState(false);

  const searchFilter = getSearchFilter(searchName, freeLancers);
  const SpecialityFilter = getSpecialityFilter(speciality, freeLancers);

  const deleteFreelancerHandler = async (id) => {
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/freelancer/${id}`
        //  ,
        //  { headers :{
        //     'Authorization':`Bearer ${token}`
        //   }
        // }
      );
      const responseData = await response;

      setError(responseData.data.message);
      setIsLoading(false);
      window.location.href = "/freelancers";
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "SomeThing Went Wrong , Please Try Again .");
    }
  };

  const [filterOpen, setFilterOpen] = useState(false);
  const navigate = useNavigate();

  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="justify-center min-h-[calc(100vh-100px)] ml-44">
      <Filter filterOpen={filterOpen} setFilterOpen={setFilterOpen}>
        <select
          id="speciality"
          name="speciality"
          className="w-full"
          value={speciality}
          onChange={(e) => {
            setSpeciality(e.target.value);
            setSpecialityFilterData(true);
            setSearchFilterData(false);
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
      </Filter>
      <div className="flex justify-between items-center my-8">
        <h1 className="text-2xl">System FreeLancers</h1>
      </div>

      <div className="flex items-center justify-between">
        <input
          type="search"
          className="rounded border px-3 py-2 shadow-sm w-1/3"
          placeholder="Search By Name"
          value={searchName}
          onChange={(e) => {
            setSearchName(e.target.value);
            setSpecialityFilterData(false);
            setSearchFilterData(true);
            setSpeciality("");
          }}
        />
        <button
          onClick={() => navigate("/addfreeLancer")}
          className="inline-flex items-center rounded-md border px-3 py-2 text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
        >
          <FaPlus className="mr-2" /> Add New Freelancer
        </button>
      </div>

      <div className="mt-2">
        {searchFilterData &&
          (!searchFilter.length == 0 ? (
            <table className="min-w-full divide-y divide-gray-200 drop-shadow">
              <thead className="bg-gray-50 text-cyan-600">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Country
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Task Count
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Completed Tasks
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Total Gain
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Total Profit
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Currency
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {searchFilter.map((freelancer) => (
                  <tr key={freelancer._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                        to={`/freelancer/${freelancer._id}`}
                      >
                        {freelancer.freelancername}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {freelancer.country.countryName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {freelancer.tasksCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {freelancer.completedCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {freelancer.totalGain}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {freelancer.totalProfit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {freelancer.currency && freelancer.currency.currencyname}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="row  p-3 m-0 text-center">
              <h2>There Is No FreeLancers</h2>
            </div>
          ))}
        {SpecialityFilterData &&
          (!SpecialityFilter.length == 0 ? (
            <table className="min-w-full divide-y divide-gray-200 drop-shadow">
              <thead className="bg-gray-50 text-cyan-600">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Country
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Task Count
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Completed Tasks
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Total Gain
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Total Profit
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Currency
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {SpecialityFilter.map((freelancer) => (
                  <tr key={freelancer._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                        to={`/freelancer/${freelancer._id}`}
                      >
                        {freelancer.freelancername}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {freelancer.country.countryName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {freelancer.tasksCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {freelancer.completedCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {freelancer.totalGain}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {freelancer.totalProfit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {freelancer.currency && freelancer.currency.currencyname}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="row  p-3 m-0 text-center">
              <h2>There Is No FreeLancers</h2>
            </div>
          ))}
      </div>
    </div>
  );
};

export default FreeLancers;
