import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import { FaPercent } from 'react-icons/fa';
import GetCookie from '../../../../hooks/getCookie';
import './Profit.css'

const Profit = () => {
    const [profit, setProfit] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const token = GetCookie("AdminToken")
    useEffect(() => {
        let timerId;
        if (loading) {
          setIsLoading(true);
          timerId = setTimeout(async () => {
            await axios.get("http://localhost:5000/api/profit/").then((res) => {
             setProfit(res.data.profitSystem);
             console.log(res.data)
            });
            setLoading(false);
            setIsLoading(false);
          });
        }
        return () => clearTimeout(timerId);
      }, [loading]);


      const deleteProfitHandler = async (id) => {
        setIsLoading(true);
        try {
          setError(null);
          const response = await axios.delete(
            ` http://localhost:5000/api/profit/${id}`
            //  ,
            //  { headers :{
            //     'Authorization':`Bearer ${token}`
            //   }
            // }
          )
          const responseData = await response;
          console.log(responseData)
          setError(responseData.data.message);
          setIsLoading(false);
          window.location.href = '/statuses';
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
        <h1 className="col-12 col-md-6 text-center ">System Profit</h1>
      </div>

      <div className="bg-white w-100 users-data row p-0 m-0 mt-2 text-center">
        <div className="row fw-bold table-head p-0 m-0 py-3">
          <p className="col-4 "><FaPercent/></p>
          <p className="col-4  ">Maximum</p>
          <p className="col-4 ">Minimum</p>
          {/* <p className="col-2 ">Delete</p> */}
        </div>

        {profit.length != 0 ? profit.map((percentage) => (
          <div className="table-body row pt-3 p-0 m-0 " key={percentage._id}>
            <p className="col-4  "><a className="text-dark text-decoration-none fw-bold" href={`/profit/${percentage._id}`}>Profit</a></p>
            <p className="col-4 "> {percentage.maximum} </p>
            <p className="col-4  "> {percentage.minimum} </p>
          {/*  <p className="col-2">
             <button className="delete-btn p-2 px-3" onClick={() => deleteProfitHandler(percentage._id)}> <RiDeleteBinFill /> </button> 
            </p>*/}
          </div>
        ))
          :
          <div className="row  p-3 m-0 text-center" >
            <h2>
              There Is No Profit Percentage
            </h2>
          </div>
        }

      </div>
    </div>
  )
}

export default Profit
