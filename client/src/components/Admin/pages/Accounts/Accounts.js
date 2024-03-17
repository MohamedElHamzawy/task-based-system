import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import Filter from "../../../Filter";
import { useNavigate } from "react-router-dom";
import Account from "../../../Account";
import ReactDatePicker from "react-datepicker";
import { FaPlus } from "react-icons/fa";

const Accounts = () => {
  const [accounts, setAccounts] = useState([
    { title: "Ziad Gaafar", type: "freelancer", balance: 1000 },
  ]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URL}:5000/api/account/`)
          .then((res) => {
            setAccounts(res.data.accounts);
          });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  //search filter
  const getSearchFilter = (searchName, accounts) => {
    if (!searchName) {
      return accounts;
    }
    return accounts.filter(
      (account) =>
        account.title &&
        account.title.toLowerCase().includes(searchName.toLowerCase())
    );
  };
  // Account Type filter
  const getAccountTypeFilter = (accountType, accounts) => {
    if (!accounts) {
      return accounts;
    }
    return accounts.filter((account) => account.type.includes(accountType));
  };

  const [searchName, setSearchName] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [accountType, setAccountType] = useState("");
  const [searchFilterData, setSearchFilterData] = useState(true);
  const [accountTypeFilterData, setAccountTypeFilterData] = useState(false);
  const navigate = useNavigate();
  const searchFilter = getSearchFilter(searchName, accounts);
  const accountTypeFilter = getAccountTypeFilter(accountType, accounts);

  const [datePickerOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <>
      <Filter filterOpen={filterOpen} setFilterOpen={setFilterOpen}>
        <select
          id="accountType"
          name="accountType"
          className=""
          value={accountType}
          onChange={(e) => {
            setAccountType(e.target.value);
            setAccountTypeFilterData(true);
            setSearchFilterData(false);
            setSearchName("");
          }}
        >
          <option selected disabled value="" className="">
            AccountType
          </option>
          <option value="freelancer" className="">
            FreeLancer
          </option>
          <option value="client" className="">
            Client
          </option>
        </select>
      </Filter>
      <div className="min-h-[calc(100vh-100px)] ml-44">
        <div className="flex justify-between items-center my-8">
          <h1 className="text-2xl">System Accounts</h1>
          <div className="">
            <ReactDatePicker
              className="relative rounded border border-gray-300 cursor-pointer text-gray-400 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              selected={startDate}
              onChange={onChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              showMonthDropdown
              inline={datePickerOpen}
              dateFormat="MMM, yyyy"
              showIcon
              toggleCalendarOnIconClick
              calendarIconClassname="mr-4 cursor-pointer absolute z-10 top-0.5"
            />
          </div>
        </div>
        <div className="bg-gray-100 px-8 py-4 rounded-sm drop-shadow">
          <div className="flex justify-between items-center">Team Members</div>
          <div className="flex justify-between items-center my-4">
            <div className="w-1/3">
              <input
                type="text"
                placeholder="Search By UserName"
                value={searchName}
                onChange={(e) => {
                  setSearchName(e.target.value);
                  setAccountTypeFilterData(false);
                  setSearchFilterData(true);
                  setAccountType("");
                }}
              />
            </div>
          </div>
          {searchFilterData &&
            (!searchFilter.length == 0 ? (
              searchFilter.map((account, index) => (
                <Account key={index} user={account} />
              ))
            ) : (
              <div className="text-center">
                <h2>There Is No Accounts</h2>
              </div>
            ))}
          {accountTypeFilterData &&
            (!accountTypeFilter.length == 0 ? (
              accountTypeFilter.map((account, index) => (
                <Account key={index} user={account} />
              ))
            ) : (
              <div className="text-center">
                <h2>There Is No Accounts</h2>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Accounts;
