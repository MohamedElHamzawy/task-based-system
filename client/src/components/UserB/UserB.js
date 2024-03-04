import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import UserBSideBar from "./UserBSideBar/UserBSideBar";
import TaskDetails from "./Pages/Tasks/TaskDetails";
import FreeLancers from "./Pages/FreeLancers/FreeLancers";
import FreeLancerDetails from "./Pages/FreeLancers/FreeLancerDetails";
import AddFreeLancer from "./Pages/FreeLancers/AddFreeLancer";
import Settings from "./Pages/Settings/Settings";
import PendingTasks from "./Pages/Tasks/PendingTasks";
import YourTasks from "./Pages/Tasks/YourTasks";
import ChangePass from "./Pages/Settings/ChangePass";

import Specialities from "./Pages/Specialities/Specialities";
import SpecialityDetails from "./Pages/Specialities/specialityDetails";
import AddSpeciality from "./Pages/Specialities/addSpeciality";
import Notifications from "./Pages/Notifications/Notifications";
import Header from "../Header";

const UserB = () => {
  return (
    <>
      <Header />
      <div className="ml-60 bg-[#F4F7FC]">
        <UserBSideBar />
        <div className="container pt-16">
          <Routes>
            <Route path="/task/:id" element={<TaskDetails />} />
            <Route path="/yourtasks" element={<YourTasks />} />
            <Route path="/" element={<PendingTasks />} />
            <Route path="/freelancers" element={<FreeLancers />} />
            <Route path="/freelancer/:id" element={<FreeLancerDetails />} />
            <Route path="/addfreelancer" element={<AddFreeLancer />} />
            <Route path="/specialities" element={<Specialities />} />
            <Route path="/speciality/:id" element={<SpecialityDetails />} />
            <Route path="/addspeciality" element={<AddSpeciality />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/changepass" element={<ChangePass />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default UserB;
