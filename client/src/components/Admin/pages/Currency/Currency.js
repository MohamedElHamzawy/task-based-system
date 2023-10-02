import './Currency.css'
import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import { BsFillFolderSymlinkFill } from 'react-icons/bs';
import { BsCurrencyExchange } from 'react-icons/bs';
import { RiDeleteBinFill } from 'react-icons/ri';

//search filter
const getSearchFilter = (searchName, currencies) => {
  if (!searchName) {
    return currencies;
  } return currencies.filter(
    (currencies) => currencies.currencyname.toLowerCase().includes(searchName.toLowerCase()))
};


const Currency = () => {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);


  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios.get("https://smarteduservices.com:5000/api/currency/").then((res) => {
          setCurrencies(res.data.currencies);
        });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  const [searchName, setSearchName] = useState('');
  const searchFilter = getSearchFilter(searchName, currencies);

  const deleteCurrencyHandler = async (id) => {
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.delete(
        `https://smarteduservices.com:5000/api/currency/${id}`
        //  ,
        //  { headers :{
        //     'Authorization':`Bearer ${token}`
        //   }
        // }
      )
      const responseData = await response;
    
      setError(responseData.data.message);
      setIsLoading(false);
      window.location.href = '/currency';
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "SomeThing Went Wrong , Please Try Again .");
    };
  }

  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="row w-100 p-0 m-0 justify-content-center">


      <div className="col-12 row text-center system-head p-2">
        <div className="col-6 col-md-3">
          <h1 className='logo text-white bg-danger p-2'>Admin</h1>
        </div>
        <h1 className="col-12 col-md-6 text-center fw-bold">System Currencies</h1>
      </div>

      <div className="row p-0 m-0 col-10 justify-content-center">

        <div className="col-12 col-md-6 p-2 ">
          <input type="name" className="search p-2 w-100" placeholder=" Search By Currency Name"
            onChange={(e) => { setSearchName(e.target.value) }}
          />
        </div>

        <div className="col-12 col-md-6 p-2 text-end">
          <button onClick={() => { window.location.href = '/addcurrency' }} className="new-user p-2">
            <BsCurrencyExchange className='fs-3' />  Add New Currency
          </button>
        </div>
      </div>

      <div className="bg-white w-100 users-data row p-0 m-0 mt-2">
        <div className="row fw-bold table-head p-0 m-0 py-3">
          <p className="col-5 speciality-table-head text-center">CurrencyName</p>
          <p className="col-4 speciality-table-head">Price in EGP</p>
          <p className="col-3 speciality-table-head">Delete</p>

        </div>

        {!searchFilter.length == 0 ? searchFilter.map((currency) => (
          <div className="table-body row pt-3 p-0 m-0 " key={currency._id}>
            <p className="col-5  text-center"> <a className="text-dark text-decoration-none fw-bold" href={`/currency/${currency._id}`}>{currency.currencyname}</a></p>
            <p className="col-4 ">{currency.priceToEGP}</p>
            <p className="col-3"> <button className=" delete-btn p-2 px-3" onClick={() => deleteCurrencyHandler(currency._id)}> <RiDeleteBinFill /> </button></p>
          </div>
        )) :
          <div className="row  p-3 m-0 text-center" >
            <h2>
              There Is No Currencies
            </h2>
          </div>
        }


      </div>
    </div>
  )
}

export default Currency
