import React, { useState } from "react";
import WaitingOffer from "./Progress/WaitingOffer";
import OfferSubmitted from "./Progress/OfferSubmitted";
import Approved from "./Progress/Approved";
import Assigned from "./Progress/Assigned";
import Ongoing from "./Progress/Ongoing";
import Done from "./Progress/Done";
import WorkingOn from "./Progress/WorkingOn";

const Status = ({ status, task }) => {
  const [statusState, setStatusState] = useState(status);
  const renderStatus = () => {
    switch (statusState) {
      case "waiting offer":
        return <WaitingOffer taskId={task._id} setStatus={setStatusState} />;
      case "offer submitted":
        return (
          <OfferSubmitted
            taskId={task._id}
            cost={task.cost}
            setStatus={setStatusState}
          />
        );
      case "approved":
        return <Approved taskId={task._id} setStatus={setStatusState} />;
      case "rejected":
        return (
          <WaitingOffer taskId={task._id} rejected setStatus={setStatusState} />
        );
      case "assigned":
        return (
          <Assigned
            taskId={task._id}
            freelancer={task.freelancer?.freelancername}
            setStatus={setStatusState}
          />
        );
      case "working on":
        return <WorkingOn taskId={task._id} setStatus={setStatusState} />;
      case "on going":
        return (
          <Ongoing
            taskId={task._id}
            freelancer={task.freelancer?.freelancername}
            setStatus={setStatusState}
          />
        );
      case "done":
        return (
          <Done
            file={task.file}
            taskId={task._id}
            setStatus={setStatusState}
            freelancer={task.freelancer?.freelancername}
          />
        );
      default:
        return <p>Invalid status</p>;
    }
  };

  return (
    <div className="w-full max-w-5xl 2xl:max-w-6xl mx-auto bg-white shadow rounded p-2">
      {/* <h1 className="text-2xl text-gray-600 font-semibold mb-0">Status</h1>
      <p className="mb-2 p-0 text-gray-400 font-semibold text-sm capitalize">
        {statusState.split("-").join(" ")}
      </p> */}
      {renderStatus()}
    </div>
  );
};

export default Status;
