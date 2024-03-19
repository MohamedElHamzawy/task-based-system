import React, { useEffect, useState } from "react";
import axios from "../../../../../axios";
import LoadingSpinner from "../../../../../LoadingSpinner/LoadingSpinner";

const Ongoing = ({ taskId, freelancer, setStatus }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);

  const handleDone = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }
      await axios.post(`/task/action/done/${taskId}`, formData);
      setStatus("done");
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
      <p className="p-0 m-0">Freelancer {freelancer} working on the task</p>
      <div className="flex items-end justify-between">
        <label htmlFor="attatchment">
          <span className="text-gray-400">Attatchment</span>
          <input
            type="file"
            name="attatchment"
            id="attatchment"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>
        <button
          onClick={handleDone}
          className="bg-blue-500 text-white px-4 py-2 rounded active:scale-95"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default Ongoing;
