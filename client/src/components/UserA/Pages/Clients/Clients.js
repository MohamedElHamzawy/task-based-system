import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import { FaHospitalUser, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router";
import Filter from "../../../Filter";
import { Link } from "react-router-dom";

//search filter
const getSearchFilter = (searchName, clients) => {
  if (!searchName) {
    return clients;
  }
  return clients.filter((clients) =>
    clients.clientname.toLowerCase().includes(searchName.toLowerCase())
  );
};

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [countries, setCountries] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URL}:5000/api/client/`)
          .then((res) => {
            setClients(res.data.clients);
          });
        setLoading(false);
        setIsLoading(false);
      });
      timerId = setTimeout(async () => {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URL}:5000/api/country/`)
          .then((res) => {
            setCountries(res.data.countries);
          });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  const [searchName, setSearchName] = useState("");
  const [country, setCountry] = useState("");

  const [searchFilterData, setSearchFilterData] = useState(true);
  const [sortFilterData, setSortFilterData] = useState(false);

  const searchFilter = getSearchFilter(searchName, clients);
  const [filterData, setFilterData] = useState([]);

  //sort data
  const sortHandler = async (value) => {
    setSortFilterData(true);
    setSearchFilterData(false);
    setSearchName("");
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/client/sort/filter/`,
        {
          country: value,
        }
      );
      const responseData = await response;
      if (!(response.statusText === "OK")) {
        throw new Error(responseData.data.message);
      }
      setFilterData(response.data.clients);

      setLoading(false);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err.message && "SomeThing Went Wrong , Please Try Again .");
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
          value={country}
          onChange={(e) => {
            sortHandler(e.target.value);
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

      <div className="flex justify-between items-center my-8">
        <h1 className="text-2xl">System Clients</h1>
        {/* <div className="">FILTERS</div> */}
      </div>

      <div className="flex items-center justify-between">
        <input
          type="name"
          className="rounded border px-3 py-2 shadow-sm w-1/3"
          placeholder=" Search By Name"
          onChange={(e) => {
            setSearchName(e.target.value);
            setSearchFilterData(true);
            setSortFilterData(false);
          }}
        />
        <button
          onClick={() => navigate("/addclient")}
          className="inline-flex items-center rounded-md border px-3 py-2 text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
        >
          <FaPlus className="mr-2" /> Add New Client
        </button>
      </div>
      <div className="mt-4 overflow-x-auto drop-shadow rounded-sm">
        {searchFilterData &&
          (!searchFilter.length == 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
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
                    Website
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
                {searchFilter.map((client, index) => (
                  <tr key={client._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                        to={`/client/${client._id}`}
                      >
                        {client.clientname}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {client.country.countryName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {client.website}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {client.tasksCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {client.completedCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {client.totalGain}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {client.totalProfit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {client.currency && client.currency.currencyname}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="row  p-3 m-0 text-center">
              <h2>There Is No Clients</h2>
            </div>
          ))}

        {sortFilterData &&
          (!filterData.length == 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
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
                    Website
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
                {filterData.map((client, index) => (
                  <tr key={client._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                        to={`/client/${client._id}`}
                      >
                        {client.clientname}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {client.country.countryName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {client.website}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {client.tasksCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {client.completedCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {client.totalGain}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {client.totalProfit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {client.currency && client.currency.currencyname}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="row  p-3 m-0 text-center">
              <h2>There Is No Clients</h2>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Clients;
