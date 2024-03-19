import React, { useState } from "react";
import LoadingSpinner from "../../../../../LoadingSpinner/LoadingSpinner";
import axios from "../../../../../axios";

const Assigned = ({ taskId, freelancer, setStatus }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleProceed = async () => {
    try {
      setIsLoading(true);
      await axios.post(`/task/action/ongoing/${taskId}`);
      setStatus("on going");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (error.response) {
        console.log(error.response.data);
      } else {
        console.log(error);
      }
    }
  };

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <div className="">
      <div className="flex items-end justify-between">
        <p className="m-0 p-0 flex flex-col">
          <span>Freelancer {freelancer} was assigned to the task</span>
          <span>proceed if freelancer started working on the task</span>
        </p>

        <button
          onClick={handleProceed}
          className="bg-blue-500 text-white px-4 py-2 rounded active:scale-95"
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

export default Assigned;
