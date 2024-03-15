import React, { useEffect, useState } from "react";
import BankCard from "./BankCard";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import axios from "../../../../axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";

const Bank = ({}) => {
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);

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
          console.log(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-[calc(100vh-65px)] p-4 flex flex-col space-y-2">
      {message && (
        <ErrorModal message={message} onClear={() => setMessage(null)} />
      )}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Bank Accounts</h1>
        <Link
          to="/add-bank-account"
          className="no-underline flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <FaPlus className="w-5 h-5" />
          <span>Add Bank Account</span>
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {isLoading ? (
          <LoadingSpinner asOverlay />
        ) : accounts.length === 0 ? (
          <div>No Accounts</div>
        ) : (
          accounts.map((account) => (
            <BankCard
              key={account._id}
              owner={account.title}
              balance={account.balance}
              currency={account.currency.currencyname}
              detailsLink={`/bank/${account._id}`}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Bank;
