import React, { useState } from "react";
import "./UserASidebar.css";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";

import { MdPendingActions } from "react-icons/md";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { FaUsers, FaFlag, FaTasks, FaHospitalUser } from "react-icons/fa";
import { BiLogOut, BiSolidCategoryAlt } from "react-icons/bi";
import { AiFillSetting, AiOutlineHome } from "react-icons/ai";

import RemoveCookie from "../../../hooks/removeCookie";

import SideNav, { NavItem, NavIcon, NavText } from "@trendmicro/react-sidenav";
import { useLocation, useNavigate } from "react-router";

function logout() {
  localStorage.removeItem("UserAData");
  localStorage.removeItem("loggedUserName");
  RemoveCookie("UserA");
  window.location.href = "/";
}

const navItems = [
  { navigate: "/", icon: AiOutlineHome, label: "Pending Tasks" },
  { navigate: "/yourtasks", icon: FaUsers, label: "Tasks" },
  {
    navigate: "/notifications",
    icon: MdOutlineNotificationsActive,
    label: "Notifications",
  },
  {
    navigate: "/clients",
    icon: FaHospitalUser,
    label: "Clients",
  },
  {
    navigate: "/specialities",
    icon: BiSolidCategoryAlt,
    label: "Specialities",
  },
  {
    navigate: "/settings",
    icon: AiFillSetting,
    label: "Settings",
  },
];

const UserASideBar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <SideNav
      defaultExpanded={true}
      style={{ position: "fixed" }}
      className="bg-white mt-[4.2rem] py-4 pr-4 shadow-sm"
    >
      <SideNav.Nav>
        {navItems.map((item) => (
          <NavItem
            style={{ height: 36 }}
            key={item.navigate}
            className={`relative flex items-center rounded-sm ${
              location.pathname === item.navigate
                ? "bg-[#F3F8FF] hover:bg-[#F3F8FF]"
                : "hover:bg-gray-50"
            }`}
            eventKey="users"
            onClick={() => navigate(item.navigate)}
          >
            {location.pathname === item.navigate && (
              <div
                style={{ height: 36, marginTop: 7 }}
                className="rounded-sm absolute top-0 w-1 bg-[#0058FF]"
              ></div>
            )}

            <NavIcon
              style={{
                display: "flex",
                alignItems: "center",
                height: 20,
                marginTop: 14,
              }}
            >
              <item.icon
                className="mx-auto"
                color={
                  location.pathname === item.navigate ? "#0058FF" : "#171725"
                }
              />
            </NavIcon>
            <NavText>
              <p
                style={{
                  color:
                    location.pathname === item.navigate ? "#0058FF" : "#171725",
                }}
              >
                {item.label}
              </p>
            </NavText>
          </NavItem>
        ))}
        <NavItem
          style={{ height: 36 }}
          className={`rounded-sm flex items-center hover:bg-gray-50`}
          eventKey="home"
          onClick={logout}
        >
          <NavIcon
            style={{
              display: "flex",
              alignItems: "center",
              height: 20,
              marginTop: 14,
            }}
          >
            <BiLogOut className="mx-auto" color="#171725" />
          </NavIcon>
          <NavText>
            <p className="" style={{ color: "#171725" }}>
              LOGOUT
            </p>
          </NavText>
        </NavItem>
      </SideNav.Nav>
    </SideNav>
  );
};

export default UserASideBar;
