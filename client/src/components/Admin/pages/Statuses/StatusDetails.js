import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";

import { useParams } from "react-router-dom";
import { BiSolidEditAlt } from 'react-icons/bi';
import { RiDeleteBinFill } from 'react-icons/ri';
import { TiArrowBack } from 'react-icons/ti';



const StatusDetails = () => {

    const [editName, setEditName] = useState(false);

    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    let { id } = useParams();

    const [status, setStatus] = useState([]);
    const [statusName, setStatusName] = useState();

    useEffect(() => {
        let timerId;
        if (loading) {
            setIsLoading(true);
            timerId = setTimeout(async () => {
                await axios.get(`http://localhost:5000/api/status/${id}`).then((res) => {
                    setStatus(res.data.message);
                    setStatusName(res.data.message.statusname);
                    console.log(res.data.message)
                });
                setLoading(false);
                setIsLoading(false);
            });
        }
        return () => clearTimeout(timerId);
    }, [loading]);

    //////////////////////////////////////
    const editStatusHandler = async (event) => {
        event.preventDefault();
        // send api request to validate data
        setIsLoading(true);
        try {
            setError(null);
            const response = await axios.post(
                `http://localhost:5000/api/status/${status._id}`,
                {
                    name: statusName,
                }
            );
            const responseData = await response;
            console.log(responseData)
            if (!(response.statusText === "OK")) {
                throw new Error(responseData.data.message);
            }
            setError(responseData.data.message);
            setIsLoading(false);

        } catch (err) {
            setIsLoading(false);
            setError(err.message && "SomeThing Went Wrong , Please Try Again .");
        }
    };

    //delete user 
    const deleteStatusHandler = async () => {
        setIsLoading(true);
        try {
            setError(null);
            const response = await axios.delete(
                ` http://localhost:5000/api/status/${id}`
                //  ,
                //  { headers :{
                //     'Authorization':`Bearer ${token}`
                //   }
                // }
            )
            const responseData = await response;
            console.log(responseData.data)
            setError(responseData.data.message);
            setIsLoading(false);
            window.location.href = '/statuses';
        } catch (err) {
            setIsLoading(false);
            setError(err.message || "SomeThing Went Wrong , Please Try Again .");
        };
    }
    //error message
    const errorHandler = () => {
        setError(null);
        window.location.reload(true);
    };

    return isLoading ? (
        <LoadingSpinner asOverlay />
    ) : (
        <div className="text-center row w-100 p-4 m-0">
            <ErrorModal error={error} onClear={errorHandler} />

            <div className="row mb-4">
                <div className="col-3 text-center">
                    <button className="back-btn p-2 px-3 fs-3 " onClick={() => { window.location.href = '/statuses' }}><TiArrowBack /> </button>
                </div>
                <h2 className="col-12 col-lg-7 text-center edit-form-lable p-2 pt-4">  Status Details</h2>
            </div>

            <div className="row bg-white adduser-form p-1 m-1 justify-content-center">

                <div className="col-12 row p-3 justify-content-end ">
                    <div className="col-4">
                        <button className="delete-btn px-4 p-1 fs-3" onClick={deleteStatusHandler}>
                            <RiDeleteBinFill />
                        </button>
                    </div>
                </div>
                {/* /////////////////////// */}
                <div className="col-12 col-xl-10 row p-3">
                    <h3 className="col-12 col-md-5  edit-form-lable text-start py-3"> Status Name :</h3>
                    <p className={!editName ? "d-inline col-10 col-md-4 pt-4 edit-form-p fw-bold " : 'd-none'}> {status.statusname} </p>
                    <div className={editName ? "d-inline col-10 col-md-4 pt-3 " : 'd-none'} >
                        <input type="text" onChange={(e) => { setStatusName(e.target.value) }} className="search w-100 p-2" />
                    </div>
                    <div className="col-1 pt-2 ">
                        <button onClick={() => { setEditName(!editName) }} className="edit-btn fs-2">
                            <BiSolidEditAlt />
                        </button>
                    </div>
                </div> 

                {/* /////////////////////// */}

                <div className="col-12  p-3">
                    <button
                        disabled={
                            !editName
                        }
                        className="edit-user-btn p-3 col-10 col-lg-4 fw-bold" onClick={editStatusHandler}>
                        Edit
                    </button>
                </div>

            </div> 

        </div>
    )
}

export default StatusDetails