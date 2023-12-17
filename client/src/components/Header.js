import React from "react";
import { IoIosArrowDown } from "react-icons/io";
import { GrSearch } from "react-icons/gr";
import { useNavigate } from "react-router";

const Header = ({}) => {
  const name = JSON.parse(localStorage.getItem("AdminName"));
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  return (
    <div className="bg-white w-full h-16 flex items-center px-3 space-x-7 drop-shadow-sm">
      <h1
        className="text-[#3588BA] text-2xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Smarteduservices
      </h1>
      <div className="w-full flex items-center justify-between">
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
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex justify-center items-center text-center">
            {name.split("")[0].toUpperCase()}
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
