import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import './Tasks.css'
import { FaTasks } from 'react-icons/fa';
import { FiFilter } from 'react-icons/fi';
import { BsFillFolderSymlinkFill } from 'react-icons/bs';
import { MdPendingActions } from 'react-icons/md';
import { MdRateReview } from 'react-icons/md';
import { BiSolidOffer } from 'react-icons/bi';
import { GiProgression } from 'react-icons/gi';
import { AiOutlineFileDone } from 'react-icons/ai';
import { TbTruckDelivery } from 'react-icons/tb';
import { GiProfit} from 'react-icons/gi';
import { FaCoins } from 'react-icons/fa';
import { GiPayMoney } from 'react-icons/gi';
import { RiWaterPercentFill } from 'react-icons/ri';



import GetCookie from "../../../../hooks/getCookie";

//search filter 
const getSearchFilter = (searchName, tasks) => {
  if (!searchName) {
    return tasks;
  } return tasks.filter(
    (task) => task.title.toLowerCase().includes(searchName.toLowerCase())
  );
};
// Speciality filter
const getSpecialityFilter = (speciality, tasks) => {
  if (!speciality) {
    return tasks;
  } return tasks.filter((tasks) => tasks.speciality.specialityName.includes(speciality));
};
// Status filter
const getStatusFilter = (status, tasks) => {
  if (!status) {
    return tasks;
  } return tasks.filter((tasks) => tasks.taskStatus.statusname.includes(status));
};


const Tasks = () => {

  const token = GetCookie("AdminToken")
  const [tasks, setTasks] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const [tasksCount, setTasksCount] = useState();
  const [totalGain, setTotalGain] = useState();
  const [totalCost, setTotalCost] = useState();
  const [totalProfit, setTotalProfit] = useState();
  const [totalProfitPercentage, setTotalProfitPercentage] = useState();

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      // timerId = setTimeout(async () => {
      //   await axios.get("http://localhost:5000/api/status/").then((res) => {
      //     setStatuses(res.data.statuses);
      //   });
      // });
      timerId = setTimeout(async () => {
        await axios.get("http://localhost:5000/api/speciality/").then((res) => {
          setSpecialities(res.data.specialities);
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
          setTotalProfitPercentage(res.data.totalProfitPercentage)

          console.log(res.data)
        });
        setIsLoading(false);
        setLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  const [speciality, setSpeciality] = useState('');
  const [status, setStatus] = useState('');

  const [searchName, setSearchName] = useState('');
  const [searchFilterData, setSearchFilterData] = useState(true);
  const [SpecialityFilterData, setSpecialityFilterData] = useState(false);
  const [statusFilterData, setStatusFilterData] = useState(false);

  const searchFilter = getSearchFilter(searchName, tasks);
  const SpecialityFilter = getSpecialityFilter(speciality, tasks);
  const StatusFilter = getStatusFilter(status, tasks);

  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="row w-100 p-0 m-0 justify-content-center">

      <div className="col-12 row text-center system-head p-2">
        <div className="col-6 col-md-3">
          <h1 className='logo text-white bg-danger p-2'>Admin</h1>
        </div>
        <h1 className="col-12 col-md-6 text-center ">System Tasks</h1>
      </div>

      <div className="row p-0 m-0 justify-content-center">

        <div className="col-8 col-md-4 p-2">
          <input type="name" className="search p-2 w-100" placeholder=" Search By Name" value={searchName}
            onChange={(e) => { setSearchName(e.target.value); setSpecialityFilterData(false); setSearchFilterData(true); setStatusFilterData(false); setSpeciality(''); setStatus('') }}
          />
        </div>

        <div className="col-12 col-md-6 text-secondary row p-2">

          <label htmlFor="Speciality" className="my-2 col-3 text-end "> <FiFilter className="" /> Filter:</label>
          <select id="speciality" name="speciality" className="search col-4 mx-1" value={speciality}
            onChange={(e) => { setSpeciality(e.target.value); setSpecialityFilterData(true); setSearchFilterData(false); setStatusFilterData(false); setSearchName(''); setStatus('') }}>
            <option value="" className='text-secondary'>Specialities</option>
            {specialities.map((speciality) => (
              <option value={speciality.specialityName} key={speciality._id}>{speciality.specialityName}</option>
            ))}
          </select>
          <select id="status" name="status" className="search col-4" value={status}
            onChange={(e) => { setStatus(e.target.value); setStatusFilterData(true); setSpecialityFilterData(false); setSearchFilterData(false); setSearchName(''); setSpeciality('') }}>
            <option value="" className='text-secondary'>Statuses</option>
            {statuses.map((status) => (
              <option value={status.statusname} key={status._id}>{status.statusname}</option>
            ))}
          </select>

   
        </div>
        <div className="col-8 col-md-2 p-2">
          <button onClick={() => { window.location.href = '/addtask' }} className="new-user p-2">
            <FaTasks className='fs-3' />  Add New Task
          </button>
        </div>

      </div>

      <div className="row analysis adduser-form p-1 justify-content-center col-11">
        <div className="bg-white adduser-form col-11 col-sm-5 col-lg-3 col-xl-2 p-2 row m-2">
          <h6 className="text-secondary fw-bold col-8 pt-3 text-start">Tasks Count </h6>
          <div className="bg-info col-4 icon p-3 text-center"><FaTasks className="fs-3" /></div>
          <h4 className="text-center col-4 fw-bold">{tasksCount ? tasksCount : '0'}</h4>
        </div>

        <div className="bg-white adduser-form col-11 col-sm-5 col-lg-3 col-xl-2 p-2 row m-2">
          <h6 className="text-secondary fw-bold col-8 pt-3 text-start">Total Cost </h6>
          <div className="bg-warning col-4 icon p-3 text-center"><GiPayMoney className="fs-3 " /></div>
          <h4 className="text-center col-4 fw-bold">{totalCost ? totalCost : '0'}</h4>
        </div>

        <div className="bg-white adduser-form col-11 col-sm-5 col-lg-3 col-xl-2 p-2 row m-2">
          <h6 className="text-secondary fw-bold col-8 pt-3 text-start">Total Gain </h6>
          <div className="bg-success col-4 icon p-3 text-center"><FaCoins className="fs-3 " /></div>
          <h4 className="text-center col-4 fw-bold">{totalGain ? totalGain : '0'}</h4>
        </div>

        <div className="bg-white adduser-form col-11 col-sm-5 col-lg-3 col-xl-2 p-2 row m-2">
          <h6 className="text-secondary fw-bold col-8 pt-3 text-start">Total Profit </h6>
          <div className="bg-danger col-4 icon p-3 text-center"><GiProfit className="fs-3 " /></div>
          <h4 className="text-center col-4 fw-bold">{totalProfit ? totalProfit : '0'}</h4>
        </div>

        <div className="bg-white adduser-form col-11 col-sm-5 col-lg-3 col-xl-2 p-2 row m-2">
          <h6 className="text-secondary fw-bold col-8 pt-3 text-start">Profit Percentage </h6>
          <div className="bg-primary col-4 icon p-3 text-center"><RiWaterPercentFill className="fs-3 " /></div>
          <h4 className="text-center col-4 fw-bold">{totalProfitPercentage ? totalProfitPercentage : '0'}</h4>
        </div>
      </div>

      <div className="row justify-content-center p-0 m-0">
        {searchFilterData ? !searchFilter.length == 0 ? searchFilter.map((task) => (
          <div key={task._id} className="task-card bg-white p-2 py-3 row users-data col-11 my-1">

            <div className="col-12 fw-bold row text-center">

              <span
                className={
                  task.taskStatus.statusname == 'pending' ? 'bg-warning p-3 status col-12 ' :
                    task.taskStatus.statusname == 'admin review' ? 'bg-danger   p-3 status col-12 ' :
                      task.taskStatus.statusname == 'in negotiation' ? 'bg-info   p-3 status col-12 ' :
                        task.taskStatus.statusname == 'in progress' ? 'bg-primary   p-3 status col-12 ' :
                          task.taskStatus.statusname == 'completed' ? 'bg-success   p-3 status col-12 ' :
                            task.taskStatus.statusname == 'delivered to client' ? 'bg-secondary  p-3 status col-12' :
                              'anystatus  p-3 status col-12 '
                }>
                {
                  task.taskStatus.statusname == 'pending' ?
                    <MdPendingActions />
                    :
                    task.taskStatus.statusname == 'admin review' ?
                      <MdRateReview />
                      :
                      task.taskStatus.statusname == 'in negotiation' ?
                        <BiSolidOffer />
                        :
                        task.taskStatus.statusname == 'in progress' ?
                          <GiProgression />
                          :
                          task.taskStatus.statusname == 'completed' ?
                            <AiOutlineFileDone />
                            :
                            task.taskStatus.statusname == 'delivered to client' ?
                              <TbTruckDelivery />
                              :
                              ''
                }
                {task.taskStatus.statusname}
              </span>

            </div>

            <p className="col-12 text-end  fs-5 "> <a className="view-details fs-4" href={`/task/${task._id}`}><BsFillFolderSymlinkFill /></a> </p>

            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Title :</span> {task.title}</p>
            {/* <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Speciality :</span> {task.speciality.specialityName}</p> */}
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

        {SpecialityFilterData ? !SpecialityFilter.length == 0 ? SpecialityFilter.map((task) => (
          <div key={task._id} className="task-card bg-white  p-2 py-3 row users-data col-11 my-1">

            <div className="col-12 fw-bold row text-center">

              <span className={
                task.taskStatus.statusname == 'pending' ? 'bg-warning  p-3 status col-12' :
                  task.taskStatus.statusname == 'admin review' ? 'bg-danger   p-3 status col-12 ' :
                    task.taskStatus.statusname == 'in negotiation' ? 'bg-info   p-3 status col-12 ' :
                      task.taskStatus.statusname == 'in progress' ? 'bg-primary   p-3 status col-12 ' :
                        task.taskStatus.statusname == 'completed' ? 'bg-success   p-3 status col-12 ' :
                          task.taskStatus.statusname == 'delivered to client' ? 'bg-secondary   p-3 status col-12 ' :
                            'anystatus  p-3 status col-12 '
              }>
                {
                  task.taskStatus.statusname == 'pending' ?
                    <MdPendingActions />
                    :
                    task.taskStatus.statusname == 'admin review' ?
                      <MdRateReview />
                      :
                      task.taskStatus.statusname == 'in negotiation' ?
                        <BiSolidOffer />
                        :
                        task.taskStatus.statusname == 'in progress' ?
                          <GiProgression />
                          :
                          task.taskStatus.statusname == 'completed' ?
                            <AiOutlineFileDone />
                            :
                            task.taskStatus.statusname == 'delivered to client' ?
                              <TbTruckDelivery />
                              :
                              ''
                }
                {task.taskStatus.statusname}
              </span>

            </div>

            <p className="col-12 text-end  fs-5 "> <a className="view-details fs-4" href={`/task/${task._id}`}><BsFillFolderSymlinkFill /></a> </p>
            {/* <button className="delete-btn p-2 px-3" onClick={() => deleteSpecialityHandler(task._id)}> <RiDeleteBinFill /> </button> */}

            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Title :</span> {task.title}</p>
            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Speciality :</span> {task.speciality.specialityName}</p>
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

        {statusFilterData ? !StatusFilter.length == 0 ? StatusFilter.map((task) => (
          <div key={task._id} className="task-card bg-white p-2 py-3 row users-data col-11 my-1">

            <div className="col-12 fw-bold row text-center">

              <span className={
                task.taskStatus.statusname == 'pending' ? 'bg-warning  p-3 status col-12 ' :
                  task.taskStatus.statusname == 'admin review' ? 'bg-danger   p-3 status col-12 ' :
                    task.taskStatus.statusname == 'in negotiation' ? 'bg-info   p-3 status col-12 ' :
                      task.taskStatus.statusname == 'in progress' ? 'bg-primary   p-3 status col-12 ' :
                        task.taskStatus.statusname == 'completed' ? 'bg-success   p-3 status col-12 ' :
                          task.taskStatus.statusname == 'delivered to client' ? 'bg-secondary   p-3 status col-12 ' :
                            'anystatus  p-3 status col-12 '
              }>
                {
                  task.taskStatus.statusname == 'pending' ?
                    <MdPendingActions />
                    :
                    task.taskStatus.statusname == 'admin review' ?
                      <MdRateReview />
                      :
                      task.taskStatus.statusname == 'in negotiation' ?
                        <BiSolidOffer />
                        :
                        task.taskStatus.statusname == 'in progress' ?
                          <GiProgression />
                          :
                          task.taskStatus.statusname == 'completed' ?
                            <AiOutlineFileDone />
                            :
                            task.taskStatus.statusname == 'delivered to client' ?
                              <TbTruckDelivery />
                              :
                              ''
                }
                {task.taskStatus.statusname}
              </span>

            </div>

            <p className="col-12 text-end  fs-5 "> <a className="view-details fs-4" href={`/task/${task._id}`}><BsFillFolderSymlinkFill /></a> </p>
            {/* <button className="delete-btn p-2 px-3" onClick={() => deleteSpecialityHandler(task._id)}> <RiDeleteBinFill /> </button> */}

            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Title :</span> {task.title}</p>
            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Speciality :</span> {task.speciality.specialityName}</p>
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
