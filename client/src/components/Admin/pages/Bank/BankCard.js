import React, { useState } from "react";
import { NumericFormat } from "react-number-format";
import { FaInfoCircle } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { MdOutlineDelete } from "react-icons/md";
import axios from "../../../../axios";

import { Link, useNavigate } from "react-router-dom";
import Modal from "../../../Modal";

const BankCard = ({
  id,
  owner,
  balance,
  detailsLink,
  currency,
  edit,
  deleteButton,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const navigate = useNavigate();
  const deleteAccount = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/bank/${id}`);
      setTimeout(() => {
        setMessage({
          type: "success",
          message: "Account deleted successfully",
        });
      }, 2000);
    } catch (error) {
      if (error.response) {
        setMessage({ type: "error", message: error.response.data.err });
      } else {
        setMessage({ type: "error", message: error.message });
      }
    } finally {
      setIsLoading(false);
      navigate("/bank");
    }
  };

  return (
    <>
      {showCancelModal && (
        <Modal
          isLoading={isLoading}
          handleConfirm={deleteAccount}
          handleClose={() => setShowCancelModal(false)}
          showConfirmButton
          showCancelButton
          title="Delete Account"
          text={`Are you sure you wan't to delete account: ${owner} ?`}
        />
      )}
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
            {deleteButton && (
              <button
                onClick={() => setShowCancelModal(true)}
                type="button"
                className="no-underline text-white bg-red-800 inline-block p-2 rounded active:scale-95"
              >
                <MdOutlineDelete className="text-xl" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BankCard;
