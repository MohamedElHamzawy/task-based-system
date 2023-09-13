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
      <SideNav defaultExpanded={this.state.isVisible} className='sidebar' >
        <SideNav.Toggle
          onClick={() => {
            this.setState({ isVisible: !this.state.isVisible });
          }}
        />
        <SideNav.Nav >

          <NavItem eventKey="users" className='' onClick={()=>{window.location.href = '/'}}>
            <NavIcon >
                <FaUsers className='fs-5'/>
            </NavIcon>
             <NavText >
               <p className='fs-4'>Users </p> 
            </NavText>           
          </NavItem>

          <NavItem eventKey="tasks" className='' onClick={()=>{window.location.href = '/tasks'}}>
            <NavIcon>
                <FaTasks className='fs-5' />
            </NavIcon>
             <NavText>
             <p className="fs-4"> Tasks</p>
            </NavText>           
          </NavItem>

          <NavItem eventKey="tasks" className='' onClick={()=>{window.location.href = '/accounts'}}>
            <NavIcon>
                <MdCalculate className='fs-5' />
            </NavIcon>
             <NavText>
             <p className="fs-4"> Accounts</p>
            </NavText>           
          </NavItem>

          <NavItem eventKey="tasks" className='' onClick={()=>{window.location.href = '/transactions'}}>
            <NavIcon>
                <AiOutlineTransaction className='fs-5' />
            </NavIcon>
             <NavText>
             <p className="fs-4"> Transactions</p>
            </NavText>           
          </NavItem>


          <NavItem eventKey="tasks" className='' onClick={()=>{window.location.href = '/freelancers'}}>
            <NavIcon>
                <SiFreelancer className='fs-5' />
            </NavIcon>
             <NavText>
             <p className="fs-4"> Freelancers</p>
            </NavText>           
          </NavItem>

          <NavItem eventKey="tasks" className='' onClick={()=>{window.location.href = '/clients'}}>
            <NavIcon>
                <FaHospitalUser className='fs-5' />
            </NavIcon>
             <NavText>
             <p className="fs-4"> Clients</p>
            </NavText>           
          </NavItem>

          <NavItem eventKey="tasks" className='' onClick={()=>{window.location.href = '/specialities'}}>
            <NavIcon>
                <BiSolidCategoryAlt className='fs-5' />
            </NavIcon>
             <NavText>
             <p className="fs-4"> Specialities</p>
            </NavText>           
          </NavItem>

          <NavItem eventKey="tasks" className='' onClick={()=>{window.location.href = '/currency'}}>
            <NavIcon>
                <BsCurrencyExchange className='fs-5' />
            </NavIcon>
             <NavText>
             <p className="fs-4"> Currency</p>
            </NavText>           
          </NavItem>

          <NavItem eventKey="tasks" className='' onClick={()=>{window.location.href = '/statuses'}}>
            <NavIcon>
                <TbStatusChange className='fs-5' />
            </NavIcon>
             <NavText>
             <p className="fs-4"> Status</p>
            </NavText>           
          </NavItem>

          <NavItem eventKey="tasks" className='' onClick={()=>{window.location.href = '/profit'}}>
            <NavIcon>
                <RiWaterPercentFill className='fs-5' />
            </NavIcon>
             <NavText>
             <p className="fs-4"> Profit</p>
            </NavText>           
          </NavItem>

          <NavItem eventKey="tasks" className='' onClick={()=>{window.location.href = '/settings'}}>
            <NavIcon>
                <AiFillSetting className='fs-5' />
            </NavIcon>
             <NavText>
             <p className="fs-4"> Settings</p>
            </NavText>           
          </NavItem>

          <NavItem eventKey="home" className='log-out' onClick={logout}>
            <NavIcon>
                <BiLogOut className='fs-5'/>
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
