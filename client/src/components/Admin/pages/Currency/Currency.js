import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import { RiDeleteBinFill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router";

//search filter
const getSearchFilter = (searchName, currencies) => {
  if (!searchName) {
    return currencies;
  }
  return currencies.filter((currencies) =>
    currencies.currencyname.toLowerCase().includes(searchName.toLowerCase())
  );
};

const Currency = () => {
  const [currencies, setCurrencies] = useState([]);
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
          .get(`${process.env.REACT_APP_BACKEND_URL}:5000/api/currency/`)
          .then((res) => {
            setCurrencies(res.data.currencies);
          });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  const [searchName, setSearchName] = useState("");
  const searchFilter = getSearchFilter(searchName, currencies);

  const deleteCurrencyHandler = async (id) => {
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/currency/${id}`
        //  ,
        //  { headers :{
        //     'Authorization':`Bearer ${token}`
        //   }
        // }
      );
      const responseData = await response;

      setError(responseData.data.message);
      setIsLoading(false);
      window.location.href = "/currency";
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
        <h1 className="text-2xl">System Currencies</h1>
        {/* <div className="">FILTERS</div> */}
      </div>

      <div className="w-full max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <input
            type="text"
            className="rounded border px-3 py-2 shadow-sm w-1/3"
            placeholder="Search By Currency Name"
            onChange={(e) => {
              setSearchName(e.target.value);
            }}
          />

          <button
            onClick={() => navigate("/addcurrency")}
            className="inline-flex items-center rounded-md border px-3 py-2 text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
          >
            <FaPlus className="mr-2" /> Add New Currency
          </button>
        </div>

        <div className="overflow-x-auto mt-4 drop-shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-cyan-600 uppercase tracking-wider"
                >
                  CurrencyName
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-cyan-600 uppercase tracking-wider"
                >
                  Price in EGP
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
                searchFilter.map((currency) => (
                  <tr key={currency._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                        href={`/currency/${currency._id}`}
                      >
                        {currency.currencyname}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {currency.priceToEGP}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="transition-all bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded"
                        onClick={() => deleteCurrencyHandler(currency._id)}
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
                      There Are No Currencies
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

export default Currency;
