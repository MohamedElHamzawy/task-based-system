import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import { AiFillEdit } from "react-icons/ai";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";
import { useNavigate } from "react-router";

const Profit = () => {
  const [customerProfit, setCustomerProfit] = useState([]);
  const [specialistProfit, setSpecialistProfit] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(false);

  const [editCustomer, setEditCustomer] = useState(false);
  const [editSpecialist, setEditSpecialist] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URL}:5000/api/profit/customer/`)
          .then((res) => {
            setCustomerProfit(res.data.profitSystem);
          });
        setLoading(false);
        setIsLoading(false);
      });
      timerId = setTimeout(async () => {
        await axios
          .get(
            `${process.env.REACT_APP_BACKEND_URL}:5000/api/profit/specialist/`
          )
          .then((res) => {
            setSpecialistProfit(res.data.profitSystem);
          });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  const [customerMinimum, setCustomerMinimum] = useState(
    customerProfit.minimum
  );
  const [customerMaximum, setCustomerMaximum] = useState(
    customerProfit.maximum
  );

  const [specialistMinimum, setSpecialistMinimum] = useState(
    specialistProfit.minimum
  );
  const [specialistMaximum, setSpecialistMaximum] = useState(
    specialistProfit.maximum
  );

  //////////////////////////////////////
  const editCustomerProfitHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/profit/customer/${customerProfit._id}`,
        {
          minimum: customerMinimum,
          maximum: customerMaximum,
        }
      );
      const responseData = await response;

      if (!(response.statusText === "OK")) {
        throw new Error(responseData.data.message);
      }
      setMessage({ type: "success", message: responseData.data.message });
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError({
        type: "error",
        message: err.message || "SomeThing Went Wrong , Please Try Again .",
      });
    }
  };

  //////////////////////////////////////
  const editSpecialistProfitHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/profit/specialist/${specialistProfit._id}`,
        {
          minimum: specialistMinimum,
          maximum: specialistMaximum,
        }
      );
      const responseData = await response;

      if (!(response.statusText === "OK")) {
        throw new Error(responseData.data.message);
      }
      setMessage({ type: "success", message: responseData.data.message });
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError({
        type: "error",
        message: err.message || "SomeThing Went Wrong , Please Try Again .",
      });
    }
  };
  //error message
  const errorHandler = () => {
    setError(null);
    window.location.reload(true);
  };

  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="justify-center min-h-[calc(100vh-100px)]">
      <ErrorModal error={error} message={message} onClear={errorHandler} />
      <div className="flex justify-between items-center my-8">
        <h1 className="text-2xl">System Profit</h1>
        {/* <div className="">FILTERS</div> */}
      </div>

      <div className="overflow-x-auto mt-4 shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-cyan-600 uppercase tracking-wider"
              >
                Profit Type
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-cyan-600 uppercase tracking-wider"
              >
                Max
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-cyan-600 uppercase tracking-wider"
              >
                Min
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-cyan-600 uppercase tracking-wider"
              >
                Edit
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customerProfit.length != 0 ? (
              <tr key={customerProfit._id}>
                <td className="px-6 py-4 whitespace-nowrap">Customer Profit</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {customerProfit.maximum}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {customerProfit.minimum}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <AiFillEdit
                    className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                    onClick={() => {
                      setEditCustomer(true);
                      setEditSpecialist(false);
                    }}
                  />
                </td>
              </tr>
            ) : (
              <tr>
                <td className="px-6 py-4 text-center" colSpan={4}>
                  <h2 className="text-lg font-medium text-gray-900">
                    There Is No Customer Profit Percentage
                  </h2>
                </td>
              </tr>
            )}
            {specialistProfit.length != 0 ? (
              <tr key={specialistProfit._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  Specialist Profit
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {specialistProfit.maximum}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {specialistProfit.minimum}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <AiFillEdit
                    className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                    onClick={() => {
                      setEditCustomer(false);
                      setEditSpecialist(true);
                    }}
                  />
                </td>
              </tr>
            ) : (
              <tr>
                <td className="px-6 py-4 text-center" colSpan={4}>
                  <h2 className="text-lg font-medium text-gray-900">
                    There Is No Specialist Profit Percentage
                  </h2>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit form for customer profit */}
      {editCustomer && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mt-4 shadow-md">
          <h3 className="text-lg font-medium text-gray-900">
            Edit Customer Profit
          </h3>
          <form>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <label
                  htmlFor="customerMaximum"
                  className="block text-sm font-medium text-gray-700"
                >
                  Customer Maximum:
                </label>
                <input
                  type="number"
                  id="customerMaximum"
                  name="customerMaximum"
                  value={customerMaximum}
                  onChange={(e) => setCustomerMaximum(e.target.value)}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div className="col-span-1">
                <label
                  htmlFor="customerMinimum"
                  className="block text-sm font-medium text-gray-700"
                >
                  Customer Minimum:
                </label>
                <input
                  type="number"
                  id="customerMinimum"
                  name="customerMinimum"
                  value={customerMinimum}
                  onChange={(e) => setCustomerMinimum(e.target.value)}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
            <button
              disabled={!customerMaximum && !customerMinimum}
              type="button"
              onClick={editCustomerProfitHandler}
              className="border-2 mt-4 inline-flex items-center px-4 py-2 bg-primary text-base font-medium text-white rounded-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Edit
            </button>
          </form>
        </div>
      )}

      {editSpecialist && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mt-4 shadow-md">
          <h3 className="text-lg font-medium text-gray-900">
            Edit Specialist Profit
          </h3>
          <form>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <label
                  htmlFor="specialistMaximum"
                  className="block text-sm font-medium text-gray-700"
                >
                  Specialist Maximum:
                </label>
                <input
                  type="number"
                  id="specialistMaximum"
                  name="specialistMaximum"
                  value={specialistMaximum}
                  onChange={(e) => setSpecialistMaximum(e.target.value)}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div className="col-span-1">
                <label
                  htmlFor="specialistMinimum"
                  className="block text-sm font-medium text-gray-700"
                >
                  Specialist Minimum:
                </label>
                <input
                  type="number"
                  id="specialistMinimum"
                  name="specialistMinimum"
                  value={specialistMinimum}
                  onChange={(e) => setSpecialistMinimum(e.target.value)}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
            <button
              disabled={!specialistMaximum && !specialistMinimum}
              type="button"
              onClick={editSpecialistProfitHandler}
              className="border-2 mt-4 inline-flex items-center px-4 py-2 bg-primary text-base font-medium text-white rounded-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Edit
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profit;
