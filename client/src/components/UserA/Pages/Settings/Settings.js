import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";
import { BiSolidEditAlt } from "react-icons/bi";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router";

const Settings = () => {
  const [editFull, setEditFull] = useState(false);
  const [editUser, setEditUser] = useState(false);
  const [editNumber, setEditNumber] = useState(false);
  const [editCountry, setEditCountry] = useState(false);
  const [editPassword, setEditPassword] = useState(false);

  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const [countries, setCountries] = useState([]);
  const [user, setUser] = useState([]);
  const [fullName, setFullName] = useState();
  const [userName, setUserName] = useState();
  const [password, setPassword] = useState();

  const [phone, setPhone] = useState();

  const userID = JSON.parse(localStorage.getItem("UserAData"));
  const loggedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URL}:5000/api/user/${userID}`)
          .then((res) => {
            setUser(res.data.user);
            setFullName(res.data.user.fullname);
            setUserName(res.data.user.username);
            setCountry(res.data.user.country);
            setPhone(res.data.user.phone);
            setPassword(res.data.user.password);
          });
        setLoading(false);
        setIsLoading(false);
      });
      timerId = setTimeout(async () => {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URL}:5000/api/country/`)
          .then((res) => {
            setCountries(res.data.countries);
          });
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  //country value
  const [country, setCountry] = useState("");
  const countryChangeHandler = (newOne) => {
    setCountry(newOne);
  };

  //////////////////////////////////////
  const editUserHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/user/${user._id}`,
        {
          fullName: fullName,
          userName: userName,
          country: country,
          phone: phone,
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

  //error message
  const errorHandler = () => {
    setError(null);
    window.location.reload(true);
  };

  const navigate = useNavigate();

  const editAll = () => {
    setEditFull(true);
    setEditUser(true);
    setEditNumber(true);
    setEditCountry(true);
    setEditPassword(true);
  };

  const cancelEdit = () => {
    setEditFull(false);
    setEditUser(false);
    setEditNumber(false);
    setEditCountry(false);
    setEditPassword(false);
  };

  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="container justify-center min-h-[calc(100vh-100px)]">
      <ErrorModal error={error} onClear={errorHandler} />

      <div className="p-4">
        <div className="flex justify-between items-center my-8">
          <h1 className="text-2xl font-semibold">User Settings</h1>
        </div>

        <h2 className="text-3xl font-medium">Profile</h2>

        <div className="flex items-center justify-between">
          <div className="ml-2">
            <h2 className="text-xl font-semibold">
              Change your profile picture
            </h2>
            <p className="text-gray-400 font-medium m-0 p-0">
              Signed in as {loggedUser.fullname}
            </p>
          </div>

          <div className="bg-green-200 w-24 h-24 rounded-full relative">
            <FaPlus className="text-2xl rounded-full p-1 absolute bottom-1 right-1.5 cursor-pointer transition-all hover:bg-black hover:text-white" />
          </div>
        </div>
      </div>

      <div className="bg-gray-400 h-0.5 w-full rounded-full"></div>

      <h2 className="p-4 text-3xl font-medium">You Account</h2>

      <div className="pl-8 pb-4 justify-center grid grid-cols-2 gap-y-4">
        <div>
          <h5 className="text-lg">Full Name</h5>
          <p className={!editFull ? "text-sm ml-2" : "hidden"}>
            {user.fullname}
          </p>

          <input
            type="text"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
            }}
            className={editFull ? "w-3/5 text-sm ml-2 rounded" : "hidden"}
          />
        </div>

        <div>
          <h5 className="text-lg">Username</h5>
          <p className={!editFull ? "text-sm ml-2" : "hidden"}>
            {user.username}
          </p>
          <input
            type="text"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
            className={editFull ? "w-3/5 text-sm ml-2 rounded" : "hidden"}
          />
        </div>

        {/* Phone */}
        <div>
          <h5 className="text-lg">Phone</h5>
          <p className={!editFull ? "text-sm ml-2" : "hidden"}>{user.phone}</p>
          <input
            type="text"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
            }}
            className={editFull ? "w-3/5 text-sm ml-2 rounded" : "hidden"}
          />
        </div>

        {/* Country */}
        <div>
          <h5 className="text-lg">Country</h5>
          <p className={!editFull ? "text-sm ml-2" : "hidden"}>
            {user.country && user.country.countryName}
          </p>
          <select
            id="country"
            name="country"
            className={editFull ? "w-3/5 text-sm ml-2 rounded" : "hidden"}
            value={country}
            onChange={(event) => countryChangeHandler(event.target.value)}
          >
            <option value="" className="text-secondary">
              Countries
            </option>
            {countries.map((country) => (
              <option value={country._id} key={country._id}>
                {country.countryName}
              </option>
            ))}
          </select>
        </div>

        {/* User Role */}
        <div>
          <h5 className="text-lg">User Role</h5>
          <p className={"text-sm ml-2"}>{user.user_role}</p>
        </div>

        {/* Password */}
        <div>
          <h5 className="text-lg">Password</h5>
          <div className="text-sm ml-2">
            *********
            <button
              type="button"
              className="0 px-3 py-1 underline text-blue-500 transition-all hover:text-blue-400"
              onClick={() => navigate("/changepass")}
            >
              Change Pass
            </button>
          </div>
        </div>

        <div className="col-span-2 flex items-center justify-center space-x-2">
          {editFull ? (
            <button
              type="button"
              className="bg-green-500 rounded-sm transition-all hover:bg-green-400 text-white px-3 py-1"
              onClick={editUserHandler}
            >
              Save
            </button>
          ) : (
            <button
              type="button"
              className="bg-cyan-600 rounded-sm transition-all hover:bg-cyan-400 text-white px-12 py-1"
              onClick={editAll}
            >
              Edit
            </button>
          )}
          {editFull && (
            <button
              type="button"
              className="bg-red-500 rounded-sm transition-all hover:bg-red-400 text-white px-3 py-1"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
