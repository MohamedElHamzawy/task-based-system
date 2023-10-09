import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import './Tasks.css'

import { BsFillFolderSymlinkFill } from 'react-icons/bs';


import GetCookie from "../../../../hooks/getCookie";

//search filter 
const getSearchFilter = (searchName, tasks) => {
  if (!searchName) {
    return tasks;
  } return tasks.filter(
    (task) => task.title.toLowerCase().includes(searchName.toLowerCase()) || task.serialNumber.includes(searchName) 
  );
};

// statuses filter
const getStatusFilter = (status, tasks) => {
  if (!status) {
    return tasks;
  } return tasks.filter((tasks) => tasks.taskStatus._id.includes(status));
};

const PendingTasks = () => {

  const token = GetCookie("UserA")
  const [tasks, setTasks] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);


  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios.get(" https://smarteduservices.com:5000/api/status/filter/all/",
          { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
            setStatuses(res.data.statuses);
          });
      });
      timerId = setTimeout(async () => {
        await axios.get(" https://smarteduservices.com:5000/api/task/",
          { headers: { Authorization: `Bearer ${token}` } }
        ).then((res) => {
          setTasks(res.data.pendingTasks);
        });
        setIsLoading(false);
        setLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  const [status, setStatus] = useState('');

  const [searchName, setSearchName] = useState('');
  const [searchFilterData, setSearchFilterData] = useState(true);

  const [statusFilterData, setStatusFilterData] = useState(false);

  const searchFilter = getSearchFilter(searchName, tasks);

  const StatusFilter = getStatusFilter(status, tasks);

  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="row w-100 p-0 m-0 ">

      <div className="col-12 row text-center system-head p-2">
        <div className="col-12 col-sm-10 col-md-6 ">
          <h1 className='logo text-white bg-danger p-2'>Customer Service</h1>
        </div>
        <h1 className="col-12 text-center fw-bold">Pending Tasks</h1>
      </div>

      <div className="row p-0 m-0 justify-content-center">

        <div className="col-10 col-md-5 p-2 justify-content-center row">
          <input type="name" className="search p-2 col-12" placeholder="Search By Name or Serial Number" value={searchName}
            onChange={(e) => { setSearchName(e.target.value); setSearchFilterData(true); setStatusFilterData(false); setStatus('') }}
          />
        </div>

        <div className="col-10 col-md-7 text-secondary row p-2  justify-content-end">

          <label htmlFor="status" className="my-2 col-3 text-end ">Filter:</label>
          <select id="status" name="status" className="search col-8 col-lg-5 mx-1" value={status}
            onChange={(e) => { setStatus(e.target.value); setStatusFilterData(true); setSearchFilterData(false); setSearchName('') }}>
            <option value="" className='text-secondary'>Statuses</option>
            {statuses.map((status) => (
              <option value={status._id} key={status._id}>{status.statusname}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="row justify-content-center p-0 m-0">
        {searchFilterData ? !searchFilter.length == 0 ? searchFilter.map((task) => (
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
            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Created At :</span> {task.createdAt.split('T')[0]}</p>
            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Speciality :</span> {task.speciality.sub_speciality}</p>

            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Created By :</span> {task.created_by && task.created_by.fullname}</p>
            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Deadline :</span> {task.deadline.split('T')[0]}</p>
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
            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Created At :</span> {task.createdAt.split('T')[0]}</p>
            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Speciality :</span> {task.speciality.sub_speciality}</p>

            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Created By :</span> {task.created_by && task.created_by.fullname}</p>
            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Deadline :</span> {task.deadline.split('T')[0]}</p>
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

export default PendingTasks
