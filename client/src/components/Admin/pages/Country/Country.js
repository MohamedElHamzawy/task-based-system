import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";

import { RiDeleteBinFill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router";

//search filter
const getSearchFilter = (searchName, countries) => {
  if (!searchName) {
    return countries;
  }
  return countries.filter((country) =>
    country.countryName.toLowerCase().includes(searchName.toLowerCase())
  );
};

const Country = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
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
  const searchFilter = getSearchFilter(searchName, countries);

  const deleteCountryHandler = async (id) => {
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/country/${id}`
        //  ,
        //  { headers :{
        //     'Authorization':`Bearer ${token}`
        //   }
        // }
      );
      const responseData = await response;

      setError(responseData.data.message);
      setIsLoading(false);
      window.location.href = "/country";
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "SomeThing Went Wrong , Please Try Again .");
    }
  };
  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="justify-center min-h-[calc(100vh-100px)]">
      <div className="flex justify-between items-center my-8">
        <h1 className="text-2xl">System Countries</h1>
        {/* <div className="">FILTERS</div> */}
      </div>
      <div className="w-full max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <input
            type="text"
            className="rounded border px-3 py-2 shadow-sm w-1/3"
            placeholder="Search By Country Name"
            onChange={(e) => {
              setSearchName(e.target.value);
            }}
          />

          <button
            onClick={() => navigate("/addcountry")}
            className="inline-flex items-center rounded-md border px-3 py-2 text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
          >
            <FaPlus className="mr-2" /> Add New Country
          </button>
        </div>

        <div className="overflow-x-auto mt-4 shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-cyan-600 uppercase tracking-wider"
                >
                  Country
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-cyan-600 uppercase tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {!searchFilter.length == 0 ? (
                searchFilter.map((country) => (
                  <tr key={country._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {country.countryName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded"
                        onClick={() => deleteCountryHandler(country._id)}
                      >
                        <RiDeleteBinFill />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-6 py-4 text-center" colSpan={2}>
                    <h2 className="text-lg font-medium text-gray-900">
                      There Are No Countries
                    </h2>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Country;
