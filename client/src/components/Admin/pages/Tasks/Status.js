import React from "react";
import WaitingOffer from "./Progress/WaitingOffer";
import OfferSubmitted from "./Progress/OfferSubmitted";
import Approved from "./Progress/Approved";
import Assigned from "./Progress/Assigned";
import Ongoing from "./Progress/Ongoing";
import Done from "./Progress/Done";
import WorkingOn from "./Progress/WorkingOn";

const Status = ({ status }) => {
  const renderStatus = () => {
    switch (status) {
      case "waiting offer":
        return <WaitingOffer />;
      case "offer submitted":
        return <OfferSubmitted />;
      case "approved":
        return <Approved />;
      case "rejected":
        return <WaitingOffer rejected />;
      case "assigned":
        return <Assigned />;
      case "working on":
        return <WorkingOn />;
      case "ongoing":
        return <Ongoing />;
      case "done":
        return <Done />;
      default:
        return <p>Invalid status</p>;
    }
  };

  return (
    <div className="w-full max-w-5xl 2xl:max-w-6xl mx-auto bg-white shadow rounded p-2">
      <h1 className="font-semibold mb-0">Status</h1>
      <p className="mb-2 p-0 text-gray-400 font-semibold text-sm capitalize">
        {status.split("-").join(" ")}
      </p>
      {renderStatus()}
    </div>
  );
};

export default Status;
