import React from "react";
import { useNavigate } from "react-router";
import Pagination from "./Pagination";

function getRowClass(statusname) {
  switch (statusname) {
    case "pending":
      return "bg-yellow-100";
    case "waiting offer":
      return "bg-blue-100";
    case "approved":
      return "bg-sky-100";
    case "working on":
      return "bg-purple-100";
    case "done":
      return "bg-green-100";
    case "delivered":
      return "bg-gray-100";
    case "rejected":
      return "bg-red-100";
    case "not available":
      return "bg-slate-100";
    case "on going":
      return "bg-teal-100";
    case "offer submitted":
      return "bg-orange-100";
    case "edit":
      return "bg-indigo-100";
    case "cancel":
      return "bg-pink-100";
    default:
      return "";
  }
}

function getStatusClass(statusname) {
  switch (statusname) {
    case "pending":
      return "text-yellow-400";
    case "waiting offer":
      return "text-blue-400";
    case "approved":
      return "text-sky-400";
    case "working on":
      return "text-purple-400";
    case "done":
      return "text-green-400";
    case "delivered":
      return "text-gray-400";
    case "rejected":
      return "text-red-400";
    case "not available":
      return "text-slate-400";
    case "on going":
      return "text-teal-400";
    case "offer submitted":
      return "text-orange-400";
    case "edit":
      return "text-indigo-400";
    case "cancel":
      return "text-pink-400";
    default:
      return "";
  }
}

const TasksTable = ({
  tasks,
  pagination = false,
  page,
  totalPages,
  onFirstPage,
  onLastPage,
  onNextPage,
  onPreviousPage,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <table className="table-auto w-full rounded-lg overflow-hidden text-center drop-shadow">
        <thead>
          <tr className="drop-shadow bg-white text-cyan-600">
            <th className="px-4 py-3 font-medium text-sm">ID</th>
            <th className="px-4 py-3 font-medium text-sm w-1/5">Title</th>
            <th className="px-4 py-3 font-medium text-sm">Client</th>
            <th className="px-4 py-3 font-medium text-sm">Freelancer</th>
            <th className="px-4 py-3 font-medium text-sm">Profit</th>
            <th className="px-4 py-3 font-medium text-sm">Deadline</th>
            <th className="px-4 py-3 font-medium text-sm">Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr
              key={task._id}
              className={`bg-white ${
                index !== 0 && "border-t-4 border-[#F4F7FC]"
              }`}
            >
              <td
                className="cursor-pointer hover:underline px-4 py-3"
                onClick={() => {
                  navigate(`/task/${task._id}`);
                }}
              >
                {task.serialNumber}
              </td>
              <td className="px-4 py-3">{task.title}</td>
              <td className="px-4 py-3">{task.client?.clientname}</td>
              <td className="px-4 py-3">
                {task.freelancer ? task.freelancer.freelancername : "-"}
              </td>
              <td className="px-4 py-3">
                {task.profit_amount || 0}{" "}
                {task.task_currency && task.task_currency.currencyname}
              </td>
              <td className="px-4 py-3">
                {new Date(task.deadline).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <div
                  className={`w-full rounded-md px-2 py-1 text-xs font-bold ${getRowClass(
                    task.taskStatus.statusname
                  )} ${getStatusClass(task.taskStatus.statusname)}`}
                >
                  {task.taskStatus.statusname}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {pagination && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onNextPage={onNextPage}
          onPreviousPage={onPreviousPage}
          onFirstPage={onFirstPage}
          onLastPage={onLastPage}
        />
      )}
    </>
  );
};

export default TasksTable;
