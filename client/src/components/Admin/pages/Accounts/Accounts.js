import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import { FiFilter } from "react-icons/fi";
import Filter from "../../../Filter";
import { useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import Account from "../../../Account";

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
          <div className="">FILTERS</div>
        </div>
        <div className="bg-gray-100 px-8 py-4 rounded-sm drop-shadow">
          <div className="flex justify-between items-center">Team Members</div>
          <div className="flex justify-between items-center my-4">
            <input
              type="text"
              className=""
              placeholder="Search By UserName"
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);
                setAccountTypeFilterData(false);
                setSearchFilterData(true);
                setAccountType("");
              }}
            />
            <button
              className="text-white px-4 py-2 flex items-center rounded-sm"
              style={{ backgroundColor: "#00E38C" }}
              type="button"
              onClick={() => navigate("")}
            >
              <IoMdAdd className="text-xl" />
              Add New User
            </button>
          </div>
          {searchFilterData &&
            (!searchFilter.length == 0 ? (
              searchFilter.map((account) => (
                <Account key={account._id} user={account} />
              ))
            ) : (
              <div className="text-center">
                <h2>There Is No Accounts</h2>
              </div>
            ))}
          {accountTypeFilterData &&
            (!accountTypeFilter.length == 0 ? (
              accountTypeFilter.map((account) => (
                <Account key={account._id} user={account} />
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
