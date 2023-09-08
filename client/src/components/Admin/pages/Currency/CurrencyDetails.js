import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";

import { useParams } from "react-router-dom";
import { BiSolidEditAlt } from 'react-icons/bi';
import { RiDeleteBinFill } from 'react-icons/ri';
import { TiArrowBack } from 'react-icons/ti';



const CurrencyDetails = () => {

    const [editName, setEditName] = useState(false);
    const [editPrice, setEditPrice] = useState(false);

    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    let { id } = useParams();

    const [currency, setCurrency] = useState([]);
    const [currencyName, setCurrencyName] = useState();
    const [currencyPrice, setCurrencyPrice] = useState();

    useEffect(() => {
        let timerId;
        if (loading) {
            setIsLoading(true);
            timerId = setTimeout(async () => {
                await axios.get(`http://localhost:5000/api/currency/${id}`).then((res) => {
                  setCurrency(res.data.message);
                  setCurrencyName(res.data.message.currencyname);
                  setCurrencyPrice(res.data.message.priceToEGP);
                  console.log(res.data.message)
                });
                setLoading(false);
                setIsLoading(false);
            });
        }
        return () => clearTimeout(timerId);
    }, [loading]);

    //////////////////////////////////////
    const editCurrencyHandler = async (event) => {
        event.preventDefault();
        // send api request to validate data
        setIsLoading(true);
        try {
            setError(null);
            const response = await axios.post(
                `http://localhost:5000/api/currency/${currency._id}`,
                {
                    name: currencyName,
                    price: currencyPrice,
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
    const deleteCurrencyHandler = async () => {
        setIsLoading(true);
        try {
            setError(null);
            const response = await axios.delete(
                ` http://localhost:5000/api/currency/${id}`
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
            window.location.href = '/currency';
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
                    <button className="back-btn p-2 px-3 fs-3 " onClick={() => { window.location.href = '/currency' }}><TiArrowBack /> </button>
                </div>
                <h2 className="col-12 col-lg-7 text-center system-head p-2 pt-4">  Currency Details</h2>
            </div>

            <div className="row bg-white adduser-form p-1 m-1 justify-content-center">

                <div className="col-12 row p-3 justify-content-end ">
                    <div className="col-4">
                        <button className="delete-btn px-4 p-1 fs-3" onClick={deleteCurrencyHandler}>
                            <RiDeleteBinFill />
                        </button>
                    </div>
                </div>
                {/* /////////////////////// */}
                <div className="col-12 col-xl-6 row ">
                    <h3 className="col-12 col-md-5  edit-form-lable text-start"> Currency Name :</h3>
                    <p className={!editName ? "d-inline col-10 col-md-4 py-3 edit-form-p fw-bold " : 'd-none'}> {currency.currencyname} </p>
                    <div className={editName ? "d-inline col-10 col-md-4 py-3 " : 'd-none'} >
                        <input type="text" onChange={(e) => { setCurrencyName(e.target.value) }} className="search w-100 p-2" />
                    </div>
                    <div className="col-1 ">
                        <button onClick={() => { setEditName(!editName) }} className="edit-btn fs-2">
                            <BiSolidEditAlt />
                        </button>
                    </div>
                </div> 
                {/* /////////////////////// */}

               <div className="col-12 col-xl-6 row p-2 ">
                    <h3 className="col-12 col-md-5  edit-form-lable text-start"> Price In EGP :</h3>
                    <p className={!editPrice ? "d-inline col-10 col-md-4 py-3 edit-form-p fw-bold" : 'd-none'}> {currency.priceToEGP} </p>
                    <div className={editPrice ? "d-inline col-10 col-md-4 py-3 " : 'd-none'} >
                        <input type="number" onChange={(e) => { setCurrencyPrice(e.target.value) }} className="search w-100 p-2" />
                    </div>
                    <div className="col-1 ">
                        <button onClick={() => { setEditPrice(!editPrice) }} className="edit-btn fs-2">
                            <BiSolidEditAlt />
                        </button>
                    </div>
                </div> 


                {/* /////////////////////// */}

                <div className="col-12  p-3">
                    <button
                        disabled={
                            !editName &&
                            !editPrice
                        }
                        className="edit-user-btn p-3 col-10 col-lg-4 fw-bold" onClick={editCurrencyHandler}>
                        Edit
                    </button>
                </div>

            </div> 

        </div>
    )
}

export default CurrencyDetails
