import React from "react";
import { MdOutlineTune } from "react-icons/md";

const Filter = ({ children, applyFunction, filterOpen, setFilterOpen }) => (
  <div
    className={`transition-all flex flex-col items-center fixed left-64 top-16 ${
      filterOpen ? "w-44" : "w-14"
    } h-full -ml-2.5 bg-white drop-shadow px-2`}
  >
    <div className={`flex justify-between items-center w-full mt-4`}>
      {filterOpen && <h1 className="text-xl">Filters</h1>}
      <MdOutlineTune
        onClick={() => setFilterOpen((prev) => !prev)}
        className={`${
          !filterOpen && "mx-auto"
        } cursor-pointer hover:bg-gray-200 rounded-full -mt-1 p-1`}
        size={30}
      />
    </div>
    {filterOpen && (
      <div>
        <div className="mt-2 mb-4 flex flex-col">{children}</div>
        {applyFunction && (
          <button
            type="button"
            onClick={() => applyFunction()}
            className="w-full px-4 py-1 text-sm text-black font-semibold border border-gray-400 hover:text-white hover:bg-gray-100 hover:border-transparent focus:outline-none focus:ring-1 focus:ring-black"
          >
            APPLY
          </button>
        )}
      </div>
    )}
  </div>
);

export default Filter;
