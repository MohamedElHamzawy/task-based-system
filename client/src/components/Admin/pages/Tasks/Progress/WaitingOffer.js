import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import axios from "../../../../../axios";
import LoadingSpinner from "../../../../../LoadingSpinner/LoadingSpinner";

const WaitingOffer = ({ rejected, taskId, setStatus }) => {
  const [isLoading, setIsLoading] = useState(false);
  const initialValues = {
    cost: 0,
  };

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      await axios.post(`/task/action/offer/${taskId}`, values);
      setStatus("offer submitted");
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
    <Formik initialValues={initialValues} onSubmit={onSubmit} className="">
      {({ getFieldProps }) => (
        <Form className="flex items-end justify-between">
          <div className="w-1/3">
            <label htmlFor="cost" className="text-gray-400 font-semibold">
              Cost
            </label>
            <input type="number" {...getFieldProps("cost")} />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded active:scale-95"
          >
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default WaitingOffer;
