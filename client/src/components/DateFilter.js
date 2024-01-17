import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";

const DateFilter = ({
  startDate,
  onChange,
  endDate,
  datePickerOpen,
  dateHandler,
}) => {
  const [selected, setSelected] = useState(null);
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center">
        {["day", "week", "month"].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() =>
              selected !== item ? setSelected(item) : setSelected(null)
            }
            className={`py-1.5 px-2.5 flex justify-center border rounded-sm text-sm font-medium capitalize ${
              selected === item ? "text-white bg-primary" : "bg-white"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      <ReactDatePicker
        className="relative rounded border border-gray-300 cursor-pointer text-gray-400 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        selected={endDate}
        selectsEnd={endDate}
        onChange={onChange}
        onCalendarClose={dateHandler}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        showMonthDropdown
        showYearDropdown
        inline={datePickerOpen}
        dateFormat="MMM, yyyy"
        showIcon
        toggleCalendarOnIconClick
        calendarIconClassname="mr-4 cursor-pointer absolute z-10 top-0.5"
      />
    </div>
  );
};

export default DateFilter;
