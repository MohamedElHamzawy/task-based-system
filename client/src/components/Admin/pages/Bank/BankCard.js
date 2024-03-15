import React from "react";
import { Link } from "react-router-dom";

const BankCard = ({ owner, type, balance, detailsLink, currency }) => {
  return (
    <div className="bg-white rounded-lg drop-shadow-lg p-6 w-full mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">{owner}</h2>
          <p className="text-gray-500">{type}</p>
        </div>
        <div>
          <p className="text-gray-500">Balance</p>
          <h2 className="text-xl font-bold">
            {balance} {currency}
          </h2>
        </div>
      </div>
      <Link
        to={detailsLink}
        className="text-blue-500 hover:underline mt-4 inline-block"
      >
        View Details
      </Link>
    </div>
  );
};

export default BankCard;
