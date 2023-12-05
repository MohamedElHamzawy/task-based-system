import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";

import { useParams } from "react-router-dom";
import { RiDeleteBinFill } from "react-icons/ri";
import { TiArrowBack } from "react-icons/ti";

import { ImCancelCircle } from "react-icons/im";

const CurrencyDetails = () => {
  const [edit, setEdit] = useState(false);

  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  let { id } = useParams();

  const [currency, setCurrency] = useState([]);
  const [currencyName, setCurrencyName] = useState();
  const [currencyPrice, setCurrencyPrice] = useState();
  const [expired, setExpired] = useState();

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URL}:5000/api/currency/${id}`)
          .then((res) => {
            setCurrency(res.data.message);
          });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  //////////////////////////////////////
  const editCurrencyHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/currency/${currency._id}`,
        {
          name: currencyName,
          price: currencyPrice,
          expired: expired,
        }
      );
      const responseData = await response;

      if (!(response.statusText === "OK")) {
        throw new Error(responseData.data.message);
      }
      setError(responseData.data.message);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err.message && "SomeThing Went Wrong , Please Try Again .");
    }
  };

  //delete user
  const deleteCurrencyHandler = async () => {
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/currency/${id}`
      );
      const responseData = await response;

      setError(responseData.data.message);
      setIsLoading(false);
      window.location.href = "/currency";
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "SomeThing Went Wrong , Please Try Again .");
    }
  };
  //error message
  const errorHandler = () => {
    setError(null);
    window.location.reload(true);
  };

  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="text-center row w-100 p-4 m-0">
      <ErrorModal error={error} onClear={errorHandler} />

      <div className="row mb-4">
        <div className="col-3 text-center">
          <button
            className="back-btn p-2 px-3 fs-3 "
            onClick={() => {
              window.location.href = "/currency";
            }}
          >
            <TiArrowBack />{" "}
          </button>
        </div>
        <h2 className="col-12 col-lg-7 text-center system-head p-2 pt-4">
          {" "}
          Currency Details
        </h2>
      </div>

      <div className="row bg-white adduser-form p-1 m-1 justify-content-start">
        <div className="col-12 row p-3 justify-content-end ">
          <div className="col-4">
            <button
              className="delete-btn px-4 p-1 fs-3"
              onClick={deleteCurrencyHandler}
            >
              <RiDeleteBinFill />
            </button>
          </div>
        </div>
        {/* /////////////////////// */}
        <div className="col-12 col-xl-6 row ">
          <p className="col-12 col-md-6  edit-form-lable text-start fw-bold">
            {" "}
            Currency Name:
          </p>
          <p
            className={
              !edit
                ? "d-inline col-10 col-md-4 pt-2 edit-form-p fw-bold "
                : "d-none"
            }
          >
            {" "}
            {currency.currencyname}{" "}
          </p>
          <div className={edit ? "d-inline col-10 col-md-4  " : "d-none"}>
            <input
              type="text"
              onChange={(e) => {
                setCurrencyName(e.target.value);
              }}
              className="search w-100 p-2"
            />
          </div>
        </div>
        {/* /////////////////////// */}

        <div className="col-12 col-xl-6 row p-2 ">
          <p className="col-12 col-md-6  edit-form-lable text-start fw-bold">
            {" "}
            Price In EGP:
          </p>
          <p
            className={
              !edit
                ? "d-inline col-10 col-md-4 pt-2 edit-form-p fw-bold"
                : "d-none"
            }
          >
            {" "}
            {currency.priceToEGP}{" "}
          </p>
          <div className={edit ? "d-inline col-10 col-md-4 " : "d-none"}>
            <input
              type="number"
              onChange={(e) => {
                setCurrencyPrice(e.target.value);
              }}
              className="search w-100 p-2"
            />
          </div>
        </div>
        {/* /////////////////////// */}
        <div className="col-12 col-xl-6 row ">
          <p className="col-12 col-md-6  edit-form-lable text-start fw-bold">
            Expired:
          </p>
          <p
            className={
              !edit
                ? "d-inline col-10 col-md-4 pt-2 edit-form-p fw-bold "
                : "d-none"
            }
          >
            {" "}
            {currency.expired ? "True" : "False"}{" "}
          </p>
          <div className={edit ? "d-inline col-10 col-md-4 " : "d-none"}>
            <select
              onChange={(e) => setExpired(e.target.value)}
              value={expired}
              className="search p-2 w-100"
            >
              <option value={""} className="text-secondary">
                Expired
              </option>
              <option value={true}>True</option>
              <option value={false}>False</option>
            </select>
          </div>
        </div>

        {/* /////////////////////// */}

        <div className="col-12  p-3">
          {!edit ? (
            <button
              className="edit-user-btn p-3 col-10 col-lg-4 fw-bold"
              onClick={() => {
                setEdit(!edit);
              }}
            >
              Edit
            </button>
          ) : (
            ""
          )}
          {edit ? (
            <>
              <button
                disabled={!currencyName && !currencyPrice && !expired}
                className="edit-user-btn p-3 col-8 col-lg-4 fw-bold"
                onClick={editCurrencyHandler}
              >
                Submit
              </button>
              <button
                className="bg-danger cancel-btn p-3 col-3 col-md-1 mx-2 fw-bold"
                onClick={() => {
                  setEdit(!edit);
                }}
              >
                <ImCancelCircle className="fs-3" />
              </button>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrencyDetails;
