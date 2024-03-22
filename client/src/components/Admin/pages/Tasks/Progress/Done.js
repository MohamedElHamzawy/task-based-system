import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../../../../axios";
import LoadingSpinner from "../../../../../LoadingSpinner/LoadingSpinner";
import { IoMdDownload } from "react-icons/io";

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
      const { data } = await axios.get(`/task/action/download/${taskId}`);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.name);
      document.body.appendChild(link);
      link.click();
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
      <p className="p-0 m-0">Task Completed</p>
      <div className="flex items-end justify-between">
        <button
          onClick={downloadAttachment}
          className="text-blue-500 no-underline hover:text-blue-600 flex items-center space-x-0.5"
        >
          <span>
            {file.name} - {file.size}
          </span>
          <IoMdDownload />
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
