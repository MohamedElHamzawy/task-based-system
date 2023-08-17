import React, { useEffect, useState } from "react";
import axios from "axios";
import GetCookie from "../../../../hooks/getCookie";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import './Users.css'
import { BsFillFolderSymlinkFill } from 'react-icons/bs';
import { RiUserAddFill } from 'react-icons/ri';
import { RiDeleteBinFill } from 'react-icons/ri';
import { FiFilter } from 'react-icons/fi';


const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios.get("http://localhost:5000/api/user/").then((res) => {
          console.log(res.data.users)
          setUsers(res.data.users);
        });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="row w-100">
      <div className="row">
        <div className="col-4">
          <button onClick={() => { window.location.href = '/adduser' }} className="new-user p-2">
          <RiUserAddFill className="fs-3"/>  Add New User
          </button>
        </div>
        <div className="col-3">
          <input type="name" className="search p-2 w-100" placeholder=" Search Usernames" />
        </div>

        <div className="col-4 text-secondary">
          <label htmlFor="role" className="m-2 "> <FiFilter className=""/> Filter:</label>
          <select id="role" name="role" className="p-2 px-4 search ">
            <option disabled>Role</option>
            <option value="admin">Admin</option>
            <option value="userA">UserA</option>
            <option value="userB">UserB</option>
          </select>
        </div>

      </div>
      <div className="bg-white m-2 p-3 users-data">
        <div className="row fw-bold table-head">
          <p className="col-3">FullName</p>
          <p className="col-2">Role</p>
          <p className="col-3">Speciality</p>
          <p className="col-2">Details</p>
          <p className="col-2">Delete</p>

        </div>
        {users.map((user) => (
          <div className="table-body row pt-3" key={user._id}>
            <p className="col-3">{user.fullname}</p>
            <p className="col-2">{user.user_role}</p>
            <p className="col-3">{user.speciality}</p>
            <p className="col-2  fs-5 "> <a className="view-details" href={`/user/${user._id}`}><BsFillFolderSymlinkFill/></a> </p>
            <p className="col-2"> <button className="col-2 delete-btn p-1"> <RiDeleteBinFill/> </button></p>     
          </div>
        ))}
      </div>
    </div>
  )
}

export default Users
