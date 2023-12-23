import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import "./Users.css";
import { RiDeleteBinFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { MdOutlineTune } from "react-icons/md";
import { FaExternalLinkAlt } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";

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

  const Filter = ({ children, applyFunction }) => (
    <div
      className={`transition-all flex flex-col items-center fixed left-64 top-16 ${
        filterOpen ? "w-44" : "w-14"
      } h-full -ml-2.5 bg-white drop-shadow px-2`}
    >
      <div className={`flex justify-between items-center w-full mt-4`}>
        {filterOpen && <h1 className="text-xl">Filters</h1>}
        <MdOutlineTune
          onClick={() => setFilterOpen((prev) => !prev)}
          className={`${
            !filterOpen && "mx-auto"
          } cursor-pointer hover:bg-gray-200 rounded-full -mt-1 p-1`}
          size={30}
        />
      </div>
      {filterOpen && (
        <div>
          <div className="mt-2 mb-4 flex flex-col">{children}</div>
          <button
            type="button"
            onClick={() => applyFunction()}
            className="w-full px-4 py-1 text-sm text-black font-semibold border border-gray-400 hover:text-white hover:bg-gray-100 hover:border-transparent focus:outline-none focus:ring-1 focus:ring-black"
          >
            APPLY
          </button>
        </div>
      )}
    </div>
  );
  const User = ({ user }) => (
    <div
      className="bg-white my-2 drop-shadow px-4 py-2 flex items-center justify-between"
      key={user._id}
    >
      <div className="flex items-center space-x-4 w-1/3">
        <div className="w-10 h-10 rounded-full bg-teal-300 flex items-center justify-center font-bold">
          {user.fullname.charAt(0).toUpperCase()}
        </div>
        <span>{user.fullname}</span>
      </div>
      <div className="w-1/3 flex justify-center">
        <p className="m-0 bg-blue-100 rounded-md border w-1/2 text-blue-600 text-center">
          {user.user_role}
        </p>
      </div>
      <div className="w-1/3 flex items-center justify-end space-x-4">
        <button onClick={() => navigate(`/user/${user._id}`)}>
          <FaExternalLinkAlt className="h-5 w-5" color="gray" />
        </button>

        {user.user_role == "admin" ? (
          <button className="" disabled>
            <RiDeleteBinFill className="h-6 w-6" color="gray" />
          </button>
        ) : (
          <button onClick={() => deleteUserHandler(user._id)}>
            <RiDeleteBinFill className="h-6 w-6" color="red" />
          </button>
        )}
      </div>
    </div>
  );

  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <>
      <Filter applyFunction={filterHandler}>
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
      <div className="h-[calc(100vh-100px)] ml-44">
        <div className="flex justify-between items-center my-8">
          <h1 className="text-2xl">System Users</h1>
          <div className="">FILTERS</div>
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
              searchFilter.map((user) => <User user={user} />)
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
              filterData.map((user) => <User user={user} />)
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
