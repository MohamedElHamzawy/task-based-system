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
};

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [countries, setCountries] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);


  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios.get(" http://localhost:5000/api/client/").then((res) => {
          setClients(res.data.clients);
           
        });
        setLoading(false);
        setIsLoading(false);
      });
      timerId = setTimeout(async () => {
        await axios.get(" http://localhost:5000/api/country/").then((res) => {
          setCountries(res.data.countries);
           
        });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  const [searchName, setSearchName] = useState('');
  const [country, setCountry] = useState('');

  const [searchFilterData, setSearchFilterData] = useState(true);
  const [sortFilterData, setSortFilterData] = useState(false);

  const searchFilter = getSearchFilter(searchName, clients);
  const [filterData, setFilterData] = useState([]);

  //sort data
  const sortHandler = async (value) => {
    setSortFilterData(true);
    setSearchFilterData(false);
    setSearchName('');
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        ' http://localhost:5000/api/client/sort/filter/',
        {
          country: value
        });
      const responseData = await response;
      if (!(response.statusText === "OK")) {
        throw new Error(responseData.data.message);
      }
      setFilterData(response.data.clients);
       
      setLoading(false);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err.message && "SomeThing Went Wrong , Please Try Again .");
    }
  };

  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="row w-100 p-0 m-0 justify-content-center">

      <div className="col-12 row text-center system-head p-2">
        <div className="col-12 col-sm-10 col-md-6 ">
          <h1 className='logo text-white bg-danger p-2'>Customer Service </h1>
        </div>
        <h1 className="col-12  text-center fw-bold">System Clients</h1>
      </div>

      <div className="row p-0 m-0 col-10 justify-content-center">

        <div className="col-10 col-sm-5 col-md-4  row p-2 mx-1">
          <input type="name" className="search p-2 w-100" placeholder=" Search By Name"
            onChange={(e) => { setSearchName(e.target.value); setSearchFilterData(true); setSortFilterData(false); }}
          />
        </div>

        <div className="col-10 col-sm-5 col-md-4 text-secondary row p-2">
          <select id="speciality" name="speciality" className="search p-2" value={country}
            onChange={(e) => { sortHandler(e.target.value); }}>
            <option value="" className='text-secondary'>Countries</option>
            {countries.map((country) => (
              <option value={country._id} key={country._id}>{country.countryName}</option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md-4 p-2 justify-content-end text-end">
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
               {client.country.countryName}
              </p>
              {client.speciality && client.speciality.map((speciality) => (
                <p className="col-12 col-sm-6 col-md-4 edit-form-p " key={speciality._id} >
                  <span className="edit-form-lable">Speciality :</span> {speciality.specialityName}
                </p>
              ))
              }
              <p className="col-12 col-sm-6 col-md-4 edit-form-p fw-bold"> <span className="edit-form-lable">TaskCount :</span> {client.tasksCount}</p>
              {/* <p className="col-12 col-sm-6 col-md-4 edit-form-p fw-bold"> <span className="edit-form-lable">CompletedTasks :</span> {client.completedCount}</p>
              <p className="col-12 col-sm-6 col-md-4 edit-form-p fw-bold"> <span className="edit-form-lable">TotalGain :</span> {client.totalGain}</p>
              <p className="col-12 col-sm-6 col-md-4 edit-form-p fw-bold"> <span className="edit-form-lable">TotalProfit :</span> {client.totalProfit}</p> */}
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
          </div> : ''
        }

        {sortFilterData ? !filterData.length == 0 ? filterData.map((client) => (
          <div key={client._id} className="task-card bg-white  p-2 py-3 row users-data col-11 my-1">
            <div className="col-12 fw-bold row text-start">
              <div className='col-12 p-2 '>
                <FaHospitalUser className="fs-1 text-danger" />
              </div>
              <p className="col-12 col-sm-6 col-md-4 edit-form-p fw-bold"> <span className="edit-form-lable">Name : </span>
                <a className="text-dark fw-bold" href={`/client/${client._id}`}>{client.clientname}</a>
              </p>
              <p className="col-12 col-sm-6 col-md-4 edit-form-p fw-bold"> <span className="edit-form-lable">Country : </span>
               {client.country.countryName}
              </p>
              {client.speciality && client.speciality.map((speciality) => (
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
          </div> : ''
        }


      </div>
    </div>
  )
}

export default Clients
