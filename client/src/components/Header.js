import React from "react";
import { GrSearch } from "react-icons/gr";
import { useNavigate } from "react-router";
import { IoIosNotificationsOutline } from "react-icons/io";

const Header = () => {
  const name = JSON.parse(localStorage.getItem("AdminName"));
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  return (
    <div className="bg-white fixed z-50 w-full h-16 flex items-center px-3 space-x-7 drop-shadow">
      <h1
        className="text-[#3588BA] text-2xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Smarteduservices
      </h1>
      <div className="w-full flex items-center justify-between space-x-6">
        <div className="relative flex-1 rounded-md">
          <input
            className="h-10 w-1/3 px-8 border-none ring-0"
            type="search"
            name="search"
            id="search"
            placeholder="Search..."
          />
          <GrSearch className="absolute top-3 left-2" />
        </div>
        <div className="relative cursor-pointer rounded-full transition-all active:scale-95">
          <div className="select-none animate-bounce absolute top-0 right-0.5  bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
            2
          </div>
          <IoIosNotificationsOutline className="w-8 h-8" />
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex justify-center items-center text-center capitalize">
            {name.charAt(0)}
          </div>
          <div className="text-lg text-center">
            <p className="m-0 p-0 text-base font-">{name}</p>
            <p className="m-0 p-0 text-sm text-gray-500">
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
