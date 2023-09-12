import React from 'react'
import './UserB.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";

import UserBSideBar from './UserBSideBar/UserBSideBar'
import TaskDetails from './Pages/Tasks/TaskDetails'
import FreeLancers from './Pages/FreeLancers/FreeLancers'
import FreeLancerDetails from './Pages/FreeLancers/FreeLancerDetails'
import AddFreeLancer from './Pages/FreeLancers/AddFreeLancer'
import Settings from './Pages/Settings/Settings'
import PendingTasks from './Pages/Tasks/PendingTasks';
import YourTasks from './Pages/Tasks/YourTasks';
import ChangePass from './Pages/Settings/ChangePass';

import Specialities from './Pages/Specialities/Specialities';
import SpecialityDetails from './Pages/Specialities/specialityDetails';
import AddSpeciality from './Pages/Specialities/addSpeciality';
import Currency from './Pages/Currency/Currency';
import CurrencyDetails from './Pages/Currency/CurrencyDetails';
import AddCurrency from './Pages/Currency/AddCurrency';

const UserB = () => {
  return (
    <div className='Admin w-100'>
      <UserBSideBar className='sidebar' />

      <div className='Admin-body '>
        <Routes >     
          <Route path="/task/:id" element={<TaskDetails />} />      
          <Route path="/yourtasks" element={<YourTasks />} />      
          <Route path="/" element={<PendingTasks />} />      
          <Route path="/freelancers" element={<FreeLancers />} />
          <Route path="/freelancer/:id" element={<FreeLancerDetails />} />
          <Route path="/addfreelancer" element={<AddFreeLancer />} />

          <Route path="/specialities" element={<Specialities />} />
          <Route path="/speciality/:id" element={<SpecialityDetails />} />
          <Route path="/addspeciality" element={<AddSpeciality />} />
          <Route path="/currency" element={<Currency />} />
          <Route path="/currency/:id" element={<CurrencyDetails />} />
          <Route path="/addcurrency" element={<AddCurrency />} />

          <Route path="/settings" element={<Settings />} />
          <Route path="/changepass" element={<ChangePass />} />
        </Routes>
      </div>
    </div>
  )
}

export default UserB

