import React from "react";
import { FaTrash } from "react-icons/fa";

const Users = ({ sectionClasses }) => {
  const users = [
    { name: "Ahmed Mohamed", role: "Admin", image: "url" },
    { name: "Amr Gaafar", role: "Admin", image: "url" },
    { name: "Ahmed Mahmoud", role: "Customer Service", image: "url" },
    { name: "Ahmed Mahmoud", role: "Specialist Service", image: "url" },
  ];

  return (
    <div className={`${sectionClasses} w-2/5 font-medium pt-4 px-4`}>
      <p className="text-2xl">System Users</p>
      <div className="">
        {users.map((user) => (
          <div key={user.name} className="w-full h-full">
            <div className="w-full flex justify-between py-3">
              <div className="w-3/5 flex items-center space-x-4">
                <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                  {user.name.charAt(0).toLocaleUpperCase()}
                </div>
                <span className="">
                  {user.name}
                  <br />
                  <span className="text-xs text-gray-500">
                    Level of Exp: {user.role}
                  </span>
                </span>
              </div>
              <div className="w-1/5 flex items-center justify-end">
                <FaTrash
                  className={`text-2xl ${
                    user.role !== "Admin"
                      ? "text-red-500 cursor-pointer"
                      : "text-gray-500"
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
