import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "../../../../axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import { NumericFormat } from "react-number-format";
import BankCard from "./BankCard";
import { Link } from "react-router-dom";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";
import { ImUndo } from "react-icons/im";

const BankDetails = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const accountResponse = await axios.get(`/bank/${id}`);
        const transactionsResponse = await axios.get(`/bankTransaction/${id}`);
        setTransactions(transactionsResponse.data);
        setAccount(accountResponse.data);
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

  const revertTransaction = async (id) => {
    try {
      setIsLoading(true);
      console.log(id);
      await axios.delete(`/bankTransaction/${id}`);
      setTransactions((prev) =>
        prev.filter((transaction) => transaction._id !== id)
      );
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
      <h2 className="text-center text-2xl font-bold lg:text-3xl">
        Bank Account Details
      </h2>
      {isLoading ? (
        <LoadingSpinner asOverlay />
      ) : account ? (
        <div className="space-y-2 max-w-3xl mx-auto w-full">
          <BankCard
            id={account._id}
            owner={account.title}
            balance={account.balance}
            currency={account.currency.currencyname}
            detailsLink={`/edit-bank/${account._id}`}
            edit
            deleteButton
          />

          <div className="flex items-center justify-end space-x-2">
            <Link
              to="/add-transaction"
              className="no-underline text-white bg-gray-400 inline-block p-2 rounded active:scale-95"
            >
              <span>Add Transaction</span>
            </Link>
            <Link
              to="/add-spending"
              className="no-underline text-white bg-gray-400 inline-block p-2 rounded active:scale-95"
            >
              <span>Add Spending</span>
            </Link>
          </div>

          <table className="table-auto w-full rounded-lg overflow-hidden text-center drop-shadow">
            <thead>
              <tr className="drop-shadow bg-white text-gray-700">
                <th className="px-4 py-3 font-medium text-sm">From</th>
                <th className="px-4 py-3 font-medium text-sm">To</th>
                <th className="px-4 py-3 font-medium text-sm">Amount</th>
                <th className="px-4 py-3 font-medium text-sm">Exchange Rate</th>
                <th className="px-4 py-3 font-medium text-sm">Date</th>
                <th className="px-4 py-3 font-medium text-sm">Revert</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <tr key={index}>
                    <td className="p-2 bg-white">{transaction.from.title}</td>
                    <td className="p-2 bg-white">{transaction.to.title}</td>
                    <td className="p-2 bg-white">
                      <NumericFormat
                        displayType={"text"}
                        value={transaction.amount}
                        suffix={` ${account.currency.currencyname}`}
                        thousandSeparator
                      />
                    </td>
                    <td className="p-2 bg-white">{transaction.exchangeRate}</td>
                    <td className="p-2 bg-white">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-2 bg-white">
                      <button
                        onClick={() => revertTransaction(transaction._id)}
                        className="text-white bg-red-800 p-2 rounded active:scale-95"
                      >
                        <ImUndo className="" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-2 bg-white">
                    No Transactions
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div>No Account</div>
      )}
    </div>
  );
};

export default BankDetails;
