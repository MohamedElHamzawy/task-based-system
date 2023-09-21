import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import './Accounts.css'
import { BsFillFolderSymlinkFill } from 'react-icons/bs';
import { BiSolidCategoryAlt } from 'react-icons/bi';
import { RiDeleteBinFill } from 'react-icons/ri';
import { FiFilter } from 'react-icons/fi';

//search filter 
const getSearchFilter = (searchName, accounts) => {
  if (!searchName) {
    return accounts;
  } return accounts.filter(
    (account) => account.title.toLowerCase().includes(searchName.toLowerCase()));
};
// Account Type filter
const getAccountTypeFilter = (accountType, accounts) => {
  if (!accounts) {
    return accounts;
  } return accounts.filter((account) => account.type.includes(accountType));
};

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);


  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios.get("http://localhost:5000/api/account/").then((res) => {
          setAccounts(res.data.accounts);
          console.log(res.data)
        });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  const [searchName, setSearchName] = useState('');

  const [accountType, setAccountType] = useState('');
  const [searchFilterData, setSearchFilterData] = useState(true);
  const [accountTypeFilterData, setAccountTypeFilterData] = useState(false);

  const searchFilter = getSearchFilter(searchName, accounts);
  const accountTypeFilter = getAccountTypeFilter(accountType, accounts);

  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="row w-100 p-0 m-0 ">


      <div className="col-12 row text-center system-head p-2">
        <div className="col-6 col-md-3">
          <h1 className='logo text-white bg-danger p-2'>Admin</h1>
        </div>
        <h1 className="col-12 col-md-6 text-center  fw-bold">System Accounts</h1>
      </div>

      <div className="row p-0 m-0 justify-content-center">

        <div className="col-10 col-md-4 p-2">
          <input type="name" className="search p-2 w-100" placeholder=" Search By UserName" value={searchName}
            onChange={(e) => { setSearchName(e.target.value); setAccountTypeFilterData(false); setSearchFilterData(true); setAccountType('') }}
          />
        </div>

        <div className="col-12 col-md-5 text-secondary row p-2">
          <label htmlFor="accountType" className="m-2 col-5 text-end"> <FiFilter className="" /> Filter:</label>
          <select id="accountType" name="accountType" className="search col-5" value={accountType}
            onChange={(e) => { setAccountType(e.target.value); setAccountTypeFilterData(true); setSearchFilterData(false); setSearchName('') }}>
            <option value="" className='text-secondary'>AccountType</option>
            <option value="freelancer" className=''>FreeLancer</option>
            <option value="client" className=''>Client</option>
          </select>
        </div>

      </div>

      <div className="bg-white w-100 users-data row p-0 m-0 mt-2">
        <div className="row fw-bold table-head p-0 m-0 py-3">
          <h6 className="col-5 accountType-table-head text-center">UserName</h6>
          <h6 className="col-4 accountType-table-head">Type</h6>
          <h6 className="col-3  accountType-table-head">Balance</h6>
        </div>

        {searchFilterData ? !searchFilter.length == 0 ? searchFilter.map((account) => (
          <div className="table-body row pt-3 p-0 m-0 " key={account._id}>
            <p className="col-5  name-role text-center"><a className="text-dark text-decoration-none fw-bold" href={`/account/${account._id}`}>{account.title} </a></p>
            <p className="col-4  name-role">{account.type}</p>
            <p className="col-3 ">{Math.floor(account.balance)}</p>
          </div>
        )) :
          <div className="row  p-3 m-0 text-center" >
            <h2>
              There Is No Accounts
            </h2>
          </div> : ''
        }
        {accountTypeFilterData ? !accountTypeFilter.length == 0 ? accountTypeFilter.map((account) => (
          <div className="table-body row pt-3 p-0 m-0 " key={account._id}>
            <p className="col-5  name-role text-center"><a className="text-dark text-decoration-none fw-bold" href={`/account/${account._id}`}>{account.title} </a></p>
            <p className="col-4  name-role">{account.type}</p>
            <p className="col-3 ">{account.balance}</p>
          </div>
        )) :
          <div className="row  p-3 m-0 text-center" >
            <h2>
              There Is No Accounts
            </h2>
          </div> : ''
        }
      </div>
    </div>
  )
}

export default Accounts
