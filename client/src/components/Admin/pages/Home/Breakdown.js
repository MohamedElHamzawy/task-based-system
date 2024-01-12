import React, { useState } from "react";
import ApexCharts from "react-apexcharts";

const Breakdown = ({ sectionClasses }) => {
  const data = [
    { name: "Programming", value: 50 },
    { name: "Medical", value: 25 },
    { name: "Office", value: 15 },
    { name: "Business Management", value: 10 },
  ];

  const options = {
    labels: data.map((item) => item.name),
    series: data.map((item) => item.value),
    chart: {
      type: "donut",
    },
    legend: {
      show: true,
      position: "bottom",
    },
    colors: ["#1abc9c", "#f1c40f", "#e74c3c", "#2980b9"],
  };

  return (
    <div className={`${sectionClasses} w-1/3 font-medium pt-4 px-4`}>
      <p className="text-2xl">Breakdown</p>
      <ApexCharts
        options={options}
        series={options.series}
        type="donut"
        width="350"
      />
    </div>
  );
};

export default Breakdown;
