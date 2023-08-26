import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";

import { useParams } from "react-router-dom";
import { BiSolidEditAlt } from 'react-icons/bi';
import { RiDeleteBinFill } from 'react-icons/ri';
import { TiArrowBack } from 'react-icons/ti';


const FreeLancerDetails = () => {

  const [editFull, setEditFull] = useState(false);
  const [editNumber, setEditNumber] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editCountry, setEditCountry] = useState(false);
  const [editCity, setEditCity] = useState(false);
  const [editSpeciality, setEditSpeciality] = useState(false);

  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  let { id } = useParams();

  const [freeLancer, setFreeLancer] = useState([]);
  const [fullName, setFullName] = useState();
  const [phone, setPhone] = useState();
  const [userSpeciality, setUserSpeciality] = useState();
  const [email, setEmail] = useState();
  const [country, setCountry] = useState();
  const [city, setCity] = useState();

  const [specialityId, setspecialityId] = useState();
  const [specialities, setSpecialities] = useState([]);

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios.get(`http://localhost:5000/api/freeLancer/${id}`).then((res) => {
          setFreeLancer(res.data.freelancer);
          setFullName(res.data.freelancer.freelancername);
          setEmail(res.data.freelancer.email);
          setCountry(res.data.freelancer.country);
          setCity(res.data.freelancer.city)
          setPhone(res.data.freelancer.phone);
          setspecialityId(res.data.freelancer.speciality);
        });
        setLoading(false);
        setIsLoading(false);
      });
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

  //speciality value
  const specialityChangeHandler = (newOne) => {
    setUserSpeciality(newOne);
  };


  //////////////////////////////////////
  const editFreeLancerHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        `http://localhost:5000/api/freelancer/${freeLancer._id}`,
        {
          name: fullName,
          speciality: userSpeciality,
          email: email,
          country: country,
          phone: phone,
          city: city
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

  //delete user 
  const deleteFreeLancerHandler = async () => {
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
      window.location.href = '/freelancers';
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "SomeThing Went Wrong , Please Try Again .");
    };
  }
  //error message
  const errorHandler = () => {
    setError(null);
    window.location.reload(true);
  };

  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="text-center row w-100 p-2 m-0">
      <ErrorModal error={error} onClear={errorHandler} />

      <div className="row mb-4">
        <div className="col-3 text-center">
          <button className="back-btn p-2 px-3 fs-3 " onClick={() => { window.location.href = '/freelancers' }}><TiArrowBack /> </button>
        </div>
        <h2 className="col-12 col-lg-7 text-center edit-form-lable p-2 pt-4">  Freelancer Details</h2>
      </div>

      <div className="row bg-white adduser-form p-1 m-1 justify-content-center">

        <div className="col-12 row p-3 justify-content-end ">
          <div className="col-4">
            <button className="delete-btn px-4 p-1 fs-3" onClick={deleteFreeLancerHandler}>
              <RiDeleteBinFill />
            </button>
          </div>
        </div>

        {/* /////////////////////// */}
        <div className="col-12 col-xl-6 row ">
          <h3 className="col-9 col-md-5  edit-form-lable text-start">Full Name :</h3>
          <p className={!editFull ? "d-inline col-10 col-md-4 py-3 edit-form-p fw-bold " : 'd-none'}> {freeLancer.freelancername} </p>
          <div className={editFull ? "d-inline col-10 col-md-4 py-3 " : 'd-none'} >
            <input type="text" onChange={(e) => { setFullName(e.target.value) }} className="search w-100 p-2" />
          </div>

          <div className="col-1 ">
            <button onClick={() => { setEditFull(!editFull) }} className="edit-btn fs-2">
              <BiSolidEditAlt />
            </button>
          </div>


        </div>

        {/* /////////////////////// */}

        <div className="col-12 col-xl-6 row p-2 ">
          <h3 className="col-10 col-md-5  edit-form-lable text-start">  Email :</h3>
          <p className={!editEmail ? "d-inline col-10 col-md-4 py-3 edit-form-p fw-bold email" : 'd-none'}> {freeLancer.email} </p>
          <div className={editEmail ? "d-inline col-10 col-md-4 py-3 " : 'd-none'} >
            <input type="email" onChange={(e) => { setEmail(e.target.value) }} className="search w-100 p-2" />
          </div>
          <div className="col-1 ">
            <button onClick={() => { setEditEmail(!editEmail) }} className="edit-btn fs-2">
              <BiSolidEditAlt />
            </button>
          </div>
        </div>

        {/* /////////////////////// */}
        <div className="col-12 col-xl-6 row p-2 ">
          <h3 className="col-8 col-md-5  edit-form-lable text-start"> Phone :</h3>
          <p className={!editNumber ? "d-inline col-10 col-md-4 py-3 edit-form-p fw-bold" : 'd-none'}> {freeLancer.phone} </p>
          <div className={editNumber ? "d-inline col-10 col-md-4 py-3 " : 'd-none'} >
            <input type="text" onChange={(e) => { setPhone(e.target.value) }} className="search w-100 p-2" />
          </div>


          <div className="col-1 ">
            <button onClick={() => { setEditNumber(!editNumber) }} className="edit-btn fs-2">
              <BiSolidEditAlt />
            </button>
          </div>

        </div>

        {/* /////////////////////// */}
        <div className="d-flex col-12 col-xl-6 row p-2 ">
          <h3 className="col-8 col-md-5  edit-form-lable text-start">Speciality :</h3>
          {specialities.map((speciality) => (
            speciality._id == specialityId ?
              <p key={speciality._id} className={!editSpeciality ? "d-inline col-10 col-md-4 py-3 edit-form-p fw-bold" : 'd-none'}>{speciality.specialityName}</p>
              : ''
          ))}
          <div className={editSpeciality ? "d-inline col-10 col-md-4 py-3 " : 'd-none'} >
            <select id="speciality" name="speciality" className="p-2 px-4 search col-10 col-lg-7" value={userSpeciality}
              onChange={(event) => specialityChangeHandler(event.target.value)}>
              <option value="" className='text-secondary'>Specialities</option>
              {specialities.map((speciality) => (
                <option value={speciality._id} key={speciality._id}>{speciality.specialityName}</option>
              ))}
            </select>
          </div>

          <div className="col-1 ">
            <button onClick={() => { if (freeLancer.speciality) { setEditSpeciality(!editSpeciality) } else { setEditSpeciality(true) } }} className="edit-btn fs-2">
              <BiSolidEditAlt />
            </button>
          </div>
        </div>
        {/* /////////////////////// */}
        <div className="col-12 col-xl-6 row p-2 ">
          <h3 className="col-10 col-md-5  edit-form-lable text-start"> Country :</h3>
          <p className={!editCountry ? "d-inline col-10 col-md-4 py-3 edit-form-p fw-bold" : 'd-none'}> {freeLancer.country} </p>
          <div className={editCountry ? "d-inline col-10 col-md-4 py-3 " : 'd-none'} >
            <input type="text" onChange={(e) => { setCountry(e.target.value) }} className="search w-100 p-2" />
          </div>
          <div className="col-1 ">
            <button onClick={() => { setEditCountry(!editCountry) }} className="edit-btn fs-2">
              <BiSolidEditAlt />
            </button>
          </div>
        </div>
        {/* /////////////////////// */}
        <div className="col-12 col-xl-6 row p-2 ">
          <h3 className="col-10 col-md-5  edit-form-lable text-start"> City :</h3>
          <p className={!editCity ? "d-inline col-10 col-md-4 py-3 edit-form-p fw-bold" : 'd-none'}> {freeLancer.city} </p>
          <div className={editCity ? "d-inline col-10 col-md-4 py-3 " : 'd-none'} >
            <input type="text" onChange={(e) => { setCity(e.target.value) }} className="search w-100 p-2" />
          </div>
          <div className="col-1 ">
            <button onClick={() => { setEditCity(!editCity) }} className="edit-btn fs-2">
              <BiSolidEditAlt />
            </button>
          </div>
        </div>
        {/* /////////////////////// */}


        <div className="col-12  p-3">
          <button
            disabled={
              !editFull &&
              !editNumber &&
              !editSpeciality&&
              !editCountry &&
              !editEmail &&
              !editCity
            }
            className="edit-user-btn p-3 col-10 col-lg-4 fw-bold" onClick={editFreeLancerHandler}>
            Edit
          </button>
        </div>

      </div>

    </div>
  )
}

export default FreeLancerDetails
