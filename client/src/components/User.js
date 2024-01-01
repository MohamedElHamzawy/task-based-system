import React from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { RiDeleteBinFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const User = ({ user, deleteUserHandler }) => {
  const navigate = useNavigate();
  return (
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
};

export default User;
