import './Statuses.css'
import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import { BsFillFolderSymlinkFill } from 'react-icons/bs';
import { TbStatusChange } from 'react-icons/tb';
import { RiDeleteBinFill } from 'react-icons/ri';

//search filter 
const getSearchFilter = (searchName, statuses) => {
  if (!searchName ) {
    return statuses;
  }return statuses.filter((status) => status.statusname.includes(searchName))
};


const Statuses = () => {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error , setError] = useState(false);
  

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios.get("http://localhost:5000/api/status/").then((res) => {
          setStatuses(res.data.statuses);
        });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  const [searchName, setSearchName] = useState('');
  const searchFilter = getSearchFilter(searchName,statuses);

  const deleteSpecialityHandler=async(id)=>{
    setIsLoading(true);
    try {
    setError(null);
    const response = await axios.delete(
     ` http://localhost:5000/api/status/${id}`
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
    window.location.href = '/statuses' ;
  }catch (err) {
    setIsLoading(false);
    setError(err.message || "SomeThing Went Wrong , Please Try Again .");
  };
  }

  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="row w-100 p-0 m-0 ">

        <div className="col-12 text-center edit-form-lable p-2">
          <h1 >System Statuses</h1>
        </div>

      <div className="row p-0 m-0 ">

        <div className="col-8 col-md-4 p-2">
          <button onClick={() => { window.location.href = '/addstatus' }} className="new-user p-2">
          <TbStatusChange className='fs-3' />  Add New Status
          </button>
        </div>

        <div className="col-10 col-md-4 p-2">
          <input type="name" className="search p-2 w-100" placeholder=" Search By Status Name" 
           onChange={(e) => { setSearchName(e.target.value) }}
          />
        </div>

      </div>
 
      <div className="bg-white w-100 users-data row p-0 m-0 mt-2 text-center">
        <div className="row fw-bold table-head p-0 m-0 py-3">
          <p className="col-5 ">Name</p>
          <p className="col-4  ">Edit</p>
          <p className="col-3 ">Delete</p>

        </div>

        { !searchFilter.length==0 ? searchFilter.map((status) => (
          <div className="table-body row pt-3 p-0 m-0 " key={status._id}>
            <p className="col-5  ">{status.statusname}</p>
            <p className="col-4  fs-5 "> <a className="view-details fs-4" href={`/status/${status._id}`}><BsFillFolderSymlinkFill/></a> </p>
            <p className="col-3"> <button className=" delete-btn p-2 px-3" onClick={()=>deleteSpecialityHandler(status._id)}> <RiDeleteBinFill/> </button></p>     
          </div>
        ))  : 
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
