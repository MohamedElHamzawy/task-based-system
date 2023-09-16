import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import './Clients.css'
import { FaHospitalUser } from 'react-icons/fa';
import { FiFilter } from 'react-icons/fi';

//search filter
const getSearchFilter = (searchName, clients) => {
  if (!searchName) {
    return clients;
  } return clients.filter(
    (clients) => clients.clientname.toLowerCase().includes(searchName.toLowerCase()))
  // || clients.specialityType.includes(searchName) );
};
// country filter
const getCountryFilter = (country, clients) => {
  if (!country) {
    return clients;
  } return clients.filter((client) => client.country.includes(country));
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

  const [country, setCountry] = useState('');
  const [searchName, setSearchName] = useState('');
  const [sortedClients, setSortedClients] = useState('');

  const [searchFilterData, setSearchFilterData] = useState(true);
  const [countryFilterData, setCountryFilterData] = useState(false);
  const [sortFilterData, setSortFilterData] = useState(false);

  const searchFilter = getSearchFilter(searchName, clients);
  const countryFilter = getCountryFilter(country, clients);

  const sortHandler = async (value) => {
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.get(
        ` http://localhost:5000/api/client/sort/${value}`).then((res) => {
          setSortedClients(res.data.clients);
          console.log(res.data.clients)
        });
      setLoading(false);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "SomeThing Went Wrong , Please Try Again .");
    }
  };
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
        <h1 className="col-12 col-md-6 text-center fw-bold">System Clients</h1>
      </div>

      <div className="row p-0 m-0 col-10 justify-content-center">

        <div className="col-12 col-sm-6 col-lg-3 row p-2 mx-1">
          <input type="name" className="search p-2 w-100" placeholder=" Search By Name"
            onChange={(e) => { setSearchName(e.target.value) ;  setCountryFilterData(false); setSearchFilterData(true); setSortFilterData(false); setCountry('')  }}
          />
        </div>

        <div className="col-12 col-sm-6 col-lg-3 row p-2">
          <input type="name" className="search p-2 w-100" placeholder=" Search Country"
            onChange={(e) => { setCountry(e.target.value);  setCountryFilterData(true); setSearchFilterData(false); setSortFilterData(false); setSearchName('')  }}
          />
        </div>

        <div className="col-12 col-sm-7 col-lg-3 text-secondary row p-2">
          <label htmlFor="role" className="mt-2 col-4 col-sm-5 text-end"> <FiFilter /> Sort:</label>
          <select id="role" name="role" className=" search col-8 col-sm-7 p-2"
            onChange={(e) => { sortHandler(e.target.value); setSearchFilterData(false); setCountryFilterData(false); setSortFilterData(true); setSearchName(''); setCountry('') }}
          >
            <option value="" className="text-secondary">sort</option>
            <option value="completed">Completed</option>
            <option value="profit">Profit</option>
          </select>
        </div>

        <div className="col-12 col-sm-5 col-lg-3 p-2 text-end">
          <button onClick={() => { window.location.href = '/addclient' }} className="new-user p-2">
            <FaHospitalUser className='fs-3' /> Add New Client
          </button>
        </div>

      </div>

      <div className=" w-100 row p-0 m-0 mt-2 justify-content-center">
        {searchFilterData ? !searchFilter.length == 0 ? searchFilter.map((client) => (
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
              <p className="col-12 col-sm-7 edit-form-p fw-bold"> <span className="edit-form-lable">Website : </span>
                {client.website}
              </p>
            </div>
          </div>
        )) :
          <div className="row  p-3 m-0 text-center" >
            <h2>
              There Is No Clients
            </h2>
          </div>:''
        }
         {countryFilterData ? !countryFilter.length == 0 ? countryFilter.map((client) => (
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
              <p className="col-12 col-sm-7 edit-form-p fw-bold"> <span className="edit-form-lable">Website : </span>
                {client.website}
              </p>
            </div>
          </div>
        )) :
          <div className="row  p-3 m-0 text-center" >
            <h2>
              There Is No Clients
            </h2>
          </div>:''
        }
         {sortFilterData ? !sortedClients.length == 0 ? sortedClients.map((client) => (
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
              <p className="col-12 col-sm-7 edit-form-p fw-bold"> <span className="edit-form-lable">Website : </span>
                {client.website}
              </p>
            </div>
          </div>
        )) :
          <div className="row  p-3 m-0 text-center" >
            <h2>
              There Is No Clients
            </h2>
          </div>:''
        }
        </div>
      </div>
  )
}

export default Clients
