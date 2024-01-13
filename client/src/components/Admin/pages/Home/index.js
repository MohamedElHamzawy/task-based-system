import React, { useState } from "react";
import Tasks from "./Tasks";
import Totals from "./Totals";
import Country from "./Country";
import TopFreelancers from "./Top.js";
import FreeFreelancers from "./Free.js";
import Breakdown from "./Breakdown.js";
import Clients from "./Clients.js";
import Users from "./Users.js";
import ReactDatePicker from "react-datepicker";

const Home = ({}) => {
  const sectionClasses = "bg-white rounded drop-shadow";
  const [datePickerOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-medium mt-4">Overview</h1>
        <div className="mt-2.5">
          <ReactDatePicker
            className="relative rounded border border-gray-300 cursor-pointer text-gray-400 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            selected={startDate}
            onChange={onChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            showMonthDropdown
            inline={datePickerOpen}
            dateFormat="MMM, yyyy"
            showIcon
            toggleCalendarOnIconClick
            calendarIconClassname="mr-4 cursor-pointer absolute z-10 top-0.5"
          />
        </div>
      </div>
      <div className="flex space-x-4 justify-between">
        <Tasks sectionClasses={sectionClasses} />
        <Totals sectionClasses={sectionClasses} />
      </div>
      <div className="flex space-x-4 justify-between">
        <Country sectionClasses={sectionClasses} />
        <TopFreelancers sectionClasses={sectionClasses} />
        <FreeFreelancers sectionClasses={sectionClasses} />
      </div>
      <div className="flex space-x-4 justify-between">
        <Users sectionClasses={sectionClasses} />
        <Clients sectionClasses={sectionClasses} />
        <Breakdown sectionClasses={sectionClasses} />
      </div>
    </div>
  );
};

export default Home;
