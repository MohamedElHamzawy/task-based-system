import React from "react";

const OfferSubmitted = ({}) => {
  return (
    <div className="">
      <div className="flex items-end justify-between">
        <div className="w-1/3">
          <span className="text-gray-400 font-semibold">Cost</span>
          <p className="p-0 m-0">1200 EGP</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded active:scale-95">
            Accept
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded active:scale-95">
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferSubmitted;
