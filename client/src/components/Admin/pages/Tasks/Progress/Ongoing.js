import React from "react";

const Ongoing = ({}) => {
  return (
    <div className="">
      <p className="p-0 m-0">Freelancer Essam Elshawaly working on the task</p>
      <div className="flex items-end justify-between">
        <label htmlFor="attatchment">
          <span className="text-gray-400">Attatchment</span>
          <input type="file" name="attatchment" id="attatchment" />
        </label>
        <button className="bg-blue-500 text-white px-4 py-2 rounded active:scale-95">
          Done
        </button>
      </div>
    </div>
  );
};

export default Ongoing;
