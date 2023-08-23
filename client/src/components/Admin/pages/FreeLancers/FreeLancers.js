import './FreeLancers.css'
import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import { BsFillFolderSymlinkFill } from 'react-icons/bs';
import { SiFreelancer } from 'react-icons/si';
import { RiDeleteBinFill } from 'react-icons/ri';
import { FiFilter } from 'react-icons/fi';

//search filter
const getSearchFilter = (searchName, freeLancers) => {
  if (!searchName) {
    return freeLancers;
  } return freeLancers.filter((freeLancer) => freeLancer.freelancername.includes(searchName));
};

// Speciality filter
const getSpecialityFilter = (speciality, freeLancers) => {
  if (!speciality) {
    return freeLancers;
  } return freeLancers.filter((freeLancer) => freeLancer.speciality.includes(speciality));
};

const FreeLancers = () => {
  const [freeLancers, setFreeLancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);


  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios.get("http://localhost:5000/api/freelancer/").then((res) => {
          setFreeLancers(res.data.freelancers);
        });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  const [specialities, setSpecialities] = useState([]);
  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios.get("http://localhost:5000/api/speciality/").then((res) => {
          setSpecialities(res.data.specialities);
        });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);
  const [speciality, setSpeciality] = useState('');

  // const specialityChangeHandler = (newOne) => {
  //   setSpeciality(newOne);
  // };


  const [searchName, setSearchName] = useState('');
  const [searchFilterData, setSearchFilterData] = useState(true);
  const [SpecialityFilterData, setSpecialityFilterData] = useState(false);

  const searchFilter = getSearchFilter(searchName, freeLancers);
  const SpecialityFilter = getSpecialityFilter(speciality, freeLancers);


  const deleteFreeLancerHandler = async (id) => {
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.delete(
        ` http://localhost:5000/api/freelancer/${id}`
        //  ,
        //  { headers :{
        //     'Authorization':`Bearer ${token}`
        //   }
        // }
      )
      const responseData = await response;
      console.log(responseData.data)
      setError(responseData.data.message);
      setIsLoading(false);
      window.location.href = '/freeLancers';
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "SomeThing Went Wrong , Please Try Again .");
    };
  }


  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="row w-100 p-0 m-0 ">

      <div className="col-12 text-center edit-form-lable p-2">
        <h1 >System FreeLancers</h1>
      </div>

      <div className="row p-0 m-0 ">

        <div className="col-8 col-md-4 p-2">
          <button onClick={() => { window.location.href = '/addfreeLancer' }} className="new-user p-2">
            <SiFreelancer className="fs-3" />  Add New FreeLancer
          </button>
        </div>

        <div className="col-8 col-md-3 p-2">
          <input type="name" className="search p-2 w-100" placeholder=" Search By Name" value={searchName}
            onChange={(e) => { setSearchName(e.target.value); setSpecialityFilterData(false); setSearchFilterData(true); setSpeciality('') }}
          />
        </div>

        <div className="col-12 col-md-5 text-secondary row p-2">
          <label htmlFor="Speciality" className="m-2 col-5 text-end"> <FiFilter className="" /> Filter:</label>
          <select id="speciality" name="speciality" className="search col-5" value={speciality}
            onChange={(e) =>{ setSpeciality(e.target.value); setSpecialityFilterData(true); setSearchFilterData(false); setSearchName('') }}>
            <option value="" className='text-secondary'>Specialities</option>
            {specialities.map((speciality) => (
              <option value={speciality._id} key={speciality._id}>{speciality.specialityName}</option>
            ))}
          </select>
        </div>

      </div>

      <div className="bg-white w-100 users-data row p-0 m-0 mt-2">
        <div className="row fw-bold table-head p-0 m-0 py-2">
          <p className="col-4 col-md-5">FullName</p>
          <p className="col-2 col-md-3">Speciality</p>
          <p className="col-3 col-md-2">Details</p>
          <p className="col-2 ">Delete</p>

        </div>

        {searchFilterData ? !searchFilter.length == 0 ? searchFilter.map((freeLancer) => (
          <div className="table-body row pt-3 p-0 m-0 " key={freeLancer._id}>
            <p className="col-4 col-md-5 name-Speciality">{freeLancer.freelancername}</p>
            
          {specialities.map((specialitie) => (
             freeLancer.speciality == specialitie._id ? 
              <p className = "col-3 name-Speciality" key={ specialitie._id } > { specialitie.specialityName }</p>
            : ''        
          ))}

        <p className="col-2 fs-5 "> <a className="view-details fs-4" href={`/freeLancer/${freeLancer._id}`}><BsFillFolderSymlinkFill /></a> </p>
        <p className="col-2">
          {freeLancer.speciality == 'admin' ?
            <button className=" disabled-btn p-2 px-3" disabled> <RiDeleteBinFill /> </button>
            :
            <button className=" delete-btn p-2 px-3" onClick={() => deleteFreeLancerHandler(freeLancer._id)}> <RiDeleteBinFill /> </button>
          }
        </p>
      </div>
      ))  :
      <div className="row  p-3 m-0 text-center" >
        <h2>
          There Is No FreeLancers
        </h2>
      </div>  :'' 
        }

      {SpecialityFilterData ? !SpecialityFilter.length == 0 ? SpecialityFilter.map((freeLancer) => (
        <div className="table-body row pt-3 p-0 m-0 " key={freeLancer._id}>
          <p className="col-4 col-md-5 name-Speciality">{freeLancer.freelancername}</p>

          {specialities.map((specialitie) => (
             freeLancer.speciality == specialitie._id ? 
              <p className = "col-3 name-Speciality" key={ specialitie._id } > { specialitie.specialityName }</p>
            : ''        
          ))}

          <p className="col-2 fs-5 "> <a className="view-details fs-4" href={`/freelancer/${freeLancer._id}`}><BsFillFolderSymlinkFill /></a> </p>
          <p className="col-2">
            {freeLancer.speciality == 'admin' ?
              <button className=" disabled-btn p-2 px-3" disabled> <RiDeleteBinFill /> </button>
              :
              <button className=" delete-btn p-2 px-3" onClick={() => deleteFreeLancerHandler(freeLancer._id)}> <RiDeleteBinFill /> </button>
            }
          </p>
        </div>
      )) :
        <div className="row  p-3 m-0 text-center" >
          <h2>
            There Is No FreeLancers
          </h2>
        </div> : ''
      }

    </div>
    </div >
  )
}

export default FreeLancers
