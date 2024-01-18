import React from "react";
import { FaBell } from "react-icons/fa"; // Import the desired icon

const NotificationCard = ({ content, createdAt }) => {
  return (
    <div className="p-4 rounded-lg shadow-md bg-white">
      <div className="flex items-start">
        <div className="flex items-center justify-center w-8 h-8 px-2 mr-4 rounded-full bg-blue-500 text-white">
          <FaBell className="text-2xl" />
        </div>
        <div>
          <p className="text-base font-medium text-gray-900">{content}</p>
          <p className="text-sm text-gray-500">
            {new Date(createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
