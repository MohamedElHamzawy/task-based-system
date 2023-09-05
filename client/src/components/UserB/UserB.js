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
          <Route path="/settings" element={<Settings />} />
          <Route path="/changepass" element={<ChangePass />} />
        </Routes>
      </div>
    </div>
  )
}

export default UserB

