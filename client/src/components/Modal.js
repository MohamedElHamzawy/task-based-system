import React from "react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const Modal = ({
  title,
  text,
  showConfirmButton,
  showCancelButton,
  handleClose,
  handleConfirm,
  isLoading,
}) => {
  return (
    <div
      style={{ zIndex: 9999 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-25"
    >
      <div className="bg-white rounded-lg p-8 max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold m-0 p-0">{title}</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={handleClose}
          >
            x
          </button>
        </div>
        <div className="mb-4">
          <p>{text}</p>
        </div>
        {showConfirmButton && (
          <button
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 active:scale-95"
            onClick={handleConfirm}
          >
            Confirm
          </button>
        )}
        {showCancelButton && (
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded active:scale-95"
            onClick={handleClose}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal;
