import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "../../../../axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import { NumericFormat } from "react-number-format";
import BankCard from "./BankCard";

const transactions = [
  {
    _id: "1",
    from: "John Doe",
    to: "Jane Doe",
    amount: 1000,
    exchangeRate: 1.5,
    date: "2021-09-01",
  },
];

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
        // setTransactions(transactionsResponse.data);
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
  return (
    <div className="flex flex-col w-full p-3 min-h-[calc(100vh-65px)]">
      <h2 className="text-center text-2xl font-bold lg:text-3xl">
        Bank Account Details
      </h2>
      {isLoading ? (
        <LoadingSpinner asOverlay />
      ) : account ? (
        <div className="space-y-2 max-w-3xl mx-auto w-full">
          <BankCard
            owner={account.title}
            balance={account.balance}
            currency={account.currency.currencyname}
            detailsLink={`/edit-bank/${account._id}`}
            edit
          />
          {/* Table of transactions [From, To, Amount, Exchange Rate, Date] */}

          <table className="table-auto w-full rounded-lg overflow-hidden text-center drop-shadow">
            <thead>
              <tr className="drop-shadow bg-white text-gray-700">
                <th className="px-4 py-3 font-medium text-sm">From</th>
                <th className="px-4 py-3 font-medium text-sm">To</th>
                <th className="px-4 py-3 font-medium text-sm">Amount</th>
                <th className="px-4 py-3 font-medium text-sm">Exchange Rate</th>
                <th className="px-4 py-3 font-medium text-sm">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td className="p-2 bg-white">{transaction.from}</td>
                    <td className="p-2 bg-white">{transaction.to}</td>
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
                      {new Date(transaction.date).toLocaleDateString()}
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
