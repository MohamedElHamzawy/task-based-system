import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";

import { useParams } from "react-router-dom";
import { BiSolidEditAlt } from 'react-icons/bi';
import { RiDeleteBinFill } from 'react-icons/ri';
import { TiArrowBack } from 'react-icons/ti';


const AccountDetails = () => {

  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  let { id } = useParams();

  const [account, setAccount] = useState([]);

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios.get(`http://localhost:5000/api/account/${id}`).then((res) => {
          setAccount(res.data.account);
        });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);
  console.log(account)

  //error message
  const errorHandler = () => {
    setError(null);
    window.location.reload(true);
  };

  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="text-center row w-100 p-2 m-0">
      <ErrorModal error={error} onClear={errorHandler} />

      <div className="row mb-4">
        <div className="col-3 text-center">
          <button className="back-btn p-2 px-3 fs-3 " onClick={() => { window.location.href = '/accounts' }}><TiArrowBack /> </button>
        </div>
        <h2 className="col-12 col-lg-7 text-center edit-form-lable p-2 pt-4">  Account Details</h2>
      </div>

      <div className="row bg-white adduser-form p-3 m-1 justify-content-center">

        <div className="col-12 col-xl-6 row p-2 ">
          <h3 className="col-10 col-md-5  edit-form-lable text-start"> UserName :</h3>
          <p className="d-inline col-10 col-md-4 py-3 edit-form-p fw-bold"> {account.title} </p>
        </div>
        <div className="col-12 col-xl-6 row p-2 ">
          <h3 className="col-10 col-md-5  edit-form-lable text-start"> Owner :</h3>
          <p className="d-inline col-10 col-md-4 py-3 edit-form-p fw-bold"> <a href={`/${account.type}/${account.owner}`}> Owner Details </a> </p>
        </div>
        <div className="col-12 col-xl-6 row p-2 ">
          <h3 className="col-10 col-md-5  edit-form-lable text-start"> AccountType :</h3>
          <p className="d-inline col-10 col-md-4 py-3 edit-form-p fw-bold"> {account.type} </p>
        </div>
        <div className="col-12 col-xl-6 row p-2 ">
          <h3 className="col-10 col-md-5  edit-form-lable text-start"> Balance :</h3>
          <p className="d-inline col-10 col-md-4 py-3 edit-form-p fw-bold"> {account.balance} </p>
        </div>


      </div>

    </div>
  )
}

export default AccountDetails
