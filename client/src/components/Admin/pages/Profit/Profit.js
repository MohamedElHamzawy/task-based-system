import React, { useEffect, useState } from 'react'
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import { FaPercent } from 'react-icons/fa';
import './Profit.css'
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";



const Profit = () => {
  const [profit, setProfit] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios.get(" https://smarteduservices.com:5000/api/profit/").then((res) => {
          setProfit(res.data.profitSystem);
           
        });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  const [minimum, setMinimum] = useState('');
  const [maximum, setMaximum] = useState('');



  //////////////////////////////////////
  const editProfitHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        ` https://smarteduservices.com:5000/api/profit/${profit._id}`,
        {
          minimum:minimum,
          maximum: maximum
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
          <p className="col-4 "><FaPercent /></p>
          <p className="col-4  ">Maximum</p>
          <p className="col-4 ">Minimum</p>
          {/* <p className="col-2 ">Delete</p> */}
        </div>

        {profit.length != 0 ? 
          <div className="table-body row pt-3 p-0 m-0 " key={profit._id}>
            <p className="col-4  "><a className="text-dark text-decoration-none fw-bold" href={`/profit/${profit._id}`}>Profit</a></p>
            <p className="col-4 "> {profit.maximum} </p>
            <p className="col-4  "> {profit.minimum} </p>
            {/*  <p className="col-2">
             <button className="delete-btn p-2 px-3" onClick={() => deleteProfitHandler(percentage._id)}> <RiDeleteBinFill /> </button> 
            </p>*/}
          </div>
          :
          <div className="row  p-3 m-0 text-center" >
            <h2>
              There Is No Profit Percentage
            </h2>
          </div>
        }

      </div>

      <div className='row justify-content-center w-100'>
        <div className='text-end p-3'>
          <button className='edit-profit p-3 px-5 fw-bold' onClick={()=>(setEdit(!edit))}> 
            Edit 
          </button>
        </div>

        {edit ? 
        <div className="row bg-white adduser-form p-3 py-5 m-1 justify-content-center col-12 col-lg-10">

          {/* /////////////////////// */}
          <div className="col-12 col-md-6 row p-3 ">
            <h3 className="col-12 col-sm-6  edit-form-lable text-center py-1">Maximum:</h3>
            <div className="d-inline col-12 col-sm-6 pt-1">
              <input type='number' placeholder='Maximum'
                value={maximum}
                onChange={(e)=>setMaximum(e.target.value)}
                className='search w-100 p-2 '
              />
            </div>
          </div>
          {/* /////////////////////// */}
          <div className="col-12 col-md-6 row p-3">
            <h3 className="col-12 col-sm-6  edit-form-lable text-center py-1">Minimum:</h3>
            <div className="d-inline col-12 col-sm-6 pt-1 " >
              <input type='number' placeholder='Minimum'
                value={minimum}
                onChange={(e)=>setMinimum(e.target.value)}
                className='search w-100 p-2'
              />
            </div>
          </div>

          {/* /////////////////////// */}

          <button
            disabled={
              !minimum &&
              !maximum
            }
            className="edit-user-btn p-3 col-8 col-lg-4 fw-bold"
            onClick={editProfitHandler}
          >
            Submit
          </button>

        </div> : ''}

      </div>

    </div>
  )
}

export default Profit
