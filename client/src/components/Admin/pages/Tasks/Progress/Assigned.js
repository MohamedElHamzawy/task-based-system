import React from "react";

const Assigned = ({}) => {
  return (
    <div className="">
      <div className="flex items-end justify-between">
        <p className="m-0 p-0 flex flex-col">
          <span>Freelancer Essam Elshawaly was assigned to the task</span>
          <span>proceed if freelancer started working on the task</span>
        </p>

        <button className="bg-blue-500 text-white px-4 py-2 rounded active:scale-95">
          Proceed
        </button>
      </div>
    </div>
  );
};

export default Assigned;
