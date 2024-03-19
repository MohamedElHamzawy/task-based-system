import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
import axios from "../../../../../axios";
import LoadingSpinner from "../../../../../LoadingSpinner/LoadingSpinner";

const Approved = ({ taskId, setStatus }) => {
  const [freelancers, setFreeLancers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/freelancer/");
        setFreeLancers(response.data.freelancers);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        if (error.respose) {
          console.log(error.response.data);
        } else {
          console.log(error);
        }
      }
    })();
  }, []);

  const submitHandler = async () => {
    if (!selectedFreelancer) return;
    try {
      setIsLoading(true);
      await axios.post(`/task/action/assign/${taskId}`, {
        freelancer: selectedFreelancer,
      });
      setStatus("assigned");
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
  ) : freelancers.length === 0 ? (
    <p>No freelancers found</p>
  ) : (
    <div className="">
      <div className="flex items-end justify-between">
        <div className="w-1/3">
          <label htmlFor="cost" className="text-gray-400 font-semibold">
            Assign Freelancer
          </label>
          <ReactSelect
            onChange={(e) => setSelectedFreelancer(e.value)}
            options={freelancers.map((freelancer) => ({
              label: freelancer.freelancername,
              value: freelancer._id,
            }))}
          />
        </div>
        <button
          onClick={submitHandler}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Approved;
