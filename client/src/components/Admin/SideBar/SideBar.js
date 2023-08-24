import React, { useState } from 'react';
import './Sidebar.css';
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import { FaUsers } from 'react-icons/fa';
import { FaTasks } from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';
import { BiSolidCategoryAlt } from 'react-icons/bi';
import { FaHospitalUser } from 'react-icons/fa';
import { AiFillSetting } from 'react-icons/ai';
import { BsCurrencyExchange } from 'react-icons/bs';
import { SiFreelancer } from 'react-icons/si';
import { TbStatusChange } from 'react-icons/tb';
import { MdCalculate } from 'react-icons/md';


import RemoveCookie from '../../../hooks/removeCookie';

import SideNav, {
  Toggle,
  Nav,
  NavItem,
  NavIcon,
  NavText,
} from "@trendmicro/react-sidenav";

function logout() {
  localStorage.removeItem("AdminData");
  RemoveCookie("AdminToken");
  window.location.href = '/';
}

class SideBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isVisible: true
    };
  }

  render() {
    return (
      <SideNav defaultExpanded={!this.state.isVisible} className='sidebar' >
        <SideNav.Toggle
          onClick={() => {
            this.setState({ isVisible: !this.state.isVisible });
          }}
        />
        <SideNav.Nav >

          <NavItem eventKey="users" className=' my-3' onClick={()=>{window.location.href = '/'}}>
            <NavIcon >
                <FaUsers className='fs-4'/>
            </NavIcon>
             <NavText >
               <p className='fs-3'>Users </p> 
            </NavText>           
          </NavItem>

          <NavItem eventKey="tasks" className=' my-3' onClick={()=>{window.location.href = '/tasks'}}>
            <NavIcon>
                <FaTasks className='fs-4' />
            </NavIcon>
             <NavText>
             <p className="fs-3 "> Tasks</p>
            </NavText>           
          </NavItem>

          <NavItem eventKey="tasks" className=' my-3' onClick={()=>{window.location.href = '/accounts'}}>
            <NavIcon>
                <MdCalculate className='fs-4' />
            </NavIcon>
             <NavText>
             <p className="fs-3 "> Accounts</p>
            </NavText>           
          </NavItem>

          <NavItem eventKey="tasks" className=' my-3' onClick={()=>{window.location.href = '/freelancers'}}>
            <NavIcon>
                <SiFreelancer className='fs-4' />
            </NavIcon>
             <NavText>
             <p className="fs-3 "> Freelancers</p>
            </NavText>           
          </NavItem>

          <NavItem eventKey="tasks" className=' my-3' onClick={()=>{window.location.href = '/clients'}}>
            <NavIcon>
                <FaHospitalUser className='fs-4' />
            </NavIcon>
             <NavText>
             <p className="fs-3 "> Clients</p>
            </NavText>           
          </NavItem>

          <NavItem eventKey="tasks" className='my-3' onClick={()=>{window.location.href = '/specialities'}}>
            <NavIcon>
                <BiSolidCategoryAlt className='fs-4' />
            </NavIcon>
             <NavText>
             <p className="fs-3 "> Specialities</p>
            </NavText>           
          </NavItem>

          <NavItem eventKey="tasks" className=' my-3' onClick={()=>{window.location.href = '/currency'}}>
            <NavIcon>
                <BsCurrencyExchange className='fs-4' />
            </NavIcon>
             <NavText>
             <p className="fs-3 "> Currency</p>
            </NavText>           
          </NavItem>

          <NavItem eventKey="tasks" className=' my-3' onClick={()=>{window.location.href = '/statuses'}}>
            <NavIcon>
                <TbStatusChange className='fs-4' />
            </NavIcon>
             <NavText>
             <p className="fs-3 "> Status</p>
            </NavText>           
          </NavItem>

          <NavItem eventKey="tasks" className=' my-3' onClick={()=>{window.location.href = '/settings'}}>
            <NavIcon>
                <AiFillSetting className='fs-4' />
            </NavIcon>
             <NavText>
             <p className="fs-3 "> Settings</p>
            </NavText>           
          </NavItem>

          <NavItem eventKey="home" className='log-out mt-5' onClick={logout}>
            <NavIcon>
                <BiLogOut className='fs-4'/>
            </NavIcon>
             <NavText>
              <p className="fs-4">
                LOG OUT
              </p>
            </NavText>           
          </NavItem>


        </SideNav.Nav>
      </SideNav>
    );
  }
}

export default SideBar;
