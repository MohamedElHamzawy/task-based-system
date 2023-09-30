import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import './Specialities.css'
import { BsFillFolderSymlinkFill } from 'react-icons/bs';
import { BiSolidCategoryAlt } from 'react-icons/bi';
import { RiDeleteBinFill } from 'react-icons/ri';
import { FiFilter } from 'react-icons/fi';

//search filter 
const getSearchFilter = (searchName, specialities) => {
  if (!searchName) {
    return specialities;
  } return specialities.filter(
    (specialities) => specialities.speciality.toLowerCase().includes(searchName.toLowerCase()) || specialities.sub_speciality.toLowerCase().includes(searchName.toLowerCase())
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
        await axios.get(" http://localhost:5000/api/speciality/").then((res) => {
          setSpecialities(res.data.specialities);
          console.log(res.data)
        });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  const [searchName, setSearchName] = useState('');
  const searchFilter = getSearchFilter(searchName, specialities);

  const deleteSpecialityHandler=async(id)=>{
    setIsLoading(true);
    try {
    setError(null);
    const response = await axios.delete(
     `  http://localhost:5000/api/speciality/${id}`
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
    window.location.href = '/specialities' ;
  }catch (err) {
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
        <h1 className="col-12 col-md-6 text-center fw-bold">System Specialities</h1>
      </div>

      <div className="row p-0 m-0 col-10 justify-content-center">

        <div className="col-12 col-md-6 p-2">
          <input type="name" className="search p-2 w-100" placeholder=" Search By Name Or Type"
            onChange={(e) => { setSearchName(e.target.value) }}
          />
        </div>

        <div className="col-12 col-md-5 p-2 text-end">
          <button onClick={() => { window.location.href = '/addspeciality' }} className="new-user p-2">
            <BiSolidCategoryAlt className='fs-3' />  Add New Speciality
          </button>
        </div>

      </div>

      <div className="bg-white w-100 users-data row p-0 m-0 mt-2">
        <div className="row fw-bold table-head p-0 m-0 py-3">
          <p className="col-5 speciality-table-head text-center">Sub-Speciality</p>
          <p className="col-4 speciality-table-head">Speciality</p>
          <p className="col-3 ">Delete</p>

        </div>

        {!searchFilter.length == 0 ? searchFilter.map((speciality) => (
          <div className="table-body row pt-3 p-0 m-0 " key={speciality._id}>
            <p className="col-5  name-role text-center">
              <a className="text-dark text-decoration-none fw-bold" href={`/speciality/${speciality._id}`}>
                {speciality.sub_speciality}
              </a>
            </p>
            <p className="col-4  name-role">{speciality.speciality}</p>
            <p className="col-3"> <button className=" delete-btn p-2 px-3" onClick={()=>deleteSpecialityHandler(speciality._id)}> <RiDeleteBinFill/> </button></p>     
          </div>
        )) :
          <div className="row  p-3 m-0 text-center" >
            <h2>
              There Is No Specialities
            </h2>
          </div>
        }


      </div>
    </div>
  )
}

export default Specialities
