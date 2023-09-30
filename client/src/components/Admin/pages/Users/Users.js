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
        await axios.get(" http://localhost:5000/api/user/").then((res) => {
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
  const [filterRole, setFilterRole] = useState('');

  const [searchFilterData, setSearchFilterData] = useState(true);
  const [allFilterData, setAllFilterData] = useState(false);


  const searchFilter = getSearchFilter(searchName, users);
  const [filterData, setFilterData] = useState([]);


  const deleteUserHandler = async (id) => {
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.delete(
        `  http://localhost:5000/api/user/${id}`
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


    //Filter Handler
    const filterHandler = async () => {
      setAllFilterData(true); 
      setSearchFilterData(false);
      setSearchName('');
      console.log( sortedUsers,filterRole)
      // send api request to validate data
      setIsLoading(true);
      try {
        setError(null);
        const response = await axios.post(
          ' http://localhost:5000/api/user/sort/filter/',
          {
            sort: sortedUsers,
            role :filterRole  ,  
         });
        const responseData = await response;
        if (!(response.statusText === "OK")) {
          throw new Error(responseData.data.message);
        }
        setFilterData(response.data.users)
        console.log(response.data)
        setLoading(false);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        setError(err.message && "SomeThing Went Wrong , Please Try Again .");
      }
    };

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

        <div className="col-10 col-sm-8 col-lg-3 p-2 ">
          <input type="name" className="search p-2 w-100" placeholder=" Search Usernames" value={searchName}
            onChange={(e) => { setSearchName(e.target.value); setAllFilterData(false); setSearchFilterData(true); setFilterRole(''); setSortedUsers('')}}
          />
        </div>

        <div className="col-12 col-sm-5 col-lg-3 text-secondary row p-2">
          <label htmlFor="role" className="mt-2 col-4 col-sm-3 text-end">Filter:</label>
          <select id="role" name="role" className=" search col-8 col-sm-9 p-2" value={filterRole}
            onChange={(e) => { setFilterRole(e.target.value); }}
          >
            <option value="" className="text-secondary">Role</option>
            <option value="admin">Admin</option>
            <option value="customerService">Customer Service</option>
            <option value="specialistService">Specialist Service</option>
          </select>
        </div>

        <div className="col-12 col-sm-5 col-lg-3 text-secondary row p-2">
          <label htmlFor="role" className="mt-2 col-4 col-sm-3 text-end">Sort:</label>
          <select id="role" name="role" className=" search col-8 col-sm-9 p-2"
            onChange={(e) => {setSortedUsers(e.target.value) ;}}
          >
            <option value="" className="text-secondary">sort</option>
            <option value="completed">Completed</option>
            <option value="profit">Profit</option>
          </select>
        </div>

        <div className="col-5 col-sm-2 col-lg-3  p-2 text-center ">
          <button 
          disabled={
            !filterRole &&
            !sortedUsers
          }
          onClick={filterHandler} className="filter-btn p-2">
            <FiFilter className='fs-3' /> Filter
          </button>
        </div>

        <div className="col-7 col-sm-12 p-2 justify-content-end text-end">
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

        {allFilterData ? !filterData.length == 0 ? filterData.map((user) => (
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

      </div>
    </div>
  )
}

export default Users
