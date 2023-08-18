import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import './Users.css'
import { BsFillFolderSymlinkFill } from 'react-icons/bs';
import { RiUserAddFill } from 'react-icons/ri';
import { RiDeleteBinFill } from 'react-icons/ri';
import { FiFilter } from 'react-icons/fi';

//search filter
const getSearchFilter = (searchName, users) => {
  if (!searchName ) {
    return users;
  }  return users.filter((user) => user.fullname.includes(searchName));
};
// Role filter
const getRoleFilter = (searchRole, users) => {
  if (!searchRole ) {
    return users;
  }  return users.filter((user) => user.user_role.includes(searchRole));
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error , setError] = useState(false);
  

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios.get("http://localhost:5000/api/user/").then((res) => {
          setUsers(res.data.users);
        });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  const [searchName, setSearchName] = useState('');
  const [searchFilterData, setSearchFilterData] = useState(true);
  const [searchRole, setSearchRole] = useState('');
  const [RoleFilterData, setRoleFilterData] = useState(false);

  const searchFilter = getSearchFilter(searchName,users);
  const roleFilter = getRoleFilter(searchRole,users);

  const deleteUserHandler=async(id)=>{
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
    window.location.href = '/' ;
  }catch (err) {
    setIsLoading(false);
    setError(err.message || "SomeThing Went Wrong , Please Try Again .");
  };
  }

  
  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="row w-100 p-0 m-0">

      <div className="row p-0 m-0 ">

        <div className="col-8 col-md-4 p-2">
          <button onClick={() => { window.location.href = '/adduser' }} className="new-user p-2">
          <RiUserAddFill className="fs-3"/>  Add New User
          </button>
        </div>

        <div className="col-8 col-md-3 p-2">
          <input type="name" className="search p-2 w-100" placeholder=" Search Usernames" 
           onChange={(e) => { setSearchName(e.target.value) ;  setRoleFilterData(false) ; setSearchFilterData(true) }}
          />
        </div>

        <div className="col-12 col-md-5 text-secondary row p-2">
          <label htmlFor="role" className="m-2 col-5 text-end"> <FiFilter className=""/> Filter:</label>
          <select id="role" name="role" className=" search col-5"
           onChange={(e) => {setSearchRole(e.target.value) ; setSearchFilterData(false) ; setRoleFilterData(true)}}
          >
            <option value="">Role</option>
            <option value="admin">Admin</option>
            <option value="userA">UserA</option>
            <option value="userB">UserB</option>
          </select>
        </div>

      </div>

      <div className="bg-white w-100 users-data row p-0 m-0 mt-2">
        <div className="row fw-bold table-head p-0 m-0 py-2">
          <p className="col-4 col-md-5">FullName</p>
          <p className="col-2 col-md-3">Role</p>
          <p className="col-3 col-md-2">Details</p>
          <p className="col-2 ">Delete</p>

        </div>

        { searchFilterData ? !searchFilter.length==0 ? searchFilter.map((user) => (
          <div className="table-body row pt-3 p-0 m-0 " key={user._id}>
            <p className="col-4 col-md-5 name-role">{user.fullname}</p>
            <p className="col-3 name-role">{user.user_role}</p>
            <p className="col-2 fs-5 "> <a className="view-details fs-4" href={`/user/${user._id}`}><BsFillFolderSymlinkFill/></a> </p>
            <p className="col-2"> <button className=" delete-btn p-2 px-3" onClick={()=>deleteUserHandler(user._id)}> <RiDeleteBinFill/> </button></p>     
          </div>
        ))  : 
        <div className="row  p-3 m-0 text-center" >
          <h2>
           There Is No Users 
          </h2>   
        </div>  :'' 
        }

        { RoleFilterData ? !roleFilter.length==0 ? roleFilter.map((user) => (
          <div className="table-body row pt-3 p-0 m-0 " key={user._id}>
            <p className="col-4 col-md-5 name-role">{user.fullname}</p>
            <p className="col-3 name-role">{user.user_role}</p>
            <p className="col-2 fs-5 "> <a className="view-details fs-4" href={`/user/${user._id}`}><BsFillFolderSymlinkFill/></a> </p>
            <p className="col-2"> <button className=" delete-btn p-2 px-3" onClick={()=>deleteUserHandler(user._id)}> <RiDeleteBinFill/> </button></p>     
          </div>
        ))  : 
        <div className="row  p-3 m-0 text-center" >
          <h2>
           There Is No Users 
          </h2>   
        </div>  : ''   
        }

      </div>
    </div>
  )
}

export default Users
