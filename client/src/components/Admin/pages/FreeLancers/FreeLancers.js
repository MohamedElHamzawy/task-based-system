import './FreeLancers.css'
import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import { SiFreelancer } from 'react-icons/si';
import { FiFilter } from 'react-icons/fi';
import { RiDeleteBinFill } from 'react-icons/ri';

//search filter
const getSearchFilter = (searchName, freeLancers) => {
  if (!searchName) {
    return freeLancers;
  } return freeLancers.filter((freeLancer) => freeLancer.freelancername.toLowerCase().includes(searchName.toLowerCase()));
};

// Speciality filter
const getSpecialityFilter = (speciality, freeLancers) => {
  if (!speciality) {
    return freeLancers;
  } return freeLancers.filter((freeLancer) => freeLancer.speciality._id.includes(speciality));
};

const FreeLancers = () => {
  const [freeLancers, setFreeLancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [specialities, setSpecialities] = useState([]);


  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios.get("http://localhost:5000/api/freelancer/").then((res) => {
          setFreeLancers(res.data.freelancers);
          console.log(res.data)
          setLoading(false);
          setIsLoading(false);
        });
      });
      timerId = setTimeout(async () => {
        await axios.get("http://localhost:5000/api/speciality/").then((res) => {
          setSpecialities(res.data.specialities);
        });

      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  const [speciality, setSpeciality] = useState('');

  const [searchName, setSearchName] = useState('');
  const [searchFilterData, setSearchFilterData] = useState(true);
  const [SpecialityFilterData, setSpecialityFilterData] = useState(false);

  const searchFilter = getSearchFilter(searchName, freeLancers);
  const SpecialityFilter = getSpecialityFilter(speciality, freeLancers);

  const deleteFreelancerHandler = async (id) => {
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
      console.log(responseData)
      setError(responseData.data.message);
      setIsLoading(false);
      window.location.href = '/freelancers';
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "SomeThing Went Wrong , Please Try Again .");
    };
  }

  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="row w-100 p-0 m-0 ">


      <div className="col-12 row text-center system-head p-2">
        <div className="col-6 col-md-3">
          <h1 className='logo text-white bg-danger p-2'>Admin</h1>
        </div>
        <h1 className="col-12 col-md-6 text-center ">System FreeLancers</h1>
      </div>

      <div className="row p-0 m-0 ">

        <div className="col-8 col-md-4 p-2">
          <input type="name" className="search p-2 w-100" placeholder=" Search By Name" value={searchName}
            onChange={(e) => { setSearchName(e.target.value); setSpecialityFilterData(false); setSearchFilterData(true); setSpeciality('') }}
          />
        </div>

        <div className="col-12 col-md-5 text-secondary row p-2">
          <label htmlFor="Speciality" className="m-2 col-5 text-end"> <FiFilter className="" /> Filter:</label>
          <select id="speciality" name="speciality" className="search col-5" value={speciality}
            onChange={(e) => { setSpeciality(e.target.value); setSpecialityFilterData(true); setSearchFilterData(false); setSearchName('') }}>
            <option value="" className='text-secondary'>Specialities</option>
            {specialities.map((speciality) => (
              <option value={speciality._id} key={speciality._id}>{speciality.specialityName}</option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md-3 p-2 text-center">
          <button onClick={() => { window.location.href = '/addfreeLancer' }} className="new-user p-2">
            <SiFreelancer className="fs-3" />  Add New FreeLancer
          </button>
        </div>


      </div>

      <div className="bg-white w-100 users-data row p-0 m-0 mt-2">
        <div className="row fw-bold table-head p-0 m-0 py-2">
          <p className="col-5 text-center">FullName</p>
          <p className="col-4 ">Speciality</p>
          <p className="col-2 ">Delete</p>
        </div>

        {searchFilterData ? !searchFilter.length == 0 ? searchFilter.map((freeLancer) => (
          <div className="table-body row pt-3 p-0 m-0 " key={freeLancer._id}>
            <p className="col-5 name-Speciality text-center name-role"><a className="text-dark text-decoration-none fw-bold" href={`/freeLancer/${freeLancer._id}`}>{freeLancer.freelancername}</a></p>
            <p className="col-4 name-Speciality name-role " > {freeLancer.speciality.specialityName}</p>
            <p className="col-2"> <button className=" delete-btn p-2 px-3" onClick={()=>deleteFreelancerHandler(freeLancer._id)}> <RiDeleteBinFill/> </button></p>     
          </div>
        )) :
          <div className="row  p-3 m-0 text-center" >
            <h2>
              There Is No FreeLancers
            </h2>
          </div> : ''
        }

        {SpecialityFilterData ? !SpecialityFilter.length == 0 ? SpecialityFilter.map((freeLancer) => (
          <div className="table-body row pt-3 p-0 m-0 " key={freeLancer._id}>
           <p className="col-5 name-Speciality text-center name-role"><a className="text-dark text-decoration-none fw-bold" href={`/freeLancer/${freeLancer._id}`}>{freeLancer.freelancername}</a></p>
            <p className="col-4 name-Speciality name-role " > {freeLancer.speciality.specialityName}</p>
            <p className="col-2"> <button className=" delete-btn p-2 px-3" onClick={()=>deleteFreelancerHandler(freeLancer._id)}> <RiDeleteBinFill/> </button></p>     
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
