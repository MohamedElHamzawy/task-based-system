import React from "react";

const WaitingOffer = ({ rejected }) => {
  return (
    <div className="">
      <div className="flex items-end justify-between">
        <div className="w-1/3">
          <label htmlFor="cost" className="text-gray-400 font-semibold">
            Cost
          </label>
          <input type="number" name="cost" id="cost" />
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded active:scale-95">
          Submit
        </button>
      </div>
    </div>
  );
};

export default WaitingOffer;
