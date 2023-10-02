import React, { useEffect, useState } from 'react'
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import { FaPercent } from 'react-icons/fa';
import { AiFillEdit } from 'react-icons/ai';

import './Profit.css'
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";



const Profit = () => {
  const [customerProfit, setCustomerProfit] = useState([]);
  const [specialistProfit, setSpecialistProfit] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const [editCustomer, setEditCustomer] = useState(false);
  const [editSpecialist, setEditSpecialist] = useState(false);


  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios.get(" http://localhost:5000/api/profit/customer/").then((res) => {
          setCustomerProfit(res.data.profitSystem);
          console.log(res.data)
        });
        setLoading(false);
        setIsLoading(false);
      });
      timerId = setTimeout(async () => {
        await axios.get(" http://localhost:5000/api/profit/specialist/").then((res) => {
          setSpecialistProfit(res.data.profitSystem);
          console.log(res.data)
        });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  const [customerminimum, setCustomerMinimum] = useState(customerProfit.minimum);
  const [customermaximum, setCustomerMaximum] = useState(customerProfit.maximum);

  const [specialistMinimum, setSpecialistMinimum] = useState(specialistProfit.minimum);
  const [specialistMaximum, setSpecialistMaximum] = useState(specialistProfit.maximum);


  //////////////////////////////////////
  const editCustomerProfitHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        ` http://localhost:5000/api/profit/customer/${customerProfit._id}`,
        {
          minimum: customerminimum,
          maximum: customermaximum
        }
      );
      const responseData = await response;

      if (!(response.statusText === "OK")) {
        throw new Error(responseData.data.message);
      }
      setError(responseData.data.message);
      setIsLoading(false);

    } catch (err) {
      setIsLoading(false);
      setError(err.message && "SomeThing Went Wrong , Please Try Again .");
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
        ` http://localhost:5000/api/profit/specialist/${specialistProfit._id}`,
        {
          minimum: specialistMinimum,
          maximum: specialistMaximum
        }
      );
      const responseData = await response;

      if (!(response.statusText === "OK")) {
        throw new Error(responseData.data.message);
      }
      setError(responseData.data.message);
      setIsLoading(false);

    } catch (err) {
      setIsLoading(false);
      setError(err.message && "SomeThing Went Wrong , Please Try Again .");
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
    <div className="row w-100 p-0 m-0 justify-content-center">
      <ErrorModal error={error} onClear={errorHandler} />
      <div className="col-12 row text-center system-head p-2">
        <div className="col-6 col-md-3">
          <h1 className='logo text-white bg-danger p-2'>Admin</h1>
        </div>
        <h1 className="col-12 col-md-6 text-center fw-bold">System Profit</h1>
      </div>

      <div className="bg-white w-100 users-data row p-0 m-0 mt-2 text-center">
        <div className="row fw-bold table-head p-0 m-0 py-3">
          <p className="col-3 "><FaPercent /></p>
          <p className="col-3 ">Max</p>
          <p className="col-3 ">Min</p>
          <p className="col-3 ">Edit</p>
        </div>

        {customerProfit.length != 0 ?
          <div className="table-body row pt-3 p-0 m-0 " key={customerProfit._id}>
            <p className="col-3 text-primary fw-bold ">Customer Profit</p>
            <p className="col-3 "> {customerProfit.maximum} </p>
            <p className="col-3  "> {customerProfit.minimum} </p>
            <p className="col-3  edit-profit" > <AiFillEdit className='fs-3 edit-icon' onClick={() => {setEditCustomer(!editCustomer); setEditSpecialist(false)}}/> </p>
          </div>
          :
          <div className="row  p-3 m-0 text-center" >
            <h2>
              There Is No Customer Profit Percentage
            </h2>
          </div>
        }
        {specialistProfit.length != 0 ?
          <div className="table-body row pt-3 p-0 m-0 " key={specialistProfit._id}>
            <p className="col-3 text-primary fw-bold ">Specialist Profit</p>
            <p className="col-3 "> {specialistProfit.maximum} </p>
            <p className="col-3 "> {specialistProfit.minimum} </p>
            <p className="col-3  edit-profit" > <AiFillEdit className='fs-3 edit-icon' onClick={() => {setEditSpecialist(!editSpecialist) ; setEditCustomer(false)}}/> </p>
          </div>
          :
          <div className="row  p-3 m-0 text-center" >
            <h2>
              There Is No Specialist Profit Percentage
            </h2>
          </div>
        }

      </div>

      <div className='row justify-content-center w-100'>
        {editCustomer ?
          <div className="row bg-white adduser-form p-1 py-5 m-1 justify-content-center col-12 col-lg-10">
            <div className='text-center w-100'>
              <h3 className='fw-bold' style={{color:'#FF6F61'}}>
                Edit Customer Profit
              </h3>
            </div>
            {/* /////////////////////// */}
            <div className="col-12 col-md-6 row p-3 ">
              <p className="col-12 col-sm-6  edit-form-lable text-center py-1 pt-2">Customer Maximum:</p>
              <div className="d-inline col-12 col-sm-6 pt-1">
                <input type='number' placeholder='Customer Maximum'
                  value={customermaximum}
                  onChange={(e) => setCustomerMaximum(e.target.value)}
                  className='search w-100 p-2 '
                />
              </div>
            </div>
            {/* /////////////////////// */}
            <div className="col-12 col-md-6 row p-3">
              <p className="col-12 col-sm-6  edit-form-lable text-center py-1 pt-2">Customer Minimum:</p>
              <div className="d-inline col-12 col-sm-6 pt-1 " >
                <input type='number' placeholder='Customer Minimum'
                  value={customerminimum}
                  onChange={(e) => setCustomerMinimum(e.target.value)}
                  className='search w-100 p-2'
                />
              </div>
            </div>

            {/* /////////////////////// */}

            <button
              disabled={
                !customerminimum &&
                !customermaximum
              }
              className="edit-user-btn p-3 col-8 col-lg-4 fw-bold"
              onClick={editCustomerProfitHandler}
            >
              Edit
            </button>

          </div> : ''}

 {/* /////////////////////////////////////////////////////////////////////////////////////// */}

          {editSpecialist ?
          <div className="row bg-white adduser-form p-1 py-5 m-1 justify-content-center col-12 col-lg-10">
            <div className='text-center w-100'>
              <h3 className='fw-bold' style={{color:'#FF6F61'}}>
                Edit Specialist Profit
              </h3>
            </div>
            {/* /////////////////////// */}
            <div className="col-12 col-md-6 row p-3 ">
              <p className="col-12 col-sm-6  edit-form-lable text-center py-1 pt-2">Specialist Maximum:</p>
              <div className="d-inline col-12 col-sm-6 pt-1">
                <input type='number' placeholder='Specialist Maximum'
                  value={specialistMaximum}
                  onChange={(e) => setSpecialistMaximum(e.target.value)}
                  className='search w-100 p-2 '
                />
              </div>
            </div>
            {/* /////////////////////// */}
            <div className="col-12 col-md-6 row p-3">
              <p className="col-12 col-sm-6  edit-form-lable text-center py-1 pt-2">Specialist Minimum:</p>
              <div className="d-inline col-12 col-sm-6 pt-1 " >
                <input type='number' placeholder='Specialist Minimum'
                  value={specialistMinimum}
                  onChange={(e) => setSpecialistMinimum(e.target.value)}
                  className='search w-100 p-2'
                />
              </div>
            </div>

            {/* /////////////////////// */}

            <button
              disabled={
                !specialistMinimum &&
                !specialistMaximum
              }
              className="edit-user-btn p-3 col-8 col-lg-4 fw-bold"
              onClick={editSpecialistProfitHandler}
            >
              Edit
            </button>

          </div> : ''}

      </div>

    </div>
  )
}

export default Profit
