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
  if (!searchName) {
    return users;
  } return users.filter((user) => user.fullname.toLowerCase().includes(searchName.toLowerCase()));
};
// Role filter
const getRoleFilter = (searchRole, users) => {
  if (!searchRole) {
    return users;
  } return users.filter((user) => user.user_role.includes(searchRole));
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);


  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios.get("http://localhost:5000/api/user/").then((res) => {
          setUsers(res.data.users);
          console.log(res.data)
        });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  const [searchName, setSearchName] = useState('');
  const [searchRole, setSearchRole] = useState('');
  const [sortedUsers, setSortedUsers] = useState('');

  const [searchFilterData, setSearchFilterData] = useState(true);
  const [RoleFilterData, setRoleFilterData] = useState(false);
  const [sortFilterData, setSortFilterData] = useState(false);

  const searchFilter = getSearchFilter(searchName, users);
  const roleFilter = getRoleFilter(searchRole, users);


  const sortHandler = async (value) => {
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.get(
       ` http://localhost:5000/api/user/sort/${value}`).then((res) => {
        setSortedUsers(res.data.users);
        console.log(res.data.users)
      });
      setLoading(false);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "SomeThing Went Wrong , Please Try Again .");
    }
  };

  const deleteUserHandler = async (id) => {
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


  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="row w-100 p-0 m-0 ">

      <div className="col-12 row text-center system-head p-2">
        <div className="col-6 col-md-3">
          <h1 className='logo text-white bg-danger p-2'>Admin</h1>
        </div>
        <h1 className="col-12 col-md-6 text-center  fw-bold">System Users</h1>
      </div>

      <div className="row p-0 m-0 justify-content-lg-end col-12 ">

        <div className="col-10 col-sm-6 col-lg-3 p-2 ">
          <input type="name" className="search p-2 w-100" placeholder=" Search Usernames" value={searchName}
            onChange={(e) => { setSearchName(e.target.value); setRoleFilterData(false); setSearchFilterData(true); setSortFilterData(false); setSearchRole('') }}
          />
        </div>

        <div className="col-12 col-sm-5 col-lg-3 text-secondary row p-2">
          <label htmlFor="role" className="mt-2 col-4 col-sm-5 text-end"> <FiFilter className="" /> Filter:</label>
          <select id="role" name="role" className=" search col-8 col-sm-7 p-2" value={searchRole}
            onChange={(e) => { setSearchRole(e.target.value); setSearchFilterData(false); setRoleFilterData(true); setSortFilterData(false); setSearchName('')  }}
          >
            <option value="" className="text-secondary">Role</option>
            <option value="admin">Admin</option>
            <option value="customerService">Customer Service</option>
            <option value="specialistService">Specialist Service</option>
          </select>
        </div>

        <div className="col-12 col-sm-7 col-lg-3 text-secondary row p-2">
          <label htmlFor="role" className="mt-2 col-4 col-sm-5 text-end"> <FiFilter /> Sort:</label>
          <select id="role" name="role" className=" search col-8 col-sm-7 p-2"
            onChange={(e) => {sortHandler(e.target.value) ;setSearchFilterData(false); setRoleFilterData(false); setSortFilterData(true) ; setSearchName('') ; setSearchRole('') }}
          >
            <option value="" className="text-secondary">sort</option>
            <option value="completed">Completed</option>
            <option value="profit">Profit</option>
          </select>
        </div>

        <div className="col-12 col-sm-5 col-lg-3 p-2 justify-content-end">
          <button onClick={() => { window.location.href = '/adduser' }} className="new-user p-2">
            <RiUserAddFill className="fs-3" />  Add New User
          </button>
        </div>

      </div>

      <div className="bg-white w-100 users-data row p-0 m-0 mt-2">
        <div className="row fw-bold table-head p-0 m-0 py-2">
          <h4 className="col-5  text-center">FullName</h4>
          <h4 className="col-4 ">Role</h4>
          <h4 className="col-2 ">Delete</h4>

        </div>

        {searchFilterData ? !searchFilter.length == 0 ? searchFilter.map((user) => (
          <div className="table-body row pt-3 p-0 m-0 " key={user._id}>
            <p className="col-5  name-role text-center  "><a className="text-dark text-decoration-none fw-bold" href={`/user/${user._id}`}>{user.fullname}</a></p>
            <p className="col-4 name-role">{user.user_role}</p>
            <p className="col-2">
              {user.user_role == 'admin' ?
                <button className=" disabled-btn p-2 px-3" disabled> <RiDeleteBinFill /> </button>
                :
                <button className=" delete-btn p-2 px-3" onClick={() => deleteUserHandler(user._id)}> <RiDeleteBinFill /> </button>
              }
            </p>
          </div>
        )) :
          <div className="row  p-3 m-0 text-center" >
            <h2>
              There Is No Users
            </h2>
          </div> : ''
        }

        {RoleFilterData ? !roleFilter.length == 0 ? roleFilter.map((user) => (
          <div className="table-body row pt-3 p-0 m-0 " key={user._id}>
            <p className="col-6  name-role text-center  "><a className="text-dark text-decoration-none fw-bold" href={`/user/${user._id}`}>{user.fullname}</a></p>
            <p className="col-4 name-role">{user.user_role}</p>
            <p className="col-2">
              {user.user_role == 'admin' ?
                <button className=" disabled-btn p-2 px-3" disabled> <RiDeleteBinFill /> </button>
                :
                <button className=" delete-btn p-2 px-3" onClick={() => deleteUserHandler(user._id)}> <RiDeleteBinFill /> </button>
              }
            </p>
          </div>
        )) :
          <div className="row  p-3 m-0 text-center" >
            <h2>
              There Is No Users
            </h2>
          </div> : ''
        }

        {sortFilterData ? !sortedUsers.length == 0 ? sortedUsers.map((user)=>(
          <div className="table-body row pt-3 p-0 m-0 " key={user._id}>
            <p className="col-6  name-role text-center  "><a className="text-dark text-decoration-none fw-bold" href={`/user/${user._id}`}>{user.fullname}</a></p>
            <p className="col-4 name-role">{user.user_role}</p>
            <p className="col-2">
              {user.user_role == 'admin' ?
                <button className=" disabled-btn p-2 px-3" disabled> <RiDeleteBinFill /> </button>
                :
                <button className=" delete-btn p-2 px-3" onClick={() => deleteUserHandler(user._id)}> <RiDeleteBinFill /> </button>
              }
            </p>
         </div>
        )):
        <div className="row  p-3 m-0 text-center" >
          <h2>
            There Is No Users
          </h2>
        </div> : ''
        }

      </div>
    </div>
  )
}

export default Users
