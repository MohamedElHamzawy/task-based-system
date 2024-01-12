import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import Filter from "../../../Filter.js";
import User from "../../../User.js";

//search filter
const getSearchFilter = (searchName, users) => {
  if (!searchName) {
    return users;
  }
  return users.filter((user) =>
    user.fullname.toLowerCase().includes(searchName.toLowerCase())
  );
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
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URL}:5000/api/user/`)
          .then((res) => {
            setUsers(res.data.users);
          });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  const [searchName, setSearchName] = useState("");
  const [sortedUsers, setSortedUsers] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [searchFilterData, setSearchFilterData] = useState(true);
  const [allFilterData, setAllFilterData] = useState(false);
  const searchFilter = getSearchFilter(searchName, users);
  const [filterData, setFilterData] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const navigate = useNavigate();

  const deleteUserHandler = async (id) => {
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/user/${id}`
      );
      const responseData = await response;

      setError(responseData.data.message);
      setIsLoading(false);
      window.location.href = "/";
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "SomeThing Went Wrong , Please Try Again .");
    }
  };

  //Filter Handler
  const filterHandler = async () => {
    setAllFilterData(true);
    setSearchFilterData(false);
    setSearchName("");
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/user/sort/filter/`,
        {
          sort: sortedUsers,
          role: filterRole,
        }
      );
      const responseData = await response;
      if (!(response.statusText === "OK")) {
        throw new Error(responseData.data.message);
      }
      setFilterData(response.data.users);

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
    <>
      <Filter
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
        applyFunction={filterHandler}
      >
        <select
          id="role"
          name="role"
          className="w-full focus:ring-0 focus:border-black"
          value={filterRole}
          onChange={(e) => {
            setFilterRole(e.target.value);
          }}
        >
          <option value="" className="text-secondary">
            Role
          </option>
          <option value="admin">Admin</option>
          <option value="customerService">Customer Service</option>
          <option value="specialistService">Specialist Service</option>
        </select>
      </Filter>
      <div className="min-h-[calc(100vh-100px)] ml-44">
        <div className="flex justify-between items-center my-8">
          <h1 className="text-2xl">System Users</h1>
          {/* <div className="">FILTERS</div> */}
        </div>
        <div className="bg-gray-100 px-8 py-4 rounded-sm drop-shadow">
          <div className="flex justify-between items-center">Team Members</div>
          <div className="flex justify-between items-center my-4">
            <input
              type="search"
              className="rounded-sm w-1/3"
              placeholder="Search Usernames"
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);
                setAllFilterData(false);
                setSearchFilterData(true);
                setFilterRole("");
                setSortedUsers("");
              }}
            />

            <button
              className="text-white px-4 py-2 flex items-center rounded-sm"
              style={{ backgroundColor: "#00E38C" }}
              type="button"
              onClick={() => navigate("/adduser")}
            >
              <IoMdAdd className="text-xl" />
              Add New User
            </button>
          </div>
          {searchFilterData ? (
            !searchFilter.length == 0 ? (
              searchFilter.map((user) => (
                <User deleteUserHandler={deleteUserHandler} user={user} />
              ))
            ) : (
              <div className="">
                <h2>There Is No Users</h2>
              </div>
            )
          ) : (
            ""
          )}
          {allFilterData ? (
            !filterData.length == 0 ? (
              filterData.map((user) => (
                <User deleteUserHandler={deleteUserHandler} user={user} />
              ))
            ) : (
              <div className="row p-3 m-0 text-center">
                <h2>There Is No Users</h2>
              </div>
            )
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default Users;
