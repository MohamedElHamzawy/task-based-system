import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";
import './Settings.css'
import { BiSolidEditAlt } from 'react-icons/bi';
import { TiArrowBack } from 'react-icons/ti';



const Settings = () => {

  const [editFull, setEditFull] = useState(false);
  const [editUser, setEditUser] = useState(false);
  const [editNumber, setEditNumber] = useState(false);
  const [editRole, setEditRole] = useState(false);
  const [editType, setEditType] = useState(false);
  const [editSpeciality, setEditSpeciality] = useState(false);
  const [editCountry, setEditCountry] = useState(false);
  const [editPassword, setEditPassword] = useState(false);


  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const [user, setUser] = useState([]);
  const [fullName, setFullName] = useState();
  const [userName, setUserName] = useState();
  const [password, setPassword] = useState();
  const [userRole, setUserRole] = useState();
  const [userType, setUserType] = useState();
  const [country, setCountry] = useState();
  const [phone, setPhone] = useState();
  const [speciality, setSpeciality] = useState();

  const userID = JSON.parse(localStorage.getItem('AdminData'));


  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios.get(`http://localhost:5000/api/user/${userID}`).then((res) => {
          setUser(res.data.user);         
          setFullName(res.data.user.fullname);
          setUserName(res.data.user.username);
          setUserRole(res.data.user.user_role);
          setUserType(res.data.user.user_type);
          setCountry(res.data.user.country);
          setPhone(res.data.user.phone);
          setSpeciality(res.data.user.speciality);
          setPassword(res.data.user.password);
        });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);


  //////////////////////////////////////
  const editUserHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        `http://localhost:5000/api/user/${user._id}`,
        {
          fullName: fullName,
          userName: userName,
          password: password,
          userRole: userRole,
          userType: userType,
          country: country,
          phone: phone,
          speciality: speciality,
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
        <h2 className="col-12 text-center edit-form-lable p-2">  User Settings</h2>
      </div>

       <div className="row bg-dark m-1 adduser-form p-1 py-5 justify-content-center">


        <div className="col-12 col-xl-6 row ">
          <h3 className="col-8 col-md-5  settings-form-lable text-start"> Full Name :</h3>
          <p className={!editFull ? "d-inline col-10 col-md-4 py-3 text-warning fw-bold " : 'd-none'}> {user.fullname} </p>
          <div className={editFull ? "d-inline col-10 col-md-4 py-3 " : 'd-none'} >
            <input type="text" onChange={(e) => { setFullName(e.target.value) }} className="search w-100 p-2" />
          </div>
          <div className="col-1 ">
            <button onClick={() => { setEditFull(!editFull) }} className="settings-edit-btn fs-2">
              <BiSolidEditAlt />
            </button>
          </div>
        </div>

        <div className="col-12 col-xl-6 row p-2 ">
          <h3 className="col-8 col-md-5  settings-form-lable text-start"> User Name :</h3>
          <p className={!editUser ? "d-inline col-10 col-md-4 py-3 text-warning fw-bold" : 'd-none'}> {user.username} </p>
          <div className={editUser ? "d-inline col-10 col-md-4 py-3 " : 'd-none'} >
            <input type="text" onChange={(e) => { setUserName(e.target.value) }} className="search w-100 p-2" />
          </div>
          <div className="col-1 ">
            <button onClick={() => { setEditUser(!editUser) }} className="settings-edit-btn fs-2">
              <BiSolidEditAlt />
            </button>
          </div>
        </div>

        <div className="col-12 col-xl-6 row p-2 ">
          <h3 className="col-8 col-md-5  settings-form-lable text-start"> PassWord :</h3>
          <p className={!editPassword ? "d-inline col-10 col-md-4 py-3 text-warning fw-bold" : 'd-none'}> {user.password} </p>
          <div className={editPassword ? "d-inline col-10 col-md-4 py-3 " : 'd-none'} >
            <input type="text" onChange={(e) => { setPassword(e.target.value) }} className="search w-100 p-2" />
          </div>
          <div className="col-1 ">
            <button onClick={() => { setEditPassword(!editPassword) }} className="settings-edit-btn fs-2">
              <BiSolidEditAlt />
            </button>
          </div>
        </div>

        <div className="col-12 col-xl-6 row p-2 ">
          <h3 className="col-8 col-md-5  settings-form-lable text-start"> Phone :</h3>
          <p className={!editNumber ? "d-inline col-10 col-md-4 py-3 text-warning fw-bold" : 'd-none'}> {user.phone} </p>
          <div className={editNumber ? "d-inline col-10 col-md-4 py-3 " : 'd-none'} >
            <input type="text" onChange={(e) => { setPhone(e.target.value) }} className="search w-100 p-2" />
          </div>
          <div className="col-1 ">
            <button onClick={() => { setEditNumber(!editNumber) }} className="settings-edit-btn fs-2">
              <BiSolidEditAlt />
            </button>
          </div>
        </div>

        <div className="col-12 col-xl-6 row p-2 ">
          <h3 className="col-8 col-md-5  settings-form-lable text-start"> User Role :</h3>
          <p className={!editRole ? "d-inline col-10 col-md-4 py-3 text-warning fw-bold" : 'd-none'}> {user.user_role} </p>
          <div className={editRole ? "d-inline col-10 col-md-4 py-3 " : 'd-none'} >
            <select id="role" name="role" className="search w-100 p-2"
              onChange={(e) => { setUserRole(e.target.value) }}>
              <option value="" className='text-secondary'>Role</option>
              <option value="admin">Admin</option>
              <option value="userA">UserA</option>
              <option value="userB">UserB</option>
            </select>
          </div>
          <div className="col-1 ">
            <button onClick={() => { setEditRole(!editRole) }} className="settings-edit-btn fs-2">
              <BiSolidEditAlt />
            </button>
          </div>
        </div>

        <div className="col-12 col-xl-6 row p-2 ">
          <h3 className="col-8 col-md-5  settings-form-lable text-start"> User Type :</h3>
          <p className={!editType ? "d-inline col-10 col-md-4 py-3 text-warning fw-bold" : 'd-none'}> {user.user_type} </p>
          <div className={editType ? "d-inline col-10 col-md-4 py-3 " : 'd-none'} >
            <select id="usertype" name="usertype" className="search w-100 p-2"
              onChange={(e) => { setUserType(e.target.value) }}>
              <option value="" className='text-secondary'>UserType</option>
              <option value="super admin">Super Admin</option>
              <option value="userA">UserA</option>
              <option value="userB">UserB</option>
            </select>
          </div>
          <div className="col-1 ">
            <button onClick={() => { setEditType(!editType) }} className="settings-edit-btn fs-2">
              <BiSolidEditAlt />
            </button>
          </div>
        </div>

        <div className="col-12 col-xl-6 row p-2 ">
          <h3 className="col-8 col-md-5  settings-form-lable text-start"> Country :</h3>
          <p className={!editCountry ? "d-inline col-10 col-md-4 py-3 text-warning fw-bold" : 'd-none'}> {user.country} </p>
          <div className={editCountry ? "d-inline col-10 col-md-4 py-3 " : 'd-none'} >
            <input type="text" onChange={(e) => { setCountry(e.target.value) }} className="search w-100 p-2" />
          </div>
          <div className="col-1 ">
            <button onClick={() => { setEditCountry(!editCountry) }} className="settings-edit-btn fs-2">
              <BiSolidEditAlt />
            </button>
          </div>
        </div>

        <div className="col-12 col-xl-6 row p-2 ">
          <h3 className="col-8 col-md-5  settings-form-lable text-start"> Speciality :</h3>
          <p className={!editSpeciality ? "d-inline col-10 col-md-4 py-3 text-warning fw-bold speciality" : 'd-none'}> {user.speciality} </p>
          <div className={editSpeciality ? "d-inline col-10 col-md-4 py-3 " : 'd-none'} >
            <input type="text" onChange={(e) => { setSpeciality(e.target.value) }} className="search w-100 p-2" />
          </div>
          <div className="col-1 ">
            <button onClick={() => { setEditSpeciality(!editSpeciality) }} className="settings-edit-btn fs-2">
              <BiSolidEditAlt />
            </button>
          </div>
        </div>


        <div className="col-12  p-3">
          <button
            disabled={
              !editFull &&
              !editUser &&
              !editNumber &&
              !editRole &&
              !editType &&
              !editSpeciality &&
              !editCountry &&
              !editPassword
            }
            className="settings-edit-user-btn p-3 col-10 col-lg-4 fw-bold" onClick={editUserHandler}>
            Edit
          </button>
        </div>

      </div> 

    </div>
  )
}

export default Settings
