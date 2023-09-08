import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";

import { useParams } from "react-router-dom";
import { BiSolidEditAlt } from 'react-icons/bi';
import { RiDeleteBinFill } from 'react-icons/ri';
import { TiArrowBack } from 'react-icons/ti';



const SpecialityDetails = () => {

    const [editName, setEditName] = useState(false);
    const [editType, setEditType] = useState(false);

    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    let { id } = useParams();

    const [speciality, setSpeciality] = useState([]);
    const [specialityName, setSpecialityName] = useState();
    const [specialityType, setSpecialityType] = useState();

    useEffect(() => {
        let timerId;
        if (loading) {
            setIsLoading(true);
            timerId = setTimeout(async () => {
                await axios.get(`http://localhost:5000/api/speciality/${id}`).then((res) => {
                      setSpeciality(res.data.speciality);
                      setSpecialityName(res.data.speciality.specialityName);
                      setSpecialityType(res.data.speciality.specialityType);
                    console.log(res.data.speciality)
                });
                setLoading(false);
                setIsLoading(false);
            });
        }
        return () => clearTimeout(timerId);
    }, [loading]);

    //////////////////////////////////////
    const editSpecialityHandler = async (event) => {
        event.preventDefault();
        // send api request to validate data
        setIsLoading(true);
        try {
            setError(null);
            const response = await axios.post(
                `http://localhost:5000/api/speciality/${speciality._id}`,
                {
                    name: specialityName,
                    type: specialityType,
                }
            );
            const responseData = await response;
            console.log(responseData)
            if (!(response.statusText === "OK")) {
                throw new Error(responseData.data.message);
            }
            setError(responseData.data.error);
            setIsLoading(false);

        } catch (err) {
            setIsLoading(false);
            setError(err.message && "SomeThing Went Wrong , Please Try Again .");
        }
    };

    //delete user 
    const deleteSpecialityHandler = async () => {
        setIsLoading(true);
        try {
            setError(null);
            const response = await axios.delete(
                ` http://localhost:5000/api/speciality/${id}`
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
            window.location.href = '/specialities';
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
                    <button className="back-btn p-2 px-3 fs-3 " onClick={() => { window.location.href = '/specialities' }}><TiArrowBack /> </button>
                </div>
                <h2 className="col-12 col-lg-7 text-center system-head p-2 pt-4">  Speciality Details</h2>
            </div>

            <div className="row bg-white adduser-form p-1 m-1 justify-content-center">

                <div className="col-12 row p-3 justify-content-end ">
                    <div className="col-4">
                        <button className="delete-btn px-4 p-1 fs-3" onClick={deleteSpecialityHandler}>
                            <RiDeleteBinFill />
                        </button>
                    </div>
                </div>
                {/* /////////////////////// */}
                <div className="col-12 col-xl-6 row ">
                    <h3 className="col-12 col-md-5  edit-form-lable text-start"> Speciality Name :</h3>
                    <p className={!editName ? "d-inline col-10 col-md-4 py-3 edit-form-p fw-bold " : 'd-none'}> {speciality.specialityName} </p>
                    <div className={editName ? "d-inline col-10 col-md-4 py-3 " : 'd-none'} >
                        <input type="text" onChange={(e) => { setSpecialityName(e.target.value) }} className="search w-100 p-2" />
                    </div>
                    <div className="col-1 ">
                        <button onClick={() => { setEditName(!editName) }} className="edit-btn fs-2">
                            <BiSolidEditAlt />
                        </button>
                    </div>
                </div> 
                {/* /////////////////////// */}

               <div className="col-12 col-xl-6 row p-2 ">
                    <h3 className="col-12 col-md-5  edit-form-lable text-start"> Speciality Type :</h3>
                    <p className={!editType ? "d-inline col-10 col-md-4 py-3 edit-form-p fw-bold" : 'd-none'}> {speciality.specialityType} </p>
                    <div className={editType ? "d-inline col-10 col-md-4 py-3 " : 'd-none'} >
                        <input type="text" onChange={(e) => { setSpecialityType(e.target.value) }} className="search w-100 p-2" />
                    </div>
                    <div className="col-1 ">
                        <button onClick={() => { setEditType(!editType) }} className="edit-btn fs-2">
                            <BiSolidEditAlt />
                        </button>
                    </div>
                </div> 


                {/* /////////////////////// */}

                <div className="col-12  p-3">
                    <button
                        disabled={
                            !editName &&
                            !editType
                        }
                        className="edit-user-btn p-3 col-10 col-lg-4 fw-bold" onClick={editSpecialityHandler}>
                        Edit
                    </button>
                </div>

            </div> 

        </div>
    )
}

export default SpecialityDetails
