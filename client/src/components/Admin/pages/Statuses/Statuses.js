import './Statuses.css'
import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import { BsFillFolderSymlinkFill } from 'react-icons/bs';
import { TbStatusChange } from 'react-icons/tb';
import { RiDeleteBinFill } from 'react-icons/ri';
import GetCookie from '../../../../hooks/getCookie';

//search filter 
const getSearchFilter = (searchName, statuses) => {
  if (!searchName) {
    return statuses;
  } return statuses.filter((status) => status.statusname.toLowerCase().includes(searchName.toLowerCase()))
};


const Statuses = () => {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const token = GetCookie("AdminToken")


  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios.get(" http://localhost:5000/api/status/" ,  { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
          setStatuses(res.data.statuses);
           
        });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  const [searchName, setSearchName] = useState('');
  const searchFilter = getSearchFilter(searchName, statuses);

  const deleteSpecialityHandler = async (id) => {
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.delete(
        `  http://localhost:5000/api/status/${id}`
        //  ,
        //  { headers :{
        //     'Authorization':`Bearer ${token}`
        //   }
        // }
      )
      const responseData = await response;
       
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
        <h1 className="col-12 col-md-6 text-center fw-bold">System Statuses</h1>
      </div>

      <div className="row p-0 m-0 col-10 justify-content-center">

        <div className="col-12 col-md-6 p-2 ">
          <input type="name" className="search p-2 w-100" placeholder=" Search By Status Name"
            onChange={(e) => { setSearchName(e.target.value) }}
          />
        </div>

        <div className="col-12 col-md-6 p-2 text-end">
          <button onClick={() => { window.location.href = '/addstatus' }} className="new-user p-2">
            <TbStatusChange className='fs-3' />  Add New Status
          </button>
        </div>

      </div>

      <div className="bg-white w-100 users-data row p-0 m-0 mt-2 text-center">
        <div className="row fw-bold table-head p-0 m-0 py-3">
          <p className="col-5 ">Name</p>
          <p className="col-4  ">Role</p>
          <p className="col-3 ">Delete</p>

        </div>

        {!searchFilter.length == 0 ? searchFilter.map((status) => (
          <div className="table-body row pt-3 p-0 m-0 " key={status._id}>
            <p className="col-5  "><a className="text-dark text-decoration-none fw-bold" href={`/status/${status._id}`}>{status.statusname}</a></p>
            {/* {!status.changable ?
              <p className="col-4  fs-5 "> <BsFillFolderSymlinkFill className='fs-4 disabled-view-details' /> </p>
              :
              <p className="col-4  fs-5 "> <a className="view-details fs-4" href={`/status/${status._id}`}><BsFillFolderSymlinkFill /></a> </p>
            } */}
            <p className="col-4  fs-5 "> {status.role} </p>
            <p className="col-3">
              {!status.changable ?
                <button className=" disabled-btn p-2 px-3" disabled> <RiDeleteBinFill /> </button>
                :
                <button className="delete-btn p-2 px-3" onClick={() => deleteSpecialityHandler(status._id)}> <RiDeleteBinFill /> </button>
              }
            </p>
          </div>
        ))
          :
          <div className="row  p-3 m-0 text-center" >
            <h2>
              There Is No Statuses
            </h2>
          </div>
        }


      </div>
    </div>
  )
}

export default Statuses
