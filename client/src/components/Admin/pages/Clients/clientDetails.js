import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";

import { useParams } from "react-router-dom";
import { BiSolidEditAlt } from 'react-icons/bi';
import { RiDeleteBinFill } from 'react-icons/ri';
import { TiArrowBack } from 'react-icons/ti';


const ClientDetails = () => {

    const [editName, setEditName] = useState(false);
    const [editEmail, setEditEmail] = useState(false);
    const [editNumber, setEditNumber] = useState(false);
    const [editCountry, setEditCountry] = useState(false);

    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    let { id } = useParams();

    const [client, setClient] = useState([]);
    const [clientName, setClientName] = useState();
    const [clientEmail, setClientEmail] = useState();
    const [country, setCountry] = useState();
    const [phone, setPhone] = useState();

    // useEffect(() => {
    //     let timerId;
    //     if (loading) {
    //         setIsLoading(true);
    //         timerId = setTimeout(async () => {
    //             await axios.get(`http://localhost:5000/api/client/${id}`).then((res) => {
    //                 // setClient(res.data);
    //                 // setClientName(res.data);
    //                 // setClientEmail(res.data);
    //                 // setCountry(res.data);
    //                 // setPhone(res.data);
    //                 console.log(res.data)
    //             });
    //             setLoading(false);
    //             setIsLoading(false);
    //         });
    //     }
    //     return () => clearTimeout(timerId);
    // }, [loading]);

    //////////////////////////////////////
    const editClientHandler = async (event) => {
        event.preventDefault();
        // send api request to validate data
        setIsLoading(true);
        try {
            setError(null);
            const response = await axios.post(
                `http://localhost:5000/api/client/${client._id}`,
                {
                    clientname: clientName,
                    email: clientEmail,
                    country: country,
                    phone: phone,
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
    const deleteClientHandler = async () => {
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
                    <button className="back-btn p-2 px-3 fs-3 " onClick={() => { window.location.href = '/clients' }}><TiArrowBack /> </button>
                </div>
                <h2 className="col-9 col-lg-7 text-center edit-form-lable p-2">  Client Details</h2>
            </div>

            <div className="row bg-white adduser-form p-1 m-1 justify-content-center">

                <div className="col-12 row p-3 justify-content-end ">
                    <div className="col-4">
                        <button className="delete-btn px-4 p-1 fs-3" onClick={deleteClientHandler}>
                            <RiDeleteBinFill />
                        </button>
                    </div>
                </div>
                {/* /////////////////////// */}
                <div className="col-12 col-xl-6 row ">
                    <h3 className="col-8 col-md-5  edit-form-lable text-start"> Client Name :</h3>
                    <p className={!editName ? "d-inline col-10 col-md-4 py-3 edit-form-p fw-bold " : 'd-none'}> {client.clientName} </p>
                    <div className={editName ? "d-inline col-10 col-md-4 py-3 " : 'd-none'} >
                        <input type="text" onChange={(e) => { setClientName(e.target.value) }} className="search w-100 p-2" />
                    </div>
                    <div className="col-1 ">
                        <button onClick={() => { setEditName(!editName) }} className="edit-btn fs-2">
                            <BiSolidEditAlt />
                        </button>
                    </div>
                </div>
                {/* /////////////////////// */}

                <div className="col-12 col-xl-6 row p-2 ">
                    <h3 className="col-8 col-md-5  edit-form-lable text-start"> Client Email :</h3>
                    <p className={!editEmail ? "d-inline col-10 col-md-4 py-3 edit-form-p fw-bold" : 'd-none'}> {client.email} </p>
                    <div className={editEmail ? "d-inline col-10 col-md-4 py-3 " : 'd-none'} >
                        <input type="email" onChange={(e) => { setClientEmail(e.target.value) }} className="search w-100 p-2" />
                    </div>
                    <div className="col-1 ">
                        <button onClick={() => { setEditEmail(!editEmail) }} className="edit-btn fs-2">
                            <BiSolidEditAlt />
                        </button>
                    </div>
                </div>
                {/* /////////////////////// */}
                <div className="col-12 col-xl-6 row p-2 ">
                    <h3 className="col-8 col-md-5  edit-form-lable text-start"> Phone :</h3>
                    <p className={!editNumber ? "d-inline col-10 col-md-4 py-3 edit-form-p fw-bold" : 'd-none'}> {client.phone} </p>
                    <div className={editNumber ? "d-inline col-10 col-md-4 py-3 " : 'd-none'} >
                        <input type="text" onChange={(e) => { setPhone(e.target.value) }} className="search w-100 p-2" />
                    </div>
                    <div className="col-1 ">
                        <button onClick={() => { setEditNumber(!editNumber) }} className="edit-btn fs-2">
                            <BiSolidEditAlt />
                        </button>
                    </div>
                </div>
                {/* /////////////////////// */}
                <div className="col-12 col-xl-6 row p-2 ">
                    <h3 className="col-8 col-md-5  edit-form-lable text-start"> Country :</h3>
                    <p className={!editCountry ? "d-inline col-10 col-md-4 py-3 edit-form-p fw-bold" : 'd-none'}> {client.country} </p>
                    <div className={editCountry ? "d-inline col-10 col-md-4 py-3 " : 'd-none'} >
                        <input type="text" onChange={(e) => { setCountry(e.target.value) }} className="search w-100 p-2" />
                    </div>
                    <div className="col-1 ">
                        <button onClick={() => { setEditCountry(!editCountry) }} className="edit-btn fs-2">
                            <BiSolidEditAlt />
                        </button>
                    </div>
                </div>
                {/* /////////////////////// */}

                <div className="col-12  p-3">
                    <button
                        disabled={
                            !editName &&
                            !editNumber &&
                            !editCountry &&
                            !editEmail
                        }
                        className="edit-user-btn p-3 col-10 col-lg-4 fw-bold" onClick={editClientHandler}>
                        Edit
                    </button>
                </div>

            </div>

        </div>
    )
}

export default ClientDetails
