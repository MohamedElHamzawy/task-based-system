import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import './Clients.css'
import { FaHospitalUser } from 'react-icons/fa';
import { RiDeleteBinFill } from 'react-icons/ri';

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
          console.log(res.data)
        });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  const [searchName, setSearchName] = useState('');
  const searchFilter = getSearchFilter(searchName, clients);

  const deleteClientHandler = async (id) => {
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


      <div className="col-12 row text-center system-head p-2">
        <div className="col-6 col-md-3">
          <h1 className='logo text-white bg-danger p-2'>Admin</h1>
        </div>
        <h1 className="col-12 col-md-6 text-center ">System Clients</h1>
      </div>

      <div className="row p-0 m-0 col-10 justify-content-center">

        <div className="col-12 col-md-6 row p-2">
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

      <div className=" w-100 row p-0 m-0 mt-2 justify-content-center">
        {!searchFilter.length == 0 ? searchFilter.map((client) => (
          <div key={client._id} className="task-card bg-white  p-2 py-3 row users-data col-11 my-1">
            <div className="col-12 fw-bold row text-start">
              <div className='col-12 p-2 '>
               <FaHospitalUser className="fs-1 text-danger" />
              </div>
              <p className="col-12 col-sm-6 col-md-4 edit-form-p fw-bold"> <span className="edit-form-lable">Name : </span>
                <a className="text-dark fw-bold" href={`/client/${client._id}`}>{client.clientname}</a>
              </p>
              <p className="col-12 col-sm-6 col-md-4 edit-form-p fw-bold"> <span className="edit-form-lable">Country : </span>
                {client.country}
              </p>
              { client.speciality && client.speciality.map((speciality) => (
                  <p className="col-12 col-sm-6 col-md-4 edit-form-p " key={speciality._id} >
                    <span className="edit-form-lable">Speciality :</span> {speciality.specialityName}
                  </p>
                ))
              }
              <p className="col-12 col-sm-6 col-md-4 edit-form-p fw-bold"> <span className="edit-form-lable">TaskCount :</span> {client.tasksCount}</p>
              <p className="col-12 col-sm-6 col-md-4 edit-form-p fw-bold"> <span className="edit-form-lable">CompletedTasks :</span> {client.completedCount}</p>
              <p className="col-12 col-sm-6 col-md-4 edit-form-p fw-bold"> <span className="edit-form-lable">TotalGain :</span> {client.totalGain}</p>
              <p className="col-12 col-sm-6 col-md-4 edit-form-p fw-bold"> <span className="edit-form-lable">TotalProfit :</span> {client.totalProfit}</p>
              <p className="col-12 col-sm-7 edit-form-p fw-bold"> <span className="edit-form-lable">Email : </span>
                {client.email}
              </p>
            </div>
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
