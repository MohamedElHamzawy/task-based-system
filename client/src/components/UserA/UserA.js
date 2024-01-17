import React from "react";
import "./UserA.css";
import UserASideBar from "./UserASideBar/UserASideBar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "../Header";

import Tasks from "../UserA/Pages/Tasks/Tasks";
import AddTask from "../UserA/Pages/Tasks/AddTask";
import TaskDetails from "../UserA/Pages/Tasks/TaskDetails";
import Clients from "../UserA/Pages/Clients/Clients";
import AddClient from "../UserA/Pages/Clients/addClient";
import ClientDetails from "../UserA/Pages/Clients/clientDetails";
import Specialities from "../UserA/Pages/Specialities/Specialities";
import AddSpeciality from "../UserA/Pages/Specialities/addSpeciality";
import SpecialityDetails from "../UserA/Pages/Specialities/specialityDetails";
import Settings from "../UserA/Pages/Settings/Settings";
import ChangePass from "./Pages/Settings/ChangePass";
import PendingTasks from "./Pages/Tasks/PendingTasks";
import Notifications from "./Pages/Notifications/Notifications";

const UserA = () => {
  return (
    <>
      <Header />
      <div className="ml-60 bg-[#F4F7FC]">
        <UserASideBar />
        <div className="container pt-16">
          <Routes>
            <Route path="/" element={<PendingTasks />} />
            <Route path="/yourtasks" element={<Tasks />} />
            <Route path="/addtask" element={<AddTask />} />
            <Route path="/task/:id" element={<TaskDetails />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/client/:id" element={<ClientDetails />} />
            <Route path="/addclient" element={<AddClient />} />
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

export default UserA;
