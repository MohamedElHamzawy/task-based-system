import React from 'react'
import './Admin.css'
import SideBar  from './SideBar/SideBar'
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Users from '../Admin/pages/Users/Users' 
import Tasks from '../Admin/pages/Tasks/Tasks' 
import Specialities from '../Admin/pages/Specialities/Specialities' 
import Clients from '../Admin/pages/Clients/Clients' 
import AddUser from './pages/Users/AddUser';
import UserDetails from './pages/Users/UserDetails';
import Settings from './pages/Settings/Settings';

const Admin = () => {
  return (
    <div  className='Admin w-100'>
       <SideBar className='sidebar'/> 
       
        <div className='Admin-body '>
          <Routes >
            <Route path="/" element={<Users/>} className='' />
            <Route path="/user/:id" element={<UserDetails/>} className='' />
            <Route path="/adduser" element={<AddUser/>} className='' />
            <Route path="/tasks" element={<Tasks/>} />
            <Route path="/specialities" element={<Specialities/>} />
            <Route path="/clients" element={<Clients/>} />
            <Route path="/settings" element={<Settings/>} />

          </Routes> 
        </div>
      

    </div>  
  )
}

export default Admin
