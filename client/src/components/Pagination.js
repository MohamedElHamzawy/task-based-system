import React from "react";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

const Pagination = ({
  currentPage,
  totalPages,
  onNextPage,
  onPreviousPage,
  onFirstPage,
  onLastPage,
}) => {
  return (
    <div className="mt-3 flex items-center justify-end space-x-4">
      <button
        className="flex items-center justify-center text-xs w-8 h-8 border bg-gray-200 rounded-md"
        onClick={onFirstPage}
        disabled={currentPage === 1}
      >
        <MdKeyboardDoubleArrowLeft className="text-xl" />
      </button>
      <button
        className="flex items-center justify-center text-xs w-8 h-8 border bg-gray-200 rounded-md"
        onClick={onPreviousPage}
        disabled={currentPage === 1}
      >
        <MdKeyboardArrowLeft className="text-xl" />
      </button>
      <span className="text-gray-600">
        {currentPage} of {totalPages}
      </span>
      <button
        className="flex items-center justify-center text-xs w-8 h-8 border bg-gray-200 rounded-md"
        onClick={onNextPage}
        disabled={currentPage === totalPages}
      >
        <MdKeyboardArrowRight className="text-xl" />
      </button>
      <button
        className="flex items-center justify-center text-xs w-8 h-8 border bg-gray-200 rounded-md"
        onClick={onLastPage}
        disabled={currentPage === totalPages}
      >
        <MdKeyboardDoubleArrowRight className="text-xl" />
      </button>
    </div>
  );
};

export default Pagination;
