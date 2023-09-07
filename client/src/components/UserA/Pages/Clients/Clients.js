import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import './Clients.css'
import { BsFillFolderSymlinkFill } from 'react-icons/bs';
import { FaHospitalUser } from 'react-icons/fa';
import { RiDeleteBinFill } from 'react-icons/ri';
import { FiFilter } from 'react-icons/fi';

//search filter
const getSearchFilter = (searchName, clients) => {
  if (!searchName) {
    return clients;
  } return clients.filter(
    (clients) => clients.clientname.toLowerCase().includes(searchName.toLowerCase()))
  // || clients.specialityType.includes(searchName) );
};


const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);


  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios.get("http://localhost:5000/api/client/").then((res) => {
          setClients(res.data.clients);
        });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  const [searchName, setSearchName] = useState('');
  const searchFilter = getSearchFilter(searchName, clients);

  const deleteSpecialityHandler = async (id) => {
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.delete(
        ` http://localhost:5000/api/client/${id}`
        //  ,
        //  { headers :{
        //     'Authorization':`Bearer ${token}`
        //   }
        // }
      )
      const responseData = await response;
      console.log(responseData)
      setError(responseData.data.message);
      setIsLoading(false);
      window.location.href = '/clients';
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "SomeThing Went Wrong , Please Try Again .");
    };
  }

  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="row w-100 p-0 m-0 justify-content-center">

      <div className="col-12 row text-center edit-form-lable p-2">
        <div className="col-12 col-sm-10 col-md-6 ">
          <h1 className='logo text-white bg-danger p-2'>Customer Service </h1>
        </div>
        <h1 className="col-12  text-center ">System Clients</h1>
      </div>

      <div className="row p-0 m-0 col-10 justify-content-center">

        <div className="col-12 col-md-6 p-2  ">
          <input type="name" className="search p-2 w-100" placeholder=" Search By Name"
            onChange={(e) => { setSearchName(e.target.value) }}
          />
        </div>

        <div className="col-12 col-md-5 p-2 text-end">
          <button onClick={() => { window.location.href = '/addclient' }} className="new-user p-2">
            <FaHospitalUser className='fs-3' /> Add New Client
          </button>
        </div>

      </div>

      <div className="bg-white w-100 users-data row p-0 m-0 mt-2">
        <div className="row fw-bold table-head p-0 m-0 py-3">
          <p className="col-4 speciality-table-head text-center">Name</p>
          <p className="col-5 speciality-table-head">Email</p>
          <p className="col-2 ">Delete</p>

        </div>

        {!searchFilter.length == 0 ? searchFilter.map((client) => (
          <div className="table-body row pt-3 p-0 m-0 " key={client._id}>
            <p className="col-4 name-role text-center"><a className="text-dark text-decoration-none fw-bold" href={`/client/${client._id}`}>{client.clientname} </a></p>
            <p className="col-5 name-role">{client.email}</p>
            <p className="col-2"> <button className=" delete-btn p-2 px-3" onClick={()=>deleteSpecialityHandler(client._id)}> <RiDeleteBinFill/> </button></p>     
          </div>
        )) :
          <div className="row  p-3 m-0 text-center" >
            <h2>
              There Is No Clients
            </h2>
          </div>
        }


      </div>
    </div>
  )
}

export default Clients
