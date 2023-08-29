import React from 'react'
import './Admin.css'
import SideBar from './SideBar/SideBar'
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Users from '../Admin/pages/Users/Users'
import Tasks from '../Admin/pages/Tasks/Tasks'
import Specialities from '../Admin/pages/Specialities/Specialities'
import SpecialityDetails from './pages/Specialities/specialityDetails'
import AddSpeciality from './pages/Specialities/addSpeciality'
import Clients from '../Admin/pages/Clients/Clients'
import AddUser from './pages/Users/AddUser';
import UserDetails from './pages/Users/UserDetails';
import Settings from './pages/Settings/Settings';
import AddClient from './pages/Clients/addClient';
import ClientDetails from './pages/Clients/clientDetails';
import Currency from './pages/Currency/Currency';
import CurrencyDetails from './pages/Currency/CurrencyDetails';
import AddCurrency from './pages/Currency/AddCurrency';
import FreeLancers from './pages/FreeLancers/FreeLancers';
import FreeLancerDetails from './pages/FreeLancers/FreeLancerDetails';
import AddFreeLancer from './pages/FreeLancers/AddFreeLancer';
import Statuses from './pages/Statuses/Statuses';
import StatusDetails from './pages/Statuses/StatusDetails';
import AddStatus from './pages/Statuses/AddStatus';
import Accounts from './pages/Accounts/Accounts';
import TaskDetails from './pages/Tasks/TaskDetails';
import AddTask from './pages/Tasks/AddTask';
import AccountDetails from './pages/Accounts/AccountDetails';

const Admin = () => {
  return (
    <div className='Admin w-100'>
      <SideBar className='sidebar' />

      <div className='Admin-body '>
        <Routes >
          <Route path="/" element={<Users />} />
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
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/account/:id" element={<AccountDetails />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>


    </div>
  )
}

export default Admin
