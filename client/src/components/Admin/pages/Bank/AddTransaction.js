import React, { useEffect, useState } from "react";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import { TiArrowBack } from "react-icons/ti";
import { Field, Form, Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../../../axios";
import ReactSelect from "react-select";

const AddTransaction = ({}) => {
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accounts, setAccounts] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get("/bank");
        setAccounts(data);
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
      await axios.post("/bankTransaction", values);
    } catch (error) {
      if (error.response) {
        setMessage({ type: "error", message: error.response.data.err });
      } else {
        setMessage({ type: "error", message: error.message });
      }
    } finally {
      setIsLoading(false);
      navigate("/bank");
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
          Add Transaction
        </h2>
      </div>
      {isLoading ? (
        <LoadingSpinner asOverlay />
      ) : (
        <Formik
          initialValues={{
            from: "",
            to: "",
            exchangeRate: 1,
            amount: "",
          }}
          onSubmit={onSubmit}
        >
          {(formik) => (
            <Form className="mx-auto max-w-lg flex flex-col items-center mt-4">
              <div className="w-full mb-4">
                <label
                  htmlFor="from"
                  className="block mb-2 text-lg font-medium text-gray-700"
                >
                  From:
                </label>
                <ReactSelect
                  options={accounts.map((account) => ({
                    label: `${account.title} - ${account.currency.currencyname}`,
                    value: account._id,
                  }))}
                  onChange={(e) => formik.setFieldValue("from", e.value)}
                  className="w-full rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  name="from"
                />
              </div>
              <div className="w-full mb-4">
                <label
                  htmlFor="to"
                  className="block mb-2 text-lg font-medium text-gray-700"
                >
                  To:
                </label>
                <ReactSelect
                  options={accounts.map((account) => ({
                    label: `${account.title} - ${account.currency.currencyname}`,
                    value: account._id,
                  }))}
                  onChange={(e) => formik.setFieldValue("to", e.value)}
                  className="w-full rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  name="to"
                />
              </div>
              <div className="w-full mb-4">
                <label
                  htmlFor="amount"
                  className="block mb-2 text-lg font-medium text-gray-700"
                >
                  Amount:
                </label>
                <Field
                  type="number"
                  id="amount"
                  name="amount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="exchangeRate"
                  className="block mb-2 text-lg font-medium text-gray-700"
                >
                  Exchange Rate:
                </label>
                <Field
                  type="number"
                  id="exchangeRate"
                  name="exchangeRate"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 text-lg font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Add Transaction
              </button>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default AddTransaction;
