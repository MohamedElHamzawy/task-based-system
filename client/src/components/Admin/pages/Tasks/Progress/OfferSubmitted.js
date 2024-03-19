import React, { useState } from "react";
import axios from "../../../../../axios";
import LoadingSpinner from "../../../../../LoadingSpinner/LoadingSpinner";

const OfferSubmitted = ({ cost, taskId, setStatus }) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleAccept = async () => {
    try {
      setIsLoading(true);
      await axios.post(`/task/action/accept/${taskId}`);
      setStatus("approved");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (error.response) {
        console.log(error.response.data.err);
      } else {
        console.log(error.message);
      }
    }
  };

  const handleReject = async () => {
    try {
      setIsLoading(true);
      await axios.post(`/task/action/refuse/${taskId}`);
      setStatus("rejected");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (error.response) {
        console.log(error.response.data.err);
      } else {
        console.log(error.message);
      }
    }
  };

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <div className="">
      <div className="flex items-end justify-between">
        <div className="w-1/3">
          <span className="text-gray-400 font-semibold">Cost</span>
          <p className="p-0 m-0">{cost.toFixed(2)} EGP</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleAccept}
            className="bg-blue-500 text-white px-4 py-2 rounded active:scale-95"
          >
            Accept
          </button>
          <button
            onClick={handleReject}
            className="bg-red-500 text-white px-4 py-2 rounded active:scale-95"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferSubmitted;
