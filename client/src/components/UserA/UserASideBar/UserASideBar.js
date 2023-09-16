import React, { useState } from 'react';
import './UserASidebar.css';
import "@trendmicro/react-sidenav/dist/react-sidenav.css";


import { FaTasks } from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';
import { BiSolidCategoryAlt } from 'react-icons/bi';
import { FaHospitalUser } from 'react-icons/fa';
import { AiFillSetting } from 'react-icons/ai';
import { BsCurrencyExchange } from 'react-icons/bs';



import RemoveCookie from '../../../hooks/removeCookie';

import SideNav, {
  Toggle,
  Nav,
  NavItem,
  NavIcon,
  NavText,
} from "@trendmicro/react-sidenav";

function logout() {
  localStorage.removeItem("UserAData");
  RemoveCookie("UserA");
  window.location.href = '/';
}

class UserASideBar extends React.Component {

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
                <FaTasks className='fs-4' />
            </NavIcon>
             <NavText>
             <p className="fs-3 "> Tasks</p>
            </NavText>           
          </NavItem>

          <NavItem eventKey="tasks" className=' my-4' onClick={()=>{window.location.href = '/clients'}}>
            <NavIcon>
                <FaHospitalUser className='fs-4' />
            </NavIcon>
             <NavText>
             <p className="fs-3 "> Clients</p>
            </NavText>           
          </NavItem>

          <NavItem eventKey="tasks" className='my-4' onClick={()=>{window.location.href = '/specialities'}}>
            <NavIcon>
                <BiSolidCategoryAlt className='fs-4' />
            </NavIcon>
             <NavText>
             <p className="fs-3 "> Specialities</p>
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

export default UserASideBar;
