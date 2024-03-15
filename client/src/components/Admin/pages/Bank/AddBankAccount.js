import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TiArrowBack } from "react-icons/ti";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "../../../../axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";

const AddBankAccount = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currencies, setCurrencies] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get("/currency");
        setCurrencies(data.currencies);
      } catch (error) {
        if (error.response) {
          setMessage({ type: "error", message: error.response.data.err });
        } else {
          setMessage({ type: "error", message: error.message });
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      console.log(values);
      await axios.post("/bank", values);
      navigate("/bank");
    } catch (error) {
      if (error.response) {
        setMessage({ type: "error", message: error.response.data.err });
      } else {
        setMessage({ type: "error", message: error.message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full p-3 min-h-[calc(100vh-65px)]">
      {message && (
        <ErrorModal message={message} onClear={() => setMessage(null)} />
      )}
      <div className="relative flex flex-row justify-center w-full p-1 mb-4">
        <Link to="/bank" className="absolute top-0 left-0 p-2 text-3xl">
          <TiArrowBack />
        </Link>
        <h2 className="text-center text-2xl font-bold lg:text-3xl">
          Add New Bank Account
        </h2>
      </div>
      {isLoading ? (
        <LoadingSpinner asOverlay />
      ) : (
        <Formik
          initialValues={{
            title: "",
            balance: "",
            currency: "",
          }}
          onSubmit={onSubmit}
        >
          <Form className="mx-auto max-w-lg flex flex-col items-center mt-4">
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block mb-2 text-lg font-medium text-gray-700"
              >
                Title:
              </label>
              <Field
                type="text"
                id="title"
                name="title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="balance"
                className="block mb-2 text-lg font-medium text-gray-700"
              >
                Balance:
              </label>
              <Field
                type="number"
                id="balance"
                name="balance"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
            <div className="w-full mb-4">
              <label
                htmlFor="currency"
                className="block mb-2 text-lg font-medium text-gray-700"
              >
                Currency:
              </label>
              <Field
                as="select"
                id="currency"
                name="currency"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              >
                <option value="">Select Currency</option>
                {currencies.map((currency) => (
                  <option key={currency._id} value={currency._id}>
                    {currency.currencyname}
                  </option>
                ))}
              </Field>
            </div>
            <button
              type="submit"
              className="px-4 py-2 text-lg font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Create Account
            </button>
          </Form>
        </Formik>
      )}
    </div>
  );
};

export default AddBankAccount;
