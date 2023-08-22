import React from 'react'
import './UserB.css'
import UserBSideBar  from './UserBSideBar/UserBSideBar'

const UserB = () => {
  return (
    <div  className='Admin w-100'>
      <UserBSideBar className='sidebar'/> 
    
     <div className='Admin-body '>
      <h1>UserB DashBoard</h1> 
     </div>
 </div>  
  )
}

export default UserB

