import React, { useState } from 'react';
import './UserBSidebar.css';
import "@trendmicro/react-sidenav/dist/react-sidenav.css";

import { FaTasks } from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';
import { FaHospitalUser } from 'react-icons/fa';
import { AiFillSetting } from 'react-icons/ai';
import { MdPendingActions } from 'react-icons/md';

import RemoveCookie from '../../../hooks/removeCookie';

import SideNav, {
  Toggle,
  Nav,
  NavItem,
  NavIcon,
  NavText,
} from "@trendmicro/react-sidenav";

function logout() {
  localStorage.removeItem("UserBData");
  RemoveCookie("UserB");
  window.location.href = '/';
}

class UserBSideBar extends React.Component {

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

          <NavItem eventKey="tasks" className=' my-4' onClick={()=>{window.location.href = '/'}}>
            <NavIcon>
                <MdPendingActions className='fs-4' />
            </NavIcon>
             <NavText>
             <p className="fs-3 "> Pending Tasks</p>
            </NavText>           
          </NavItem>
          <NavItem eventKey="tasks" className=' my-4' onClick={()=>{window.location.href = '/yourtasks'}}>
            <NavIcon>
             <FaTasks className='fs-4'/>
            </NavIcon>
             <NavText>
             <p className="fs-3 "> Your Tasks</p>
            </NavText>           
          </NavItem>

          <NavItem eventKey="tasks" className=' my-4' onClick={()=>{window.location.href = '/freelancers'}}>
            <NavIcon>
                <FaHospitalUser className='fs-4' />
            </NavIcon>
             <NavText>
             <p className="fs-3 "> FreeLancers</p>
            </NavText>           
          </NavItem>

          <NavItem eventKey="tasks" className=' my-4' onClick={()=>{window.location.href = '/settings'}}>
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

export default UserBSideBar;
