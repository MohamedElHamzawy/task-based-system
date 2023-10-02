import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";

import { useParams } from "react-router-dom";
import { TiArrowBack } from 'react-icons/ti';

import { AiOutlineTransaction } from 'react-icons/ai';

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
        await axios.get(` https://smarteduservices.com:5000/api/account/${id}`).then((res) => {
          setAccount(res.data.account);
          setTransactions(res.data.transactions);
        });
        setLoading(false);
        setIsLoading(false);
      });
      timerId = setTimeout(async () => {
        await axios.get(" https://smarteduservices.com:5000/api/client/").then((res) => {
          setClients(res.data.clients);
        });
      });
      timerId = setTimeout(async () => {
        await axios.get(" https://smarteduservices.com:5000/api/freelancer/").then((res) => {
          setFreeLancers(res.data.freelancers);

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
        <h2 className="col-12 col-lg-6 text-center system-head p-2 pt-3 m-0  fw-bold">  Account Details</h2>
      </div>

      <div className="row bg-white adduser-form p-3 m-1 justify-content-center col-12 col-lg-10">

        <div className="col-12 col-lg-6 row  ">
          <h4 className="col-12 col-md-6  edit-form-lable text-start  fw-bold"> UserName :</h4>
          <p className="d-inline col-12 col-md-6 pt-2 edit-form-p fw-bold text-end">{account.title} </p>
        </div>
        <div className="col-12 col-lg-6 row  ">
          <h4 className="col-5  edit-form-lable text-start  fw-bold"> Owner:</h4>
          <p className="d-inline col-7 pt-2 edit-form-p fw-bold text-end"> <a href={`/${account.type}/${account.owner}`}> Owner Details </a> </p>
        </div>
        <div className="col-12 col-lg-6 row  ">
          <h4 className="col-12 col-md-7  edit-form-lable text-start  fw-bold"> AccountType:</h4>
          <p className="d-inline col-12 col-md-5 pt-2 edit-form-p fw-bold text-end"> {account.type} </p>
        </div>
        <div className="col-12 col-lg-6 row ">
          <h4 className="col-6 edit-form-lable text-start  fw-bold"> Balance:</h4>
          <p className="d-inline col-6 pt-2 edit-form-p fw-bold text-end"> {Math.floor(account.balance)} </p>
        </div>

      </div>
      <h1 className="system-head p-2  fw-bold">Transactions :</h1>
      <div className="col-10 text-end py-1">
        <button className="add_trans p-2 fw-bold" onClick={() => { window.location.href = '/transactions' }}>
        <AiOutlineTransaction className='fs-4' />
          Add New Transaction
        </button>
      </div>

      {transactions && !transactions.length == 0 ? transactions.map((transaction) => (
        <div key={transaction._id}
        className={transaction.method =="system"? "row col-12 col-lg-10 transactions adduser-form p-3 m-1 justify-content-start my-1" : 'row col-12 col-lg-10 manual-transactions adduser-form p-3 m-1 justify-content-start my-1'}>
          
          <div className="col-12 col-lg-6 row ">
             {account.type == 'client' ? 
             <h4 className="col-6 edit-form-lable text-start  fw-bold"> TaskPrice:</h4>
             : 
             <h4 className="col-12 col-md-6 edit-form-lable text-start  fw-bold"> FreeLancerPrice:</h4>} 
            <p className="d-inline col-12 col-md-6 pt-2 edit-form-p fw-bold text-end"> {Math.floor(transaction.amount)}  </p>
          </div>

          <div className="col-12 col-lg-6 row ">
            <h4 className="col-12 col-md-7 edit-form-lable text-start  fw-bold"> Transaction Date:</h4>
            <p className="d-inline col-12 col-md-5 pt-2 edit-form-p fw-bold text-end"> {transaction.createdAt.split('T')[0]} </p>
          </div>

          <div className="col-12 col-lg-6 row ">
            <h4 className="col-12 col-md-7 edit-form-lable text-start "> Method:</h4>
            <p className="d-inline col-12 col-md-5 pt-2 edit-form-p fw-bold text-end"> {transaction.method} </p>
          </div>

          {transaction.task && 
          <div className="col-12 col-lg-6 row ">
            <h4 className="col-12 col-md-6  edit-form-lable text-start"> Task Title :</h4>
            <p className="d-inline col-12 col-md-6 pt-2 edit-form-p fw-bold text-end"> {transaction.task.title} </p>
          </div>}
          
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

         {transaction.transactionType &&  <div className="col-12 col-lg-6 row ">
            <h4 className="col-12 col-md-7 edit-form-lable text-start "> Transaction Type:</h4>
            <p className="d-inline col-12 col-md-5 pt-2 edit-form-p fw-bold text-end"> {transaction.transactionType} </p>
          </div>}
          
          {transaction.accountNumber &&  <div className="col-12 col-lg-6 row ">
            <h4 className="col-12 col-md-7 edit-form-lable text-start "> Account Number:</h4>
            <p className="d-inline col-12 col-md-5 pt-2 edit-form-p fw-bold text-end"> {transaction.accountNumber} </p>
          </div>}

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
