import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import './Tasks.css'
import { FaTasks } from 'react-icons/fa';
import { BiSolidCategoryAlt } from 'react-icons/bi';
import { FiFilter } from 'react-icons/fi';
import { BsFillFolderSymlinkFill } from 'react-icons/bs';
import { RiDeleteBinFill } from 'react-icons/ri';

import GetCookie from "../../../../hooks/getCookie";

//search filter 
const getSearchFilter = (searchName, specialities) => {
  if (!searchName) {
    return specialities;
  } return specialities.filter(
    (specialities) => specialities.specialityName.toLowerCase().includes(searchName.toLowerCase()) || specialities.specialityType.toLowerCase().includes(searchName.toLowerCase()));
};


const Tasks = () => {

  const token = GetCookie("AdminToken")
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
          setTasks(res.data.tasks);
          console.log(res.data.tasks)
        }
        )
        setLoading(false);
        setIsLoading(false);

      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  const [searchName, setSearchName] = useState('');
  const searchFilter = getSearchFilter(searchName, tasks);

  // const deleteSpecialityHandler=async(id)=>{
  //   setIsLoading(true);
  //   try {
  //   setError(null);
  //   const response = await axios.delete(
  //    ` http://localhost:5000/api/speciality/${id}`
  //   //  ,
  //   //  { headers :{
  //   //     'Authorization':`Bearer ${token}`
  //   //   }
  //   // }
  //   )
  //   const responseData = await response;
  //   console.log(responseData)
  //   setError(responseData.data.message);
  //   setIsLoading(false);
  //   window.location.href = '/specialities' ;
  // }catch (err) {
  //   setIsLoading(false);
  //   setError(err.message || "SomeThing Went Wrong , Please Try Again .");
  // };
  // }

  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="row w-100 p-0 m-0 ">

      <div className="col-12 row text-center edit-form-lable p-2">
        <div className="col-6 col-md-3">
          <h1 className='logo text-white bg-danger p-2'>Admin</h1>
        </div>
        <h1 className="col-12 col-md-6 text-center ">System Tasks</h1>
      </div>

      <div className="row p-0 m-0 ">

        <div className="col-8 col-md-4 p-2">
          <button onClick={() => { window.location.href = '/addtask' }} className="new-user p-2">
            <FaTasks className='fs-3' />  Add New Task
          </button>
        </div>

        <div className="col-10 col-md-4 p-2">
          <input type="name" className="search p-2 w-100" placeholder=" Search By Name or type"
            onChange={(e) => { setSearchName(e.target.value) }}
          />
        </div>

      </div>
      <div className="row justify-content-center ">
        {tasks.map((task) => (
          <div key={task._id} className="task-card bg-white p-3 row users-data col-11 my-1">
            <p className="col-12 text-end  fs-5 "> <a className="view-details fs-4" href={`/task/${task._id}`}><BsFillFolderSymlinkFill /></a> </p>
            {/* <button className="delete-btn p-2 px-3" onClick={() => deleteSpecialityHandler(task._id)}> <RiDeleteBinFill /> </button> */}
            <p className="col-6 edit-form-p fw-bold"> <span className="edit-form-lable">Title :</span> {task.title}</p>
            <p className="col-6 edit-form-p fw-bold"> <span className="edit-form-lable">Deadline :</span> {task.deadline}</p>
            <p className="col-6 edit-form-p fw-bold"> <span className="edit-form-lable">Speciality :</span> {task.speciality}</p>
            <p className="col-6 edit-form-p fw-bold"> <span className="edit-form-lable">Client :</span> {task.client}</p>
            <p className="col-6 edit-form-p fw-bold"> <span className="edit-form-lable">TaskStatus :</span> {task.taskStatus}</p>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Tasks
