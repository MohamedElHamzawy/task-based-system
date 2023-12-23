import React from "react";
const Totals = ({ sectionClasses }) => {
  const data = [
    { number: 659180, label: "Total Gain" },
    { number: 293767, label: "Total Cost" },
    { number: 293767, label: "Total Profit" },
    { number: 293767, label: "Profit Percentage" },
  ];

  return (
    <div className={`${sectionClasses} flex-1 flex`}>
      {data.map((el, index) => (
        <div key={el.label} className="flex w-3/12">
          <div className="w-full h-full flex flex-col items-center justify-center">
            <p className="text-lg font-semibold text-gray-400">{el.label}</p>
            <p className="text-2xl font-semibold">{el.number}</p>
          </div>
          {index + 1 !== data.length && (
            <div className="w-[1.5px] bg-gray-300 my-4"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Totals;
