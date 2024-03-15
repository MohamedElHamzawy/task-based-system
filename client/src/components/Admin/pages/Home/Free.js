import React from "react";
import Chart from "react-apexcharts";

const x = {};

const y = [
  {
    name: "Test",
    data: [1, 2, 1, 2, 3],
  },
];

const FreeFreelancers = ({ sectionClasses }) => {
  return (
    <div className={`${sectionClasses} w-1/5 font-medium pt-4 px-4`}>
      <p className="text-2xl">Freelancers</p>
      <Chart options={x} series={y} height="100%" width="100%" type="area" />
    </div>
  );
};

export default FreeFreelancers;
