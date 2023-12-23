import React from "react";
const Totals = ({ sectionClasses }) => {
  const data = {
    tasksCount: 838,
    completedCount: 451,
  };
  const tasksCompletion = (
    (data.completedCount / data.tasksCount) *
    100
  ).toFixed();

  return (
    <div className={`${sectionClasses} flex flex-col justify-center w-1/3 p-4`}>
      <div className="flex items-center justify-between">
        <div className="text-center">
          <h2 className="text-lg text-gray-400 font-semibold mb-4">
            Tasks Count
          </h2>
          <h2 className="text-2xl font-medium">{data.tasksCount}</h2>
        </div>
        <div className="text-center">
          <h2 className="text-lg text-gray-400 font-semibold mb-4">
            Completed Count
          </h2>
          <h2 className="text-2xl font-medium">{data.completedCount}</h2>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-base text-sky-800 font-semibold">
          Task Completion - {tasksCompletion}%
        </h2>
        <div className="w-2/5 bg-gray-300 rounded-full h-1.5">
          <div
            className="bg-green-400 h-1.5 rounded-full"
            style={{ width: `${tasksCompletion}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Totals;
