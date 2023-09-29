import './Country.css'
import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";

import { FaFlagUsa } from 'react-icons/fa';

//search filter 
const getSearchFilter = (searchName, countries) => {
  if (!searchName) {
    return countries;
  } return countries.filter(
    (country) => country.countryName.toLowerCase().includes(searchName.toLowerCase()));
};


const Country = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios.get("https://smarteduservices.com:5000/api/country/").then((res) => {
            setCountries(res.data.countries);
          console.log(res.data)
        });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  const [searchName, setSearchName] = useState('');
  const searchFilter = getSearchFilter(searchName, countries);


  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="row w-100 p-0 m-0 justify-content-center">


      <div className="col-12 row text-center system-head p-2">
        <div className="col-6 col-md-3">
          <h1 className='logo text-white bg-danger p-2'>Admin</h1>
        </div>
        <h1 className="col-12 col-md-6 text-center fw-bold">System Countries</h1>
      </div>

      <div className="row p-0 m-0 col-10 justify-content-center">

        <div className="col-12 col-md-6 p-2">
          <input type="name" className="search p-2 w-100" placeholder=" Search By Country Name"
            onChange={(e) => { setSearchName(e.target.value) }}
          />
        </div>

        <div className="col-12 col-md-5 p-2 text-end">
          <button onClick={() => { window.location.href = '/addcountry' }} className="new-user p-2">
            <FaFlagUsa className='fs-3' />  Add New Country
          </button>
        </div>

      </div>

      <div className="bg-white col-12 users-data row p-0 m-0 mt-2">
        <div className="row fw-bold table-head p-0 m-0 py-3">
          <p className="text-center">Countries </p>
        </div>

        {!searchFilter.length == 0 ? searchFilter.map((country) => (
          <div className="table-body row pt-3 p-0 m-0 " key={country._id}>
            <p className=" text-center">{country.countryName}</p> 
          </div>
        )) :
          <div className="row  p-3 m-0 text-center" >
            <h2>
              There Is No Countries
            </h2>
          </div>
        }


      </div>
    </div>
  )
}

export default Country
