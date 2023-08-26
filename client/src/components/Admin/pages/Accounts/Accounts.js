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
  if (!searchName ) {
    return accounts;
  }  return accounts.filter(
    (account) =>  account.title.toLowerCase().includes(searchName.toLowerCase()));
};


const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error , setError] = useState(false);
  

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios.get("http://localhost:5000/api/account/").then((res) => {
          setAccounts(res.data.accounts);
        });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  console.log(accounts)
  const [searchName, setSearchName] = useState('');
  const searchFilter = getSearchFilter(searchName,accounts);


  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="row w-100 p-0 m-0 ">

        <div className="col-12 text-center edit-form-lable p-2">
          <h1 >System Accounts</h1>
        </div>

      <div className="row p-0 m-0 ">

        <div className="col-10 col-md-4 p-2">
          <input type="name" className="search p-2 w-100" placeholder=" Search By UserName" 
           onChange={(e) => { setSearchName(e.target.value) }}
          />
        </div>

      </div>
{/*  
      <div className="bg-white w-100 users-data row p-0 m-0 mt-2">
        <div className="row fw-bold table-head p-0 m-0 py-3">
          <p className="col-5 speciality-table-head text-center">UserName</p>
          <p className="col-4 speciality-table-head">Type</p>
          <p className="col-3  speciality-table-head">Details</p>
        </div>

        { !searchFilter.length==0 ? searchFilter.map((speciality) => (
          <div className="table-body row pt-3 p-0 m-0 " key={speciality._id}>
            <p className="col-5  name-role text-center">{speciality.specialityName}</p>
            <p className="col-5 col-md-4 name-role">{speciality.specialityType}</p>
            <p className="col-2 col-md-3 fs-5 "> <a className="view-details fs-4" href={`/speciality/${speciality._id}`}><BsFillFolderSymlinkFill/></a> </p>
          </div>
        ))  : 
        <div className="row  p-3 m-0 text-center" >
          <h2>
           There Is No Specialities 
          </h2>   
        </div>  
        } 
      </div> */}
    </div>
  )
}

export default Accounts
