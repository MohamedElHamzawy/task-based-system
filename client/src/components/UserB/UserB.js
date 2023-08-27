import React from 'react'
import './UserB.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";

import UserBSideBar from './UserBSideBar/UserBSideBar'
import Tasks from './Pages/Tasks/Tasks'
import AddTask from './Pages/Tasks/AddTask'
import TaskDetails from './Pages/Tasks/TaskDetails'
import FreeLancers from './Pages/FreeLancers/FreeLancers'
import FreeLancerDetails from './Pages/FreeLancers/FreeLancerDetails'
import AddFreeLancer from './Pages/FreeLancers/AddFreeLancer'
import Settings from './Pages/Settings/Settings'

const UserB = () => {
  return (
    <div className='Admin w-100'>
      <UserBSideBar className='sidebar' />

      <div className='Admin-body '>
        <Routes >     
          <Route path="/" element={<Tasks />} />
          <Route path="/addtask" element={<AddTask />} />
          <Route path="/task/:id" element={<TaskDetails />} />      
          <Route path="/freelancers" element={<FreeLancers />} />
          <Route path="/freelancer/:id" element={<FreeLancerDetails />} />
          <Route path="/addfreelancer" element={<AddFreeLancer />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  )
}

export default UserB

