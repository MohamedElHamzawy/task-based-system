import React from "react";
import { Link } from "react-router-dom";

const Done = ({}) => {
  return (
    <div className="">
      <p className="p-0 m-0">
        Freelancer Essam Elshawaly has finished the task
      </p>
      <div className="flex items-end justify-between">
        <Link to="#" className="text-gray-400 no-underline hover:text-blue-500">
          Attatchment - (file.txt)
        </Link>

        <button className="bg-blue-500 text-white px-4 py-2 rounded active:scale-95">
          Deliver
        </button>
      </div>
    </div>
  );
};

export default Done;
