import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import './Tasks.css'
import { FaTasks } from 'react-icons/fa';
import { FiFilter } from 'react-icons/fi';
import { BsFillFolderSymlinkFill } from 'react-icons/bs';
import { GiProfit } from 'react-icons/gi';
import { FaCoins } from 'react-icons/fa';
import { GiPayMoney } from 'react-icons/gi';
import { RiWaterPercentFill } from 'react-icons/ri';
import { AiOutlineFileDone } from 'react-icons/ai';


import GetCookie from "../../../../hooks/getCookie";

//search filter 
const getSearchFilter = (searchName, tasks) => {
  if (!searchName) {
    return tasks;
  } return tasks.filter(
    (task) => task.title.toLowerCase().includes(searchName.toLowerCase()) || task.serialNumber.includes(searchName) 
  );
};


const Tasks = () => {

  const token = GetCookie("AdminToken")
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const [tasks, setTasks] = useState([]);

  const [specialities, setSpecialities] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [countries, setCountries] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [clients, setClients] = useState([]);


  const [tasksCount, setTasksCount] = useState();
  const [totalGain, setTotalGain] = useState();
  const [totalCost, setTotalCost] = useState();
  const [totalProfit, setTotalProfit] = useState();
  const [completedCount, setCompletedCount] = useState();
  const [totalProfitPercentage, setTotalProfitPercentage] = useState();

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios.get("http://localhost:5000/api/status/",
          { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
            setStatuses(res.data.statuses);
          });
      });
      timerId = setTimeout(async () => {
        await axios.get("http://localhost:5000/api/speciality/").then((res) => {
          setSpecialities(res.data.specialities);
        });
      });
      timerId = setTimeout(async () => {
        await axios.get("http://localhost:5000/api/country/").then((res) => {
          setCountries(res.data.countries);
          console.log(res.data)
        });
      });      
      timerId = setTimeout(async () => {
        await axios.get("http://localhost:5000/api/freelancer/").then((res) => {
          setFreelancers(res.data.freelancers);
        });
      });    
        timerId = setTimeout(async () => {
        await axios.get("http://localhost:5000/api/client/").then((res) => {
          setClients(res.data.clients);
        });
      });
      timerId = setTimeout(async () => {
        await axios.get("http://localhost:5000/api/task/",
          { headers: { Authorization: `Bearer ${token}` } }
        ).then((res) => {
          setTasks(res.data.tasks);

          setTasksCount(res.data.tasksCount)
          setTotalCost(res.data.totalCost)
          setTotalGain(res.data.totalGain)
          setTotalProfit(res.data.totalProfit)
          setCompletedCount(res.data.completedCount)
          setTotalProfitPercentage(res.data.totalProfitPercentage)

          console.log(res.data)
        });
        setIsLoading(false);
        setLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  const [searchName, setSearchName] = useState('');

  const [speciality, setSpeciality] = useState('');
  const [status, setStatus] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [freelancer, setFreelancer] = useState('');
  const [client, setClient] = useState('');
  const [country, setCountry] = useState('');

  const [searchFilterData, setSearchFilterData] = useState(true);
  const [allFilterData, setAllFilterData] = useState(false);

  const searchFilter = getSearchFilter(searchName, tasks);


  const [filterData, setFilterData] = useState([]);


  //Filter Handler
  const filterHandler = async () => {
    setAllFilterData(true); 
    setSearchFilterData(false);
    setSearchName('');
    console.log( speciality,status ,country ,start ,end ,freelancer ,client)
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        'http://localhost:5000/api/task/filter/result/',
        {
          speciality: speciality,
          status :status ,
          country : country ,
          start : start ,
          end : end ,
          freelancer :freelancer ,
          client :client ,  
       });
      const responseData = await response;
      if (!(response.statusText === "OK")) {
        throw new Error(responseData.data.message);
      }
      setFilterData(response.data.tasks)

      setTasksCount(response.data.tasksCount)
      setTotalCost(response.data.totalCost)
      setTotalGain(response.data.totalGain)
      setTotalProfit(response.data.totalProfit)
      setCompletedCount(response.data.completedCount)
      setTotalProfitPercentage(response.data.totalProfitPercentage)

      console.log(response.data)
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
        <div className="col-6 col-md-3">
          <h1 className='logo text-white bg-danger p-2'>Admin</h1>
        </div>
        <h1 className="col-12 col-md-6 text-center fw-bold">System Tasks</h1>
      </div>

      <div className="row p-0 m-0 justify-content-center">

        <label htmlFor="Speciality" className="my-3 col-2 col-md-1 text-start text-muted">Filter:</label>

        <div className="col-8 col-md-3 p-2">
          <input type="name" className="search p-2 w-100" placeholder="Search By Name or Serial Number" value={searchName}
            onChange={(e) => { 
              setSearchName(e.target.value);
              setSearchFilterData(true); setAllFilterData(false);setFreelancer('');setClient(''); 
              setCountry(''); setSpeciality(''); setStatus(''); setStart(''); setEnd('') }}
          />
        </div>

        <div className="col-10 col-md-7 text-secondary row p-2">
          <label htmlFor="Speciality" className="mt-2 col-4 col-sm-2 text-start text-sm-end">From:</label>
          <input type="date" className="search col-8 col-sm-4  p-2 mt-1"
            onChange={(e) => {setStart(e.target.value);  }}
          />
          <label htmlFor="Speciality" className="mt-2 col-4 col-sm-2 text-start text-sm-end">To:</label>
          <input type="date" className="search col-8 col-sm-4  p-2 mt-1"
            onChange={(e) => {setEnd(e.target.value);  }}
          />
        </div>

        <div className="col-12  text-secondary row p-2 justify-content-center">


          <select id="speciality" name="speciality" className="search col-sm-4 col-md-3 col-lg-2 col-10  m-1 p-2" value={speciality}
            onChange={(e) => {setSpeciality(e.target.value);   }}>
            <option value="" className='text-secondary'>Specialities</option>
            {specialities.map((speciality) => (
              <option value={speciality._id} key={speciality._id}>{speciality.sub_speciality}</option>
            ))}
          </select>

          <select id="status" name="status" className="search col-sm-4 col-md-3 col-lg-2 col-10 p-2 m-1" value={status}
            onChange={(e) => { setStatus(e.target.value);  }}>
            <option value="" className='text-secondary'>Statuses</option>
            {statuses.map((status) => (
              <option value={status._id} key={status._id}>{status.statusname}</option>
            ))}
          </select>

          <select id="status" name="status" className="search col-sm-4 col-md-3 col-lg-2 col-10 p-2 m-1" value={freelancer}
            onChange={(e) => { setFreelancer(e.target.value);  }}>
            <option value="" className='text-secondary'>Freelanceres</option>
            {freelancers.map((freelancer) => (
              <option value={freelancer._id} key={freelancer._id}>{freelancer.freelancername}</option>
            ))}
          </select>

          <select id="status" name="status" className="search col-sm-4 col-md-3 col-lg-2 col-10 p-2 m-1" value={client}
            onChange={(e) => { setClient(e.target.value);  }}>
            <option value="" className='text-secondary'>Clients</option>
            {clients.map((client) => (
              <option value={client._id} key={client._id}>{client.clientname}</option>
            ))}
          </select>
          
          <select id="status" name="status" className="search col-sm-4 col-md-3 col-lg-2 col-10 p-2 m-1" value={country}
            onChange={(e) => { setCountry(e.target.value);  }}>
            <option value="" className='text-secondary'>Countries</option>
            {countries.map((country) => (
              <option value={country._id} key={country._id}>{country.countryName}</option>
            ))}
          </select>
        </div>

        <div className="col-4 col-sm-5 p-2 text-start ">
          <button onClick={filterHandler} className="filter-btn p-2">
            <FiFilter className='fs-3' /> Filter
          </button>
        </div>
        <div className="col-7 col-sm-6 p-2 text-end">
          <button onClick={() => { window.location.href = '/addtask' }} className="new-user p-2">
            <FaTasks className='fs-3' />  Add New Task
          </button>
        </div>

      </div>

      <div className="row analysis adduser-form p-1 justify-content-center col-11">
        <div className="bg-white adduser-form col-11 col-sm-5 col-lg-3  p-2 row m-2">
          <h6 className="text-secondary fw-bold col-8 pt-3 text-start">Tasks Count </h6>
          <div className="bg-info col-4 icon p-3 text-center"><FaTasks className="fs-3" /></div>
          <h4 className="text-center col-4 fw-bold">{tasksCount ? tasksCount : '0'}</h4>
        </div>

        <div className="bg-white adduser-form col-11 col-sm-5 col-lg-3  p-2 row m-2">
          <h6 className="text-secondary fw-bold col-8 pt-3 text-start">Completed Count </h6>
          <div className="waiting-offer col-4 icon p-3 text-center"><AiOutlineFileDone className="fs-3" /></div>
          <h4 className="text-center col-4 fw-bold">{completedCount ? completedCount : '0'}</h4>
        </div>

        <div className="bg-white adduser-form col-11 col-sm-5 col-lg-3  p-2 row m-2">
          <h6 className="text-secondary fw-bold col-8 pt-3 text-start">Total Gain </h6>
          <div className="bg-success col-4 icon p-3 text-center"><FaCoins className="fs-3 " /></div>
          <h4 className="text-center col-4 fw-bold">{totalGain ? totalGain : '0'}</h4>
        </div>

        <div className="bg-white adduser-form col-11 col-sm-5 col-lg-3  p-2 row m-2">
          <h6 className="text-secondary fw-bold col-8 pt-3 text-start">Total Cost </h6>
          <div className="bg-warning col-4 icon p-3 text-center"><GiPayMoney className="fs-3 " /></div>
          <h4 className="text-center col-4 fw-bold">{totalCost ? totalCost : '0'}</h4>
        </div>

        <div className="bg-white adduser-form col-11 col-sm-5 col-lg-3  p-2 row m-2">
          <h6 className="text-secondary fw-bold col-8 pt-3 text-start">Total Profit </h6>
          <div className="bg-danger col-4 icon p-3 text-center"><GiProfit className="fs-3 " /></div>
          <h4 className="text-center col-4 fw-bold">{totalProfit ? totalProfit : '0'}</h4>
        </div>

        <div className="bg-white adduser-form col-11 col-sm-5 col-lg-3  p-2 row m-2">
          <h6 className="text-secondary fw-bold col-8 pt-3 text-start">Profit Percentage </h6>
          <div className="bg-primary col-4 icon p-3 text-center"><RiWaterPercentFill className="fs-3 " /></div>
          <h4 className="text-center col-4 fw-bold">{totalProfitPercentage ? Math.floor(totalProfitPercentage) : '0'}</h4>
        </div>
      </div>

      <div className="row justify-content-center p-0 m-0">
        {searchFilterData ? !searchFilter.length == 0 ? searchFilter.map((task) => (
          <div key={task._id} className="task-card bg-white p-2 py-3 row users-data col-11 my-1">

            <div className="col-12 fw-bold row text-center ">

              <span
                className={
                  task.taskStatus.statusname == 'pending' ? 'bg-warning p-3 status col-12 ' :
                    task.taskStatus.statusname == 'waiting offer' ? 'waiting-offer   p-3 status col-12 ' :
                      task.taskStatus.statusname == 'approved' ? 'bg-info   p-3 status col-12 ' :
                        task.taskStatus.statusname == 'working on' ? 'bg-primary   p-3 status col-12 ' :
                          task.taskStatus.statusname == 'done' ? 'bg-success  p-3 status col-12 ' :
                            task.taskStatus.statusname == 'delivered' ? 'bg-secondary  p-3 status col-12' :
                              task.taskStatus.statusname == 'rejected' ? 'bg-danger   p-3 status col-12 ' :
                                task.taskStatus.statusname == 'not available' ? 'bg-dark   p-3 status col-12 ' :
                                  task.taskStatus.statusname == 'on going' ? 'on-going  p-3 status col-12 ' :
                                    task.taskStatus.statusname == 'offer submitted' ? ' offer-submitted   p-3 status col-12 ' :
                                      task.taskStatus.statusname == 'edit' ? 'edit   p-3 status col-12 ' :
                                        task.taskStatus.statusname == 'cancel' ? 'cancel   p-3 status col-12 ' :
                                          'anystatus  p-3 status col-12 '
                }>

                {task.taskStatus.statusname}
              </span>

            </div>
            <div className="col-12 row text-center justify-content-end my-2 ">
              <div className="fw-bold col-5 col-sm-7 col-md-8 col-lg-10 text-center row p-0 m-0">
                <span className="col-11 col-sm-7 col-md-4 col-lg-2 serial-number p-3">
                  {task.serialNumber}
                </span>
              </div>
              <button className="details-btn p-3 fw-bold col-7 col-sm-5 col-md-4 col-lg-2" onClick={() => { window.location.href = `/task/${task._id}` }}>
                <BsFillFolderSymlinkFill className="fs-4" /> Details
              </button>
            </div>
            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Title :</span> {task.title}</p>
            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Speciality :</span> {task.speciality.sub_speciality}</p>
            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Client :</span> {task.client.clientname}</p>
            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Created By :</span> {task.created_by && task.created_by.fullname}</p>
            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Deadline :</span> {task.deadline.split('T')[0]}</p>
            {task.freelancer &&
              <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Freelancer :</span> {task.freelancer.freelancername}</p>
            }

          </div>
        )) :
          <div className="row  p-3 m-0 text-center" >
            <h2>
              There Is No Tasks
            </h2>
          </div> : ''
        }

        {allFilterData ? !filterData.length == 0 ? filterData.map((task) => (
          <div key={task._id} className="task-card bg-white p-2 py-3 row users-data col-11 my-1">

            <div className="col-12 fw-bold row text-center">

              <span
                className={
                  task.taskStatus.statusname == 'pending' ? 'bg-warning p-3 status col-12 ' :
                    task.taskStatus.statusname == 'waiting offer' ? 'waiting-offer   p-3 status col-12 ' :
                      task.taskStatus.statusname == 'approved' ? 'bg-info   p-3 status col-12 ' :
                        task.taskStatus.statusname == 'working on' ? 'bg-primary   p-3 status col-12 ' :
                          task.taskStatus.statusname == 'done' ? 'bg-success  p-3 status col-12 ' :
                            task.taskStatus.statusname == 'delivered' ? 'bg-secondary  p-3 status col-12' :
                              task.taskStatus.statusname == 'rejected' ? 'bg-danger   p-3 status col-12 ' :
                                task.taskStatus.statusname == 'not available' ? 'bg-dark   p-3 status col-12 ' :
                                  task.taskStatus.statusname == 'on going' ? 'on-going  p-3 status col-12 ' :
                                    task.taskStatus.statusname == 'offer submitted' ? ' offer-submitted   p-3 status col-12 ' :
                                      task.taskStatus.statusname == 'edit' ? 'edit   p-3 status col-12 ' :
                                        task.taskStatus.statusname == 'cancel' ? 'cancel   p-3 status col-12 ' :
                                          'anystatus  p-3 status col-12 '
                }>

                {task.taskStatus.statusname}
              </span>

            </div>

            <div className="col-12 row text-center justify-content-end my-2">
            <div className="fw-bold col-5 col-sm-7 col-md-8 col-lg-10 text-center row p-0 m-0">
                <span className="col-11 col-sm-7 col-md-4 col-lg-2 serial-number p-3">
                  {task.serialNumber}
                </span>
              </div>
              <button className="details-btn p-3 fw-bold col-7 col-sm-5 col-md-4 col-lg-2" onClick={() => { window.location.href = `/task/${task._id}` }}>
                <BsFillFolderSymlinkFill className="fs-4" /> Details
              </button>
            </div>

            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Title :</span> {task.title}</p>
            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Speciality :</span> {task.speciality.sub_speciality}</p>
            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Client :</span> {task.client.clientname}</p>
            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Created By :</span> {task.created_by && task.created_by.fullname}</p>
            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Deadline :</span> {task.deadline.split('T')[0]}</p>
            {task.freelancer &&
              <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Freelancer :</span> {task.freelancer.freelancername}</p>
            }
          </div>
        )) :
          <div className="row  p-3 m-0 text-center" >
            <h2>
              There Is No Tasks
            </h2>
          </div> : ''
        }
      </div>

    </div>
  )
}

export default Tasks
