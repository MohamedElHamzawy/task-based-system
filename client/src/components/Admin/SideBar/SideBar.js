import React, { useState } from "react";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import { FaUsers } from "react-icons/fa";
import { FaTasks } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { FaHospitalUser } from "react-icons/fa";
import { AiFillSetting } from "react-icons/ai";
import { BsCurrencyExchange } from "react-icons/bs";
import { SiFreelancer } from "react-icons/si";
import { TbStatusChange } from "react-icons/tb";
import { MdCalculate } from "react-icons/md";
import { AiOutlineTransaction } from "react-icons/ai";
import { RiWaterPercentFill } from "react-icons/ri";
import { FaFlagUsa } from "react-icons/fa";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";

import RemoveCookie from "../../../hooks/removeCookie";

import SideNav, { NavItem, NavIcon, NavText } from "@trendmicro/react-sidenav";

const navItems = [
  { navigate: "/", icon: FaUsers, label: "Users" },
  { navigate: "/tasks", icon: FaTasks, label: "Tasks" },
  {
    navigate: "/notifications",
    icon: MdOutlineNotificationsActive,
    label: "Notifications",
  },
  {
    navigate: "/accounts",
    icon: MdCalculate,
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
    icon: FaFlagUsa,
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
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  function logout() {
    localStorage.removeItem("AdminData");
    RemoveCookie("AdminToken");
    window.location.href = "/";
  }
  return (
    <SideNav
      defaultExpanded={true}
      style={{ position: "fixed" }}
      className="bg-white border mt-16 py-4 pr-4"
    >
      <SideNav.Nav>
        {navItems.map((item) => (
          <NavItem
            style={{ height: 43.5 }}
            key={item.navigate}
            className={`relative rounded-sm ${
              location.pathname === item.navigate
                ? "bg-[#F3F8FF] hover:bg-[#F3F8FF]"
                : "hover:bg-gray-50"
            }`}
            eventKey="users"
            onClick={() => navigate(item.navigate)}
          >
            {location.pathname === item.navigate && (
              <div
                style={{ height: 40 }}
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
                className=""
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
          style={{ height: 40 }}
          className={`rounded-sm hover:bg-gray-50`}
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
