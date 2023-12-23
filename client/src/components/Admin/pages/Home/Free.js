import React from "react";
import Chart from "react-apexcharts";
import "flowbite";

const x = {};

const y = [
  {
    name: "Test",
    data: [1, 2, 1, 2, 3],
  },
];

const FreeFreelancers = ({ sectionClasses }) => {
  return (
    <div className={`${sectionClasses} w-1/5`}>
      <Chart options={x} series={y} height="100%" width="100%" type="area" />
    </div>
  );
};

export default FreeFreelancers;
