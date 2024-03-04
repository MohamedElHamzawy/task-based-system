import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import { RiDeleteBinFill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

//search filter
const getSearchFilter = (searchName, specialities) => {
  if (!searchName) {
    return specialities;
  }
  return specialities.filter(
    (specialities) =>
      specialities.speciality
        .toLowerCase()
        .includes(searchName.toLowerCase()) ||
      specialities.sub_speciality
        .toLowerCase()
        .includes(searchName.toLowerCase())
  );
};

const Specialities = () => {
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URL}:5000/api/speciality/`)
          .then((res) => {
            setSpecialities(res.data.specialities);
          });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  const [searchName, setSearchName] = useState("");
  const searchFilter = getSearchFilter(searchName, specialities);

  const deleteSpecialityHandler = async (id) => {
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/speciality/${id}`
        //  ,
        //  { headers :{
        //     'Authorization':`Bearer ${token}`
        //   }
        // }
      );
      const responseData = await response;

      setError(responseData.data.message);
      setIsLoading(false);
      window.location.href = "/specialities";
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "SomeThing Went Wrong , Please Try Again .");
    }
  };

  const navigate = useNavigate();

  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="justify-center min-h-[calc(100vh-100px)]">
      <div className="flex justify-between items-center my-8">
        <h1 className="text-2xl">System Specialities</h1>
        {/* <div className="">FILTERS</div> */}
      </div>

      <div className="w-full max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <input
            type="text"
            className="rounded border px-3 py-2 shadow-sm w-1/3"
            placeholder="Search By Name Or Type"
            onChange={(e) => {
              setSearchName(e.target.value);
            }}
          />
          <button
            onClick={() => navigate("/addspeciality")}
            className="inline-flex items-center rounded-md border px-3 py-2 text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
          >
            <FaPlus className="mr-2" /> Add New Speciality
          </button>
        </div>

        <div className="overflow-x-auto mt-4 drop-shadow">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-cyan-600">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Sub-Speciality
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Speciality
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {!searchFilter.length == 0 ? (
                searchFilter.map((speciality) => (
                  <tr key={speciality._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                        to={`/speciality/${speciality._id}`}
                      >
                        {speciality.sub_speciality}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {speciality.speciality}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => deleteSpecialityHandler(speciality._id)}
                      >
                        <RiDeleteBinFill />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-6 py-4 text-center" colSpan={3}>
                    <h2 className="text-lg font-medium text-gray-900">
                      There Are No Specialities
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

export default Specialities;
