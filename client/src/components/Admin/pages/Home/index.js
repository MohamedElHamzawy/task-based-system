import React from "react";
import Tasks from "./Tasks";
import Totals from "./Totals";
import Country from "./Country";
import TopFreelancers from "./Top.js";
import FreeFreelancers from "./Free.js";
import Breakdown from "./Breakdown.js";
import Clients from "./Clients.js";
import Users from "./Users.js";

const Home = ({}) => {
  const sectionClasses = "bg-white rounded drop-shadow";
  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-4xl font-medium mt-4">Overview</h1>
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
