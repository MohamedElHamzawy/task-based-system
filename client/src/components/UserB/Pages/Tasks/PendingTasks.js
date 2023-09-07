import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import './Tasks.css'

import { BsFillFolderSymlinkFill } from 'react-icons/bs';
import { MdPendingActions } from 'react-icons/md';


import GetCookie from "../../../../hooks/getCookie";

//search filter 
const getSearchFilter = (searchName, tasks) => {
  if (!searchName) {
    return tasks;
  } return tasks.filter(
    (task) => task.title.toLowerCase().includes(searchName.toLowerCase())
  );
};

const PendingTasks = () => {

  const token = GetCookie("UserB")
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios.get("http://localhost:5000/api/task/",
          { headers: { Authorization: `Bearer ${token}` } }
        ).then((res) => {
          setTasks(res.data.pendingTasks);
          console.log(res.data)
        });
        setIsLoading(false);
        setLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);


  const [searchName, setSearchName] = useState('');
  const [searchFilterData, setSearchFilterData] = useState(true);

  const searchFilter = getSearchFilter(searchName, tasks);


  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="row w-100 p-0 m-0 ">

      <div className="col-12 row text-center edit-form-lable p-2">
      <div className="col-12 col-sm-10 col-md-6 ">
          <h1 className='logo text-white bg-danger p-2'>Specialist Service</h1>
        </div>
        <h1 className="col-12 text-center ">Pending Tasks</h1>
      </div>

      <div className="row p-0 m-0 justify-content-center">

        <div className="col-8 col-lg-4 p-2">
          <input type="name" className="search p-2 w-100" placeholder=" Search By Name" value={searchName}
            onChange={(e) => { setSearchName(e.target.value); setSearchFilterData(true) }}
          />
        </div>

      </div>
      <div className="row justify-content-center ">
        {searchFilterData ? !searchFilter.length == 0 ? searchFilter.map((task) => (
          task.taskStatus.statusname == 'pending' &&  
          <div key={task._id} className="task-card bg-white p-2 py-3 row users-data col-11 my-1">
            <div className="col-12 fw-bold pt-2 row text-center ">
              <span
                className={
                  task.taskStatus.statusname == 'pending' ? 'bg-warning  p-3 status col-12 ' : 'anystatus p-3 status col-12 '
                }>
                {
                  task.taskStatus.statusname == 'pending' ?
                    <MdPendingActions />
                    :
                    ''
                }
                {task.taskStatus.statusname}
              </span>

            </div>

            <p className="col-12 text-end  fs-5 "> <a className="view-details fs-4" href={`/task/${task._id}`}><BsFillFolderSymlinkFill /></a> </p>
            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Title :</span> {task.title}</p>
            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Speciality :</span> {task.speciality.specialityName}</p>
            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Client :</span> {task.client.clientname}</p>
            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Created By :</span> {task.created_by.fullname}</p>
            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Deadline :</span> {task.deadline.split('T')[0]}</p>
            {task.freelancer &&
            <p className="col-12 col-sm-6 edit-form-p fw-bold"> <span className="edit-form-lable">Freelancer :</span> {task.freelancer.freelancername}</p>
            }
          </div>
        )) :
          <div className="row  p-3 m-0 text-center" >
            <h2>
              There Is No Pending Tasks
            </h2>
          </div> : ''
        }

      </div>
    </div>
  )
}

export default PendingTasks
