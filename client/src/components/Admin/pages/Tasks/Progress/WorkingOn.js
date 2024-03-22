import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
import axios from "../../../../../axios";
import { Form, Formik } from "formik";
import LoadingSpinner from "../../../../../LoadingSpinner/LoadingSpinner";

const initialValues = {
  cost: 0,
  freelancer: "",
};

const WorkingOn = ({ setStatus, taskId }) => {
  const [freelancers, setFreeLancers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      await axios.post(`/task/action/assign/${taskId}`, values);
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

  const notAvailableHandler = async () => {};

  return isLoading ? (
    <div className="border flex items-center justify-center">
      <LoadingSpinner />
    </div>
  ) : (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {({ getFieldProps, setFieldValue }) => (
        <Form className="flex justify-between items-end">
          <div className="flex-1 flex items-center justify-center space-x-2">
            <div className="w-full">
              <label htmlFor="cost" className="text-gray-400 font-semibold">
                Assign Freelancer
              </label>
              <ReactSelect
                className="h-10"
                onChange={(e) => setFieldValue("freelancer", e.value)}
                options={freelancers.map((freelancer) => ({
                  label: freelancer.freelancername,
                  value: freelancer._id,
                }))}
              />
            </div>
            <div className="w-full">
              <label htmlFor="cost" className="text-gray-400 font-semibold">
                Cost
              </label>
              <input type="number" {...getFieldProps("cost")} />
            </div>
          </div>
          <div className="w-1/3 flex items-center justify-end space-x-1">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded active:scale-95"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={notAvailableHandler}
              className="bg-gray-300 text-gray-500 px-4 py-2 rounded active:scale-95"
            >
              Not Available
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default WorkingOn;
