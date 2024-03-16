import React from "react";
import { NumericFormat } from "react-number-format";
import { FaInfoCircle } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { MdOutlineDelete } from "react-icons/md";

import { Link } from "react-router-dom";

const BankCard = ({ owner, balance, detailsLink, currency, edit }) => {
  return (
    <div className="text-base font-bold p-4 bg-gray-700 text-white rounded-lg space-y-2">
      <h2 className="text-2xl font-bold m-0 p-0">{owner}</h2>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-base text-gray-400 font-semibold p-0 m-0">
            Balance amount
          </p>
          <NumericFormat
            className="text-lg font-bold"
            displayType={"text"}
            value={balance}
            suffix={` ${currency}`}
            thousandSeparator
          />
        </div>
        <div className="flex items-center space-x-2">
          <Link
            to={detailsLink}
            className="no-underline text-white bg-gray-400 inline-block p-2 rounded active:scale-95"
          >
            {edit ? (
              <MdModeEdit className="text-xl" />
            ) : (
              <FaInfoCircle className="text-xl" />
            )}
          </Link>
          <button
            type="button"
            className="no-underline text-white bg-red-800 inline-block p-2 rounded active:scale-95"
          >
            {/* trash icon */}

            <MdOutlineDelete className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankCard;
