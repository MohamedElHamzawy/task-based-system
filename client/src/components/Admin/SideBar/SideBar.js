import React, { useState } from 'react';
import './Sidebar.css';
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import { FaUsers } from 'react-icons/fa';
import { FaTasks } from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';


import RemoveCookie from '../../../hooks/removeCookie';

import SideNav, {
  Toggle,
  Nav,
  NavItem,
  NavIcon,
  NavText,
} from "@trendmicro/react-sidenav";

function logout() {
  localStorage.removeItem("UserData");
  RemoveCookie("Token");
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
      <SideNav defaultExpanded={!this.state.isVisible} className='' >
        <SideNav.Toggle
          onClick={() => {
            this.setState({ isVisible: !this.state.isVisible });
          }}
        />
        <SideNav.Nav >

          <NavItem eventKey="users" className=' my-2' onClick={()=>{window.location.href = '/'}}>
            <NavIcon >
                <FaUsers className='fs-4'/>
            </NavIcon>
             <NavText >
               <p className='fs-3'>Users </p> 
            </NavText>           
          </NavItem>


          <NavItem eventKey="tasks" className=' my-2' onClick={()=>{window.location.href = '/tasks'}}>
            <NavIcon>
                <FaTasks className='fs-4' />
            </NavIcon>
             <NavText>
             <p className="fs-3 "> Tasks</p>
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
