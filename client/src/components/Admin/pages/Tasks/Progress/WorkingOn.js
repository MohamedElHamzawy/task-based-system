import React from "react";
import ReactSelect from "react-select";

const WorkingOn = ({}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-center space-x-2">
        <div className="w-1/3">
          <label htmlFor="cost" className="text-gray-400 font-semibold">
            Assign Freelancer
          </label>
          <ReactSelect className="h-10" />
        </div>
        <div className="w-1/3">
          <label htmlFor="cost" className="text-gray-400 font-semibold">
            Cost
          </label>
          <input type="number" name="cost" id="cost" />
        </div>
      </div>
      <div className="flex items-center justify-end space-x-1">
        <button className="bg-blue-500 text-white px-4 py-2 rounded active:scale-95">
          Submit
        </button>
        <button className="bg-gray-300 text-gray-500 px-4 py-2 rounded active:scale-95">
          Not Available
        </button>
      </div>
    </div>
  );
};

export default WorkingOn;
