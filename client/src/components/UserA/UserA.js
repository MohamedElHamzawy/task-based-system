import React from 'react'
import './UserA.css'
import UserASideBar  from './UserASideBar/UserASideBar'

const UserA = () => {
  return (
    <div  className='Admin w-100'>
      <UserASideBar className='sidebar'/> 
    
     <div className='Admin-body '>
       <h1>UserA DashBoard</h1> 
     </div>
 </div>  
  )
}

export default UserA
