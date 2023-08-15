import React from 'react'
import './Admin.css'
import SideBar  from './SideBar/SideBar'
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Users from '../Admin/pages/Users/Users' 
import Tasks from '../Admin/pages/Tasks/Tasks' 

const Admin = () => {
  return (
    <div  className='Admin w-100'>
       <SideBar className='sidebar'/> 
       
        <div className='Admin-body  p-3'>
          <Routes >
            <Route path="/" element={<Users/>} className='' />
            <Route path="/tasks" element={<Tasks/>} />
          </Routes> 
        </div>
      

    </div>  
  )
}

export default Admin
