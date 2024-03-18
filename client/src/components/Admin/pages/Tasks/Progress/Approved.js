import React from "react";
import ReactSelect from "react-select";

const Approved = ({}) => {
  return (
    <div className="">
      <div className="flex items-end justify-between">
        <div className="w-1/3">
          <label htmlFor="cost" className="text-gray-400 font-semibold">
            Assign Freelancer
          </label>
          <ReactSelect />
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </div>
    </div>
  );
};

export default Approved;
