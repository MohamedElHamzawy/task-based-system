import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";

import { useParams } from "react-router-dom";
import { BiSolidEditAlt } from 'react-icons/bi';
import { RiDeleteBinFill } from 'react-icons/ri';
import { TiArrowBack } from 'react-icons/ti';



const UserDetails = () => {

  const [visable, setVisable] = useState(false);

  const [editFull, setEditFull] = useState(false);
  const [editUser, setEditUser] = useState(false);
  const [editNumber, setEditNumber] = useState(false);
  const [editCountry, setEditCountry] = useState(false);

  const [editRole, setEditRole] = useState(false);
  const [editSpeciality, setEditSpeciality] = useState(false);



  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  let { id } = useParams();

  const [user, setUser] = useState([]);
  const [fullName, setFullName] = useState();
  const [userName, setUserName] = useState();
  const [userRole, setUserRole] = useState();
  const [country, setCountry] = useState();
  const [phone, setPhone] = useState();
  const [userSpeciality, setUserSpeciality] = useState();
  // const [userBSpeciality, setUserBSpeciality] = useState();

  const [specialityId, setspecialityId] = useState();
  const [specialities, setSpecialities] = useState([]);

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios.get(`http://localhost:5000/api/user/${id}`).then((res) => {
          setUser(res.data.user);
          setFullName(res.data.user.fullname);
          setUserName(res.data.user.username);
          setUserRole(res.data.user.user_role);
          setCountry(res.data.user.country);
          setPhone(res.data.user.phone);
          if (res.data.user.user_role == 'userB') {
            setspecialityId(res.data.user.speciality);
            setVisable(true);
          }
        });

        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

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

  //speciality value
  const specialityChangeHandler = (newOne) => {
    setUserSpeciality(newOne);
  };


  //////////////////////////////////////
  const editUserHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    // if(userRole=='userB'){
    //   setUserBSpeciality(userSpeciality)
    // }else{
    //   setUserBSpeciality()
    // }
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        `http://localhost:5000/api/user/${user._id}`,
        {
          fullName: fullName,
          userName: userName,
          userRole: userRole,
          speciality: userSpeciality,
          country: country,
          phone: phone,
        }
      );
      const responseData = await response;
      console.log(responseData)
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
  const deleteUserHandler = async () => {
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.delete(
        ` http://localhost:5000/api/user/${id}`
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
      window.location.href = '/';
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
    <div className="text-center row w-100 p-4 m-0">
      <ErrorModal error={error} onClear={errorHandler} />

      <div className="row mb-4">
        <div className="col-3 text-center">
          <button className="back-btn p-2 px-3 fs-3 " onClick={() => { window.location.href = '/' }}><TiArrowBack /> </button>
        </div>
        <h2 className="col-9 col-lg-7 text-center edit-form-lable p-2">  User Details</h2>
      </div>

      <div className="row bg-white adduser-form p-3 m-1 justify-content-center">
        {userRole == 'admin' ?
          ''
          :
          <div className="col-12 row p-3 justify-content-end ">
            <div className="col-4">
              <button className="delete-btn px-4 p-1 fs-3" onClick={deleteUserHandler}>
                <RiDeleteBinFill />
              </button>
            </div>
          </div>}

        {/* /////////////////////// */}
        <div className="col-12 col-xl-6 row ">
          <h3 className="col-8 col-md-5  edit-form-lable text-start"> Full Name :</h3>
          <p className={!editFull ? "d-inline col-10 col-md-4 py-3 edit-form-p fw-bold " : 'd-none'}> {user.fullname} </p>
          <div className={editFull ? "d-inline col-10 col-md-4 py-3 " : 'd-none'} >
            <input type="text" onChange={(e) => { setFullName(e.target.value) }} className="search w-100 p-2" />
          </div>

          {userRole == 'admin' ?
            ''
            :
            <div className="col-1 ">
              <button onClick={() => { setEditFull(!editFull) }} className="edit-btn fs-2">
                <BiSolidEditAlt />
              </button>
            </div>
          }

        </div>
        {/* /////////////////////// */}

        <div className="col-12 col-xl-6 row p-2 ">
          <h3 className="col-8 col-md-5  edit-form-lable text-start"> User Name :</h3>
          <p className={!editUser ? "d-inline col-10 col-md-4 py-3 edit-form-p fw-bold" : 'd-none'}> {user.username} </p>
          <div className={editUser ? "d-inline col-10 col-md-4 py-3 " : 'd-none'} >
            <input type="text" onChange={(e) => { setUserName(e.target.value) }} className="search w-100 p-2" />
          </div>
          {userRole == 'admin' ?
            ''
            :
            <div className="col-1 ">
              <button onClick={() => { setEditUser(!editUser) }} className="edit-btn fs-2">
                <BiSolidEditAlt />
              </button>
            </div>}
        </div>
        {/* /////////////////////// */}
        <div className="col-12 col-xl-6 row p-2 ">
          <h3 className="col-8 col-md-5  edit-form-lable text-start"> Phone :</h3>
          <p className={!editNumber ? "d-inline col-10 col-md-4 py-3 edit-form-p fw-bold" : 'd-none'}> {user.phone} </p>
          <div className={editNumber ? "d-inline col-10 col-md-4 py-3 " : 'd-none'} >
            <input type="text" onChange={(e) => { setPhone(e.target.value) }} className="search w-100 p-2" />
          </div>

          {userRole == 'admin' ?
            ''
            :
            <div className="col-1 ">
              <button onClick={() => { setEditNumber(!editNumber) }} className="edit-btn fs-2">
                <BiSolidEditAlt />
              </button>
            </div>}

        </div>
        {/* /////////////////////// */}
        <div className="col-12 col-xl-6 row p-2 ">
          <h3 className="col-8 col-md-5  edit-form-lable text-start"> Country :</h3>
          <p className={!editCountry ? "d-inline col-10 col-md-4 py-3 edit-form-p fw-bold" : 'd-none'}> {user.country} </p>
          <div className={editCountry ? "d-inline col-10 col-md-4 py-3 " : 'd-none'} >
            <input type="text" onChange={(e) => { setCountry(e.target.value) }} className="search w-100 p-2" />
          </div>
          {userRole == 'admin' ?
            ''
            :
            <div className="col-1 ">
              <button onClick={() => { setEditCountry(!editCountry) }} className="edit-btn fs-2">
                <BiSolidEditAlt />
              </button>
            </div>
          }
        </div>
        {/* /////////////////////// */}
        <div className="col-12 col-xl-6 row p-2 ">
          <h3 className="col-8 col-md-5  edit-form-lable text-start"> User Role :</h3>
          <p className={!editRole ? "d-inline col-10 col-md-4 py-3 edit-form-p fw-bold" : 'd-none'}> {user.user_role} </p>
          <div className={editRole ? "d-inline col-10 col-md-4 py-3 " : 'd-none'} >
            <select id="role" name="role" className="search w-100 p-2" value={userRole}
              onChange={(e) => { setUserRole(e.target.value); if (e.target.value == 'userB') { setVisable(true); setEditSpeciality(true) } else { setVisable(false) } }} >
              <option value="" className='text-secondary'>Role</option>
              <option value="admin">Admin</option>
              <option value="userA">UserA</option>
              <option value="userB">UserB</option>
            </select>
          </div>
          {userRole == 'admin' ?
            ''
            :
            <div className="col-1 ">
              <button onClick={() => { setEditRole(!editRole); if (user.user_role == 'userB') { setVisable(true) } else { setVisable(false) }; setUserRole(user.user_role) }} className="edit-btn fs-2">
                <BiSolidEditAlt />
              </button>
            </div>
          }
        </div>
        {/* /////////////////////// */}
        <div className={visable ? "d-flex col-12 col-xl-6 row p-2 " : 'd-none'}>
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
          {userRole == 'admin' ?
            ''
            :
            <div className="col-1 ">
              <button onClick={() => { if (user.speciality) { setEditSpeciality(!editSpeciality) } else { setEditSpeciality(true) } }} className="edit-btn fs-2">
                <BiSolidEditAlt />
              </button>
            </div>}
        </div>
        {/* /////////////////////// */}


        <div className="col-12  p-3">
          {userRole == 'admin' ?
            ''
            :
            <button
              disabled={
                !editFull &&
                !editUser &&
                !editNumber &&
                !editRole &&
                !editSpeciality &&
                !editCountry
              }
              className="edit-user-btn p-3 col-10 col-lg-4 fw-bold" onClick={editUserHandler}>
              Edit
            </button>
          }
        </div>

      </div>

    </div>
  )
}

export default UserDetails
