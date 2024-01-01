import React from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { RiDeleteBinFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const User = ({ user }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white my-2 drop-shadow px-4 py-2 flex items-center justify-between">
      <div className="flex-1 flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-indigo-300 flex items-center justify-center font-bold">
          {user.title && user.title.charAt(0).toUpperCase()}
        </div>
        <span>{user.title}</span>
      </div>
      <div className="w-1/5 flex justify-center">
        <p className="m-0 bg-blue-100 px-4 rounded-md border text-blue-600 text-center">
          {user.type}
        </p>
      </div>
      <div className="w-1/5 flex justify-center">
        <p className="m-0 bg-blue-100 px-4 rounded-md border text-blue-600 text-center">
          {user.balance}
        </p>
      </div>
      <div className="flex items-center justify-end space-x-4">
        <button onClick={() => navigate(`/account/${user._id}`)}>
          <FaExternalLinkAlt className="h-5 w-5" color="gray" />
        </button>
      </div>
    </div>
  );
};

export default User;
