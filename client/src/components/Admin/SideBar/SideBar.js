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
import { AiOutlineTransaction } from 'react-icons/ai';
import { RiWaterPercentFill } from 'react-icons/ri';
import { FaFlagUsa } from 'react-icons/fa';

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

          <NavItem eventKey="users" className='nav-link' onClick={()=>{window.location.href = '/'}}>
            <NavIcon >
                <FaUsers className='f5'/>
            </NavIcon>
             <NavText >
               <p className='f4'>Users </p> 
            </NavText>           
          </NavItem>

          <NavItem eventKey="tasks" className='nav-link' onClick={()=>{window.location.href = '/tasks'}}>
            <NavIcon>
                <FaTasks className='f5' />
            </NavIcon>
             <NavText>
             <p className="f4"> Tasks</p>
            </NavText>           
          </NavItem>

          <NavItem eventKey="tasks" className='nav-link' onClick={()=>{window.location.href = '/accounts'}}>
            <NavIcon>
                <MdCalculate className='f5' />
            </NavIcon>
             <NavText>
             <p className="f4"> Accounts</p>
            </NavText>           
          </NavItem>

          <NavItem eventKey="tasks" className='nav-link' onClick={()=>{window.location.href = '/transactions'}}>
            <NavIcon>
                <AiOutlineTransaction className='f5' />
            </NavIcon>
             <NavText>
             <p className="f4"> Transactions</p>
            </NavText>           
          </NavItem>


          <NavItem eventKey="tasks" className='nav-link' onClick={()=>{window.location.href = '/freelancers'}}>
            <NavIcon>
                <SiFreelancer className='f5' />
            </NavIcon>
             <NavText>
             <p className="f4"> Freelancers</p>
            </NavText>           
          </NavItem>

          <NavItem eventKey="tasks" className='nav-link' onClick={()=>{window.location.href = '/clients'}}>
            <NavIcon>
                <FaHospitalUser className='f5' />
            </NavIcon>
             <NavText>
             <p className="f4"> Clients</p>
            </NavText>           
          </NavItem>

          <NavItem eventKey="tasks" className='nav-link' onClick={()=>{window.location.href = '/specialities'}}>
            <NavIcon>
                <BiSolidCategoryAlt className='f5' />
            </NavIcon>
             <NavText>
             <p className="f4"> Specialities</p>
            </NavText>           
          </NavItem>

          <NavItem eventKey="tasks" className='nav-link' onClick={()=>{window.location.href = '/currency'}}>
            <NavIcon>
                <BsCurrencyExchange className='f5' />
            </NavIcon>
             <NavText>
             <p className="f4"> Currency</p>
            </NavText>           
          </NavItem>

          <NavItem eventKey="tasks" className='nav-link' onClick={()=>{window.location.href = '/statuses'}}>
            <NavIcon>
                <TbStatusChange className='f5' />
            </NavIcon>
             <NavText>
             <p className="f4"> Status</p>
            </NavText>           
          </NavItem>

          <NavItem eventKey="tasks" className='nav-link' onClick={()=>{window.location.href = '/country'}}>
            <NavIcon>
                <FaFlagUsa className='f5' />
            </NavIcon>
             <NavText>
             <p className="f4">Country</p>
            </NavText>           
          </NavItem>

          <NavItem eventKey="tasks" className='nav-link' onClick={()=>{window.location.href = '/profit'}}>
            <NavIcon>
                <RiWaterPercentFill className='f5' />
            </NavIcon>
             <NavText>
             <p className="f4"> Profit</p>
            </NavText>           
          </NavItem>

          <NavItem eventKey="tasks" className='nav-link' onClick={()=>{window.location.href = '/settings'}}>
            <NavIcon>
                <AiFillSetting className='f5' />
            </NavIcon>
             <NavText>
             <p className="f4"> Settings</p>
            </NavText>           
          </NavItem>

          <NavItem eventKey="home" className='log-out nav-link' onClick={logout}>
            <NavIcon>
                <BiLogOut className='f5'/>
            </NavIcon>
             <NavText>
              <p className="f4">
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
