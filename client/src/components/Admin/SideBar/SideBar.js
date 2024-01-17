import React from "react";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import { FaUsers, FaFlag, FaTasks, FaHospitalUser } from "react-icons/fa";
import { BiLogOut, BiSolidCategoryAlt } from "react-icons/bi";
import {
  AiFillSetting,
  AiOutlineHome,
  AiOutlineTransaction,
} from "react-icons/ai";
import { BsCurrencyExchange } from "react-icons/bs";
import { SiFreelancer } from "react-icons/si";
import { TbStatusChange } from "react-icons/tb";
import { RiWaterPercentFill } from "react-icons/ri";
import { HiUsers } from "react-icons/hi";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";

import RemoveCookie from "../../../hooks/removeCookie";

import SideNav, { NavItem, NavIcon, NavText } from "@trendmicro/react-sidenav";

const navItems = [
  { navigate: "/", icon: AiOutlineHome, label: "Home" },
  { navigate: "/users", icon: FaUsers, label: "Users" },
  { navigate: "/tasks", icon: FaTasks, label: "Tasks" },
  {
    navigate: "/notifications",
    icon: MdOutlineNotificationsActive,
    label: "Notifications",
  },
  {
    navigate: "/accounts",
    icon: HiUsers,
    label: "Accounts",
  },
  {
    navigate: "/transactions",
    icon: AiOutlineTransaction,
    label: "Transactions",
  },
  {
    navigate: "/freelancers",
    icon: SiFreelancer,
    label: "Freelancers",
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
    navigate: "/currency",
    icon: BsCurrencyExchange,
    label: "Currency",
  },
  {
    navigate: "/statuses",
    icon: TbStatusChange,
    label: "Status",
  },
  {
    navigate: "/country",
    icon: FaFlag,
    label: "Country",
  },
  {
    navigate: "/profit",
    icon: RiWaterPercentFill,
    label: "Profit",
  },
  {
    navigate: "/settings",
    icon: AiFillSetting,
    label: "Settings",
  },
];

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  function logout() {
    localStorage.removeItem("AdminData");
    localStorage.removeItem("loggedUserName");
    RemoveCookie("AdminToken");
    window.location.href = "/";
  }
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

export default SideBar;
