import React, { useEffect, useReducer, useState } from 'react'
import { validate, VALIDATOR_MINLENGTH } from "../../../../util/validators";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";

import { useParams } from "react-router-dom";
import { RiDeleteBinFill } from 'react-icons/ri';
import { TiArrowBack } from 'react-icons/ti';
import { ImCancelCircle } from 'react-icons/im';

//specialityName validation
const specialityNameReducer = (state, action) => {
    switch (action.type) {
        case "CHANGE":
            return {
                ...state,
                value: action.specialityName,
                isvalid: validate(action.specialityName, action.validators),
            };
        case "TOUCH":
            return {
                ...state,
                isTouched: true,
            };
        default:
            return state;
    }
};
//specialitType validation
const specialitTypeReducer = (state, action) => {
    switch (action.type) {
        case "CHANGE":
            return {
                ...state,
                value: action.specialitType,
                isvalid: validate(action.specialitType, action.validators),
            };
        case "TOUCH":
            return {
                ...state,
                isTouched: true,
            };
        default:
            return state;
    }
};

const SpecialityDetails = () => {

    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    let { id } = useParams();

    const [speciality, setSpeciality] = useState([]);

    useEffect(() => {
        let timerId;
        if (loading) {
            setIsLoading(true);
            timerId = setTimeout(async () => {
                await axios.get(` http://localhost:5000/api/speciality/${id}`).then((res) => {
                    setSpeciality(res.data.speciality);
                    console.log(res.data.speciality)
                });
                setLoading(false);
                setIsLoading(false);
            });
        }
        return () => clearTimeout(timerId);
    }, [loading]);

    //specialityName validation
    const [specialityNameState, dispatch] = useReducer(specialityNameReducer, {
        value: speciality.sub_speciality,
        isvalid: false,
        isTouched: false,
    });

    const specialityNameChangeHandler = (event) => {
        dispatch({
            type: "CHANGE",
            specialityName: event.target.value,
            validators: [VALIDATOR_MINLENGTH(3)],
        });
    };
    const specialityNameTouchHandler = () => {
        dispatch({
            type: "TOUCH",
        });
    };

    //specialitType validation
    const [specialitTypeState, dispatch2] = useReducer(specialitTypeReducer, {
        value: speciality.speciality ,
        isvalid: false,
        isTouched: false,
    });

    const specialitTypeChangeHandler = (event) => {
        dispatch2({
            type: "CHANGE",
            specialitType: event.target.value,
            validators: [VALIDATOR_MINLENGTH(3)],
        });
    };
    const specialitTypeTouchHandler = () => {
        dispatch2({
            type: "TOUCH",
        });
    };
    //////////////////////////////////////
    const editSpecialityHandler = async (event) => {
        event.preventDefault();
        // send api request to validate data
        setIsLoading(true);
        try {
            setError(null);
            const response = await axios.post(
                ` http://localhost:5000/api/speciality/${speciality._id}`,
                {
                    sub_speciality: specialityNameState.value,
                    speciality: specialitTypeState.value,
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
    const deleteSpecialityHandler = async () => {
        setIsLoading(true);
        try {
            setError(null);
            const response = await axios.delete(
                `  http://localhost:5000/api/speciality/${id}`
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
                    <h3 className="col-12 col-md-5  edit-form-lable text-start pt-3"> Sub-Speciality:</h3>
                    <p className={!edit ? "d-inline col-10 col-md-4 pt-4 edit-form-p fw-bold " : 'd-none'}> {speciality.sub_speciality} </p>
                    <div className={edit ? "d-inline col-10 col-md-4 pt-3 " : 'd-none'} >
                        <input type='text' placeholder={speciality.sub_speciality}
                            value={specialityNameState.value}
                            onChange={specialityNameChangeHandler}
                            onBlur={specialityNameTouchHandler}
                            isvalid={specialityNameState.isvalid.toString()}
                            className={`search w-100 p-2 ${!specialityNameState.isvalid &&
                                specialityNameState.isTouched &&
                                "form-control-invalid"
                                }`}
                        />
                    </div>
                </div>
                {/* /////////////////////// */}

                <div className="col-12 col-xl-6 row ">
                    <h3 className="col-12 col-md-5  edit-form-lable text-start pt-3"> Speciality :</h3>
                    <p className={!edit ? "d-inline col-10 col-md-4 pt-4 edit-form-p fw-bold" : 'd-none'}> {speciality.speciality} </p>
                    <div className={edit ? "d-inline col-10 col-md-4 pt-3 " : 'd-none'} >
                        <input type='text' placeholder={speciality.speciality}
                            value={specialitTypeState.value}
                            onChange={specialitTypeChangeHandler}
                            onBlur={specialitTypeTouchHandler}
                            isvalid={specialitTypeState.isvalid.toString()}
                            className={`search w-100 p-2 ${!specialitTypeState.isvalid &&
                                specialitTypeState.isTouched &&
                                "form-control-invalid"
                                }`}
                        />
                    </div>
                </div>


                {/* /////////////////////// */}


                <div className="col-12  p-3">
                    {!edit ?
                        <button
                            className="edit-user-btn p-3 col-10 col-lg-4 fw-bold"
                            // onClick={editUserHandler}
                            onClick={() => { setEdit(!edit) }}
                        >
                            Edit
                        </button> : ''
                    }
                    {edit ?
                        <>
                            <button
                                disabled={
                                    !specialitTypeState.isvalid &&
                                    !specialityNameState.isvalid
                                }
                                className="edit-user-btn p-3 col-8 col-lg-4 fw-bold"
                                onClick={editSpecialityHandler}
                            >
                                Submit
                            </button>
                            <button
                                className="bg-danger cancel-btn p-3 col-3 col-md-1 mx-2 fw-bold"
                                onClick={() => { setEdit(!edit) }}
                            >
                                <ImCancelCircle className="fs-3" />
                            </button>
                        </>
                        : ''
                    }
                </div>

            </div>

        </div>
    )
}

export default SpecialityDetails
