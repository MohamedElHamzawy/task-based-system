import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";

import { useParams } from "react-router-dom";
import { TiArrowBack } from 'react-icons/ti';


const AccountDetails = () => {

  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  let { id } = useParams();

  const [account, setAccount] = useState([]);
  const [clients, setClients] = useState([]);
  const [freeLancers, setFreeLancers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios.get(`http://localhost:5000/api/account/${id}`).then((res) => {
          setAccount(res.data.account);
          setTransactions(res.data.transactions);
          console.log(res.data)
        });
        setLoading(false);
        setIsLoading(false);
      });
      timerId = setTimeout(async () => {
        await axios.get("http://localhost:5000/api/client/").then((res) => {
          setClients(res.data.clients);
          console.log(res.data)
        });
      });
      timerId = setTimeout(async () => {
        await axios.get("http://localhost:5000/api/freelancer/").then((res) => {
          setFreeLancers(res.data.freelancers);
          console.log(res.data)

        });
      });    
    
    }
    return () => clearTimeout(timerId);
  }, [loading]);


  //error message
  const errorHandler = () => {
    setError(null);
    window.location.reload(true);
  };

  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="text-center row w-100 p-2 m-0 justify-content-center">
      <ErrorModal error={error} onClear={errorHandler} />

      <div className="row mb-4 p-0 m-0">
        <div className="col-3 text-center">
          <button className="back-btn p-2 px-3 fs-3 " onClick={() => { window.location.href = '/accounts' }}><TiArrowBack /> </button>
        </div>
        <h2 className="col-12 col-lg-6 text-center system-head p-2 pt-3 m-0 ">  Account Details</h2>
      </div>

      <div className="row bg-white adduser-form p-3 m-1 justify-content-center col-12 col-lg-10">

        <div className="col-12 col-lg-6 row  ">
          <h4 className="col-12 col-md-6  edit-form-lable text-start"> UserName :</h4>
          <p className="d-inline col-12 col-md-6 pt-2 edit-form-p fw-bold text-end"> {account.title} </p>
        </div>
        <div className="col-12 col-lg-6 row  ">
          <h4 className="col-5  edit-form-lable text-start"> Owner:</h4>
          <p className="d-inline col-7 pt-2 edit-form-p fw-bold text-end"> <a href={`/${account.type}/${account.owner}`}> Owner Details </a> </p>
        </div>
        <div className="col-12 col-lg-6 row  ">
          <h4 className="col-12 col-md-7  edit-form-lable text-start"> AccountType:</h4>
          <p className="d-inline col-12 col-md-5 pt-2 edit-form-p fw-bold text-end"> {account.type} </p>
        </div>
        <div className="col-12 col-lg-6 row ">
          <h4 className="col-6 edit-form-lable text-start"> Balance:</h4>
          <p className="d-inline col-6 pt-2 edit-form-p fw-bold text-end"> {account.balance} EGP </p>
        </div>

      </div>
      <h1 className="system-head p-2">Transactions :</h1>
      {transactions && !transactions.length == 0 ? transactions.map((transaction) => (
        <div className="row col-12 col-lg-10 transactions adduser-form p-3 m-1 justify-content-center my-1" key={transaction._id}>

         {transaction.task && 
          <div className="col-12 col-lg-6 row ">
            <h4 className="col-12 col-md-6  edit-form-lable text-start"> Task Title :</h4>
            <p className="d-inline col-12 col-md-6 pt-2 edit-form-p fw-bold text-end"> {transaction.task.title} </p>
          </div>}

          <div className="col-12 col-lg-6 row ">
             {account.type == 'client' ? 
             <h4 className="col-6 edit-form-lable text-start"> TaskPrice:</h4>
             : 
             <h4 className="col-12 col-md-6 edit-form-lable text-start"> FreeLancerPrice:</h4>} 
            <p className="d-inline col-12 col-md-6 pt-2 edit-form-p fw-bold text-end"> {transaction.amount} EGP </p>
          </div>

          {transaction.task &&  account && account.type == 'freelancer' &&
            <>
              {clients && clients.map((client) => (
                client._id == transaction.task.client &&
                <div className="col-12 col-lg-6 row " key={client._id}>
                  <h4 className="col-6  edit-form-lable text-start"> Client :</h4>
                  <p className="d-inline col-6 pt-2 edit-form-p fw-bold text-end"> {client.clientname} </p>
                </div>
              ))}

              <div className="col-12 col-lg-6 row ">
                <h4 className="col-12 col-md-6  edit-form-lable text-start "> Client Details:</h4>
                <p className="d-inline col-12 col-md-6 pt-2 edit-form-p fw-bold text-end">  <a href={`/client/${transaction.task.client}`}>  Click Here </a> </p>
              </div>
            </>
          }
          {transaction.task && account && account.type == 'client' &&
            <>
              {freeLancers && freeLancers.map((freeLancer) => (
                freeLancer._id == transaction.task.freelancer &&
                <div className="col-12 col-lg-6 row " key={freeLancer._id}>
                  <h4 className="col-12 col-md-6 edit-form-lable text-start"> FreeLancer :</h4>
                  <p className="d-inline col-12 col-md-6 pt-2 edit-form-p fw-bold text-end"> {freeLancer.freelancername} </p>
                </div>
              ))}
              <div className="col-12 col-lg-6 row ">
                <h4 className="col-12 col-md-8  edit-form-lable text-start  FreeLancer-Details">FreeLancer Details:</h4>
                <p className="d-inline col-12 col-md-4 pt-2 edit-form-p fw-bold text-end"> <a href={`/freeLancer/${transaction.task.freelancer}`}> Click Here </a> </p>
              </div>
            </>
          }
          {
            transaction.task &&
            <div className="col-12 col-lg-6 row ">
            <h4 className="col-12 col-md-7  edit-form-lable text-start "> Task Details:</h4>
            <p className="d-inline col-12 col-md-5 pt-2 edit-form-p fw-bold text-end"> <a href={`/task/${transaction.task._id}`}>Click Here </a> </p>
          </div>
          }  

          <div className="col-12 col-lg-6 row ">
            <h4 className="col-12 col-md-7 edit-form-lable text-start "> Transaction Date:</h4>
            <p className="d-inline col-12 col-md-5 pt-2 edit-form-p fw-bold text-end"> {transaction.createdAt.split('T')[0]} </p>
          </div>
        </div>
      )) :
        <div className="row transactions adduser-form p-3 m-1 justify-content-center edit-form-lable col-12 col-lg-10">
          <h4>There Is No Transactions Right Now</h4>
        </div>
      } 

    </div>
  )
}

export default AccountDetails
