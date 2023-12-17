import React from "react";
import SideBar from "./SideBar/SideBar";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Users from "../Admin/pages/Users/Users";
import Tasks from "../Admin/pages/Tasks/Tasks";
import Specialities from "../Admin/pages/Specialities/Specialities";
import SpecialityDetails from "./pages/Specialities/specialityDetails";
import AddSpeciality from "./pages/Specialities/addSpeciality";
import Clients from "../Admin/pages/Clients/Clients";
import AddUser from "./pages/Users/AddUser";
import UserDetails from "./pages/Users/UserDetails";
import Settings from "./pages/Settings/Settings";
import AddClient from "./pages/Clients/addClient";
import ClientDetails from "./pages/Clients/clientDetails";
import Currency from "./pages/Currency/Currency";
import CurrencyDetails from "./pages/Currency/CurrencyDetails";
import AddCurrency from "./pages/Currency/AddCurrency";
import FreeLancers from "./pages/FreeLancers/FreeLancers";
import FreeLancerDetails from "./pages/FreeLancers/FreeLancerDetails";
import AddFreeLancer from "./pages/FreeLancers/AddFreeLancer";
import Statuses from "./pages/Statuses/Statuses";
import StatusDetails from "./pages/Statuses/StatusDetails";
import AddStatus from "./pages/Statuses/AddStatus";
import Accounts from "./pages/Accounts/Accounts";
import TaskDetails from "./pages/Tasks/TaskDetails";
import AddTask from "./pages/Tasks/AddTask";
import AccountDetails from "./pages/Accounts/AccountDetails";
import ChangePass from "./pages/Settings/ChangePass";
import Transactions from "./pages/Transactions/Transactions";
import Profit from "./pages/Profit/Profit";
import Country from "./pages/Country/Country";
import AddCountry from "./pages/Country/AddCountry";
import Notifications from "./pages/Notifications/Notifications.js";
import Header from "../Header.js";
import Home from "./pages/Home";

const Admin = () => {
  return (
    <>
      <Header />
      <div className="ml-60 bg-[#F4F7FC] border">
        <SideBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/user/:id" element={<UserDetails />} />
          <Route path="/adduser" element={<AddUser />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/addtask" element={<AddTask />} />
          <Route path="/task/:id" element={<TaskDetails />} />
          <Route path="/specialities" element={<Specialities />} />
          <Route path="/speciality/:id" element={<SpecialityDetails />} />
          <Route path="/addspeciality" element={<AddSpeciality />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/client/:id" element={<ClientDetails />} />
          <Route path="/addclient" element={<AddClient />} />
          <Route path="/currency" element={<Currency />} />
          <Route path="/currency/:id" element={<CurrencyDetails />} />
          <Route path="/addcurrency" element={<AddCurrency />} />
          <Route path="/freelancers" element={<FreeLancers />} />
          <Route path="/freelancer/:id" element={<FreeLancerDetails />} />
          <Route path="/addfreelancer" element={<AddFreeLancer />} />
          <Route path="/statuses" element={<Statuses />} />
          <Route path="/status/:id" element={<StatusDetails />} />
          <Route path="/addstatus" element={<AddStatus />} />
          <Route path="/country" element={<Country />} />
          <Route path="/addcountry" element={<AddCountry />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/account/:id" element={<AccountDetails />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/changepass" element={<ChangePass />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/profit" element={<Profit />} />
        </Routes>
      </div>
    </>
  );
};

export default Admin;
