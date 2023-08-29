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
  } return freeLancers.filter((freeLancer) => freeLancer.freelancername.toLowerCase().includes(searchName.toLowerCase()));
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

  const [searchName, setSearchName] = useState('');
  const [searchFilterData, setSearchFilterData] = useState(true);
  const [SpecialityFilterData, setSpecialityFilterData] = useState(false);

  const searchFilter = getSearchFilter(searchName, freeLancers);
  const SpecialityFilter = getSpecialityFilter(speciality, freeLancers);

  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="row w-100 p-0 m-0 ">


      <div className="col-12 row text-center edit-form-lable p-2">
        <div className="col-6 col-md-3">
          <h1 className='logo text-white bg-danger p-2'>User B</h1>
        </div>
        <h1 className="col-12 col-md-6 text-center ">System FreeLancers</h1>
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
            onChange={(e) => { setSpeciality(e.target.value); setSpecialityFilterData(true); setSearchFilterData(false); setSearchName('') }}>
            <option value="" className='text-secondary'>Specialities</option>
            {specialities.map((speciality) => (
              <option value={speciality._id} key={speciality._id}>{speciality.specialityName}</option>
            ))}
          </select>
        </div>

      </div>

      <div className="bg-white w-100 users-data row p-0 m-0 mt-2">
        <div className="row fw-bold table-head p-0 m-0 py-2">
          <p className="col-5 text-center">FullName</p>
          <p className="col-4 ">Speciality</p>
          <p className="col-2 text-center">Details</p>

        </div>

        {searchFilterData ? !searchFilter.length == 0 ? searchFilter.map((freeLancer) => (
          <div className="table-body row pt-3 p-0 m-0 " key={freeLancer._id}>
            <p className="col-5 name-Speciality text-center name-role">{freeLancer.freelancername}</p>

            {specialities.map((specialitie) => (
              freeLancer.speciality == specialitie._id ?
                <p className="col-5 name-Speciality name-role " key={specialitie._id} > {specialitie.specialityName}</p>
                : ''
            ))}

            <p className="col-2 fs-5 "> <a className="view-details fs-4" href={`/freeLancer/${freeLancer._id}`}><BsFillFolderSymlinkFill /></a> </p>
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
            <p className="col-5 name-Speciality name-role text-center">{freeLancer.freelancername}</p>

            {specialities.map((specialitie) => (
              freeLancer.speciality == specialitie._id ?
                <p className="col-5 name-Speciality name-role" key={specialitie._id} > {specialitie.specialityName}</p>
                : ''
            ))}

            <p className="col-2 fs-5 "> <a className="view-details fs-4" href={`/freelancer/${freeLancer._id}`}><BsFillFolderSymlinkFill /></a> </p>
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