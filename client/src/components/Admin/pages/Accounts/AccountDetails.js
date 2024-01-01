import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";

import { useParams, useNavigate, Link } from "react-router-dom";
import { TiArrowBack } from "react-icons/ti";

import { AiOutlineTransaction } from "react-icons/ai";

const AccountDetails = () => {
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

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
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URL}:5000/api/account/${id}`)
          .then((res) => {
            setAccount(res.data.account);
            setTransactions(res.data.transactions);
          });
        setLoading(false);
        setIsLoading(false);
      });
      timerId = setTimeout(async () => {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URL}:5000/api/client/`)
          .then((res) => {
            setClients(res.data.clients);
          });
      });
      timerId = setTimeout(async () => {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URL}:5000/api/freelancer/`)
          .then((res) => {
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
    <div className="flex flex-col items-center p-4">
      <ErrorModal error={error} onClear={errorHandler} />

      <div className="w-full flex items-center justify-center relative">
        <div className="absolute left-0">
          <button className="text-2xl" onClick={() => navigate("/accounts")}>
            <TiArrowBack />
          </button>
        </div>
        <h2 className="text-center p-2 pt-3 m-0 font-bold">Account Details</h2>
      </div>

      <div className="bg-white p-3 m-1 w-full grid grid-cols-2 gap-2 drop-shadow rounded">
        <div className="flex items-center mx-auto">
          <h4 className="m-0 p-0 font-normal">UserName :</h4>
          <p className="font-bold ml-2 mb-0">{account.title}</p>
        </div>
        <div className="flex items-center mx-auto">
          <h4 className="m-0 p-0 font-normal"> Owner:</h4>
          <p className="font-bold ml-2 mb-0">
            <Link to={`/${account.type}/${account.owner}`}>Owner Details</Link>
          </p>
        </div>
        <div className="flex items-center mx-auto">
          <h4 className="m-0 p-0 font-normal"> AccountType:</h4>
          <p className="font-bold ml-2 mb-0">{account.type}</p>
        </div>
        <div className="flex items-center mx-auto">
          <h4 className="m-0 p-0 font-normal"> Balance:</h4>
          <p className="font-bold ml-2 mb-0">{Math.floor(account.balance)}</p>
        </div>
      </div>

      <h1 className="p-2 fw-bold">Transactions</h1>

      <button
        className="group self-end p-2 font-bold flex items-center rounded-md bg-gray-300 transition-all hover:bg-blue-500 hover:text-white"
        onClick={() => navigate("/transactions")}
      >
        <AiOutlineTransaction className="text-2xl mr-1 transition-all group-hover:text-white group-hover:rotate-180" />
        Add New Transaction
      </button>

      {transactions && !transactions.length == 0 ? (
        transactions.map((transaction) => (
          <div
            key={transaction._id}
            className="drop-shadow rounded transition-all bg-blue-50 hover:bg-blue-100 py-2 w-full grid grid-cols-2 gap-2 my-1"
          >
            <div className="flex items-center space-x-2 mx-auto">
              {account.type == "client" ? (
                <h4 className="font-normal"> TaskPrice:</h4>
              ) : (
                <h4 className="font-normal"> FreeLancerPrice:</h4>
              )}
              <p className="mb-0.5 font-bold">
                {Math.floor(transaction.amount)}
              </p>
            </div>

            <div className="flex items-center space-x-2 mx-auto">
              <h4 className="font-normal"> Transaction Date:</h4>
              <p className="mb-0.5 font-bold">
                {transaction.createdAt.split("T")[0]}
              </p>
            </div>

            <div className="flex items-center space-x-2 mx-auto">
              <h4 className="font-normal"> Method:</h4>
              <p className="mb-0.5 font-bold">{transaction.method}</p>
            </div>

            {transaction.task && (
              <div className="flex items-center space-x-2 mx-auto">
                <h4 className="font-normal"> Task Title :</h4>
                <p className="mb-0.5 font-bold">{transaction.task.title}</p>
              </div>
            )}

            {transaction.task && account && account.type == "freelancer" && (
              <>
                {clients &&
                  clients.map(
                    (client) =>
                      client._id == transaction.task.client && (
                        <div
                          className="flex items-center space-x-2 mx-auto"
                          key={client._id}
                        >
                          <h4 className="font-normal"> Client :</h4>
                          <p className="mb-0.5 font-bold">
                            {client.clientname}
                          </p>
                        </div>
                      )
                  )}

                <div className="flex items-center space-x-2 mx-auto">
                  <h4 className="font-normal"> Client Details:</h4>
                  <p className="mb-0.5 font-bold">
                    <Link to={`/client/${transaction.task.client}`}>
                      Click Here
                    </Link>
                  </p>
                </div>
              </>
            )}
            {transaction.task && account && account.type == "client" && (
              <>
                {freeLancers &&
                  freeLancers.map(
                    (freeLancer) =>
                      freeLancer._id == transaction.task.freelancer && (
                        <div
                          className="flex items-center space-x-2 mx-auto"
                          key={freeLancer._id}
                        >
                          <h4 className="font-normal"> FreeLancer :</h4>
                          <p className="mb-0.5 font-bold">
                            {freeLancer.freelancername}
                          </p>
                        </div>
                      )
                  )}
                <div className="flex items-center space-x-2 mx-auto">
                  <h4 className="font-normal">FreeLancer Details:</h4>
                  <p className="mb-0.5 font-bold">
                    <Link to={`/freeLancer/${transaction.task.freelancer}`}>
                      Click Here
                    </Link>
                  </p>
                </div>
              </>
            )}
            {transaction.task && (
              <div className="flex items-center space-x-2 mx-auto">
                <h4 className="font-normal">Task Details:</h4>
                <p className="mb-0.5 font-bold">
                  <Link to={`/task/${transaction.task._id}`}>Click Here </Link>
                </p>
              </div>
            )}

            {transaction.transactionType && (
              <div className="flex items-center space-x-2 mx-auto">
                <h4 className="font-normal">Transaction Type:</h4>
                <p className="mb-0.5 font-bold">
                  {transaction.transactionType}
                </p>
              </div>
            )}

            {transaction.accountNumber && (
              <div className="flex items-center space-x-2 mx-auto">
                <h4 className="font-normal">Account Number:</h4>
                <p className="mb-0.5 font-bold">{transaction.accountNumber}</p>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="p-3 m-1 justify-center">
          <h4>There Is No Transactions Right Now</h4>
        </div>
      )}
    </div>
  );
};

export default AccountDetails;
