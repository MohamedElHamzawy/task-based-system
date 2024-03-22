import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../../../../axios";
import LoadingSpinner from "../../../../../LoadingSpinner/LoadingSpinner";

const Done = ({ taskId, freelancer, setStatus, file }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDeliver = async () => {
    try {
      setIsLoading(true);
      await axios.post(`/task/action/deliver/${taskId}`);
      setStatus("delivered");
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

  const downloadAttachment = async () => {
    try {
      setIsLoading(true);
      await axios.get(`/task/action/download/${taskId}`);
      // const url = window.URL.createObjectURL(new Blob([data]));
      // const link = document.createElement("a");
      // link.href = url;
      // link.setAttribute("download", file.name);
      // document.body.appendChild(link);
      // link.click();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (error.response) {
        console.log(error.response.data.err);
      } else {
        console.log(error);
      }
    }
  };

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <div className="">
      <p className="p-0 m-0">Freelancer {freelancer} has finished the task</p>
      <div className="flex items-end justify-between">
        <button
          onClick={downloadAttachment}
          className="text-gray-400 no-underline hover:text-blue-500"
        >
          {file ? `${file.name} - ${file.size}` : "No attatchment"}
        </button>

        <button
          onClick={handleDeliver}
          className="bg-blue-500 text-white px-4 py-2 rounded active:scale-95"
        >
          Deliver
        </button>
      </div>
    </div>
  );
};

export default Done;
