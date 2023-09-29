import React, { useReducer, useState } from 'react'
import { validate, VALIDATOR_MINLENGTH } from "../../../../util/validators";
import axios from "axios";
import LoadingSpinner from '../../../../LoadingSpinner/LoadingSpinner';
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";
import { TiArrowBack } from 'react-icons/ti';

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


const AddSpeciality = () => {

  //specialityName validation
  const [specialityNameState, dispatch] = useReducer(specialityNameReducer, {
    value: "",
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
    value: "",
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


  /////////////////////////////////

  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const newSpecialitySubmitHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        "https://smarteduservices.com:5000/api/speciality/",
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
      setError(err.message || "SomeThing Went Wrong , Please Try Again .");
    }
    specialitTypeState.value = ''
    specialityNameState.value = ''
  };

  const errorHandler = () => {
    setError(null);
  };
  return (
    <div className='row text-center p-3 w-100 m-0'>
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && <LoadingSpinner asOverlay />}

      <div className="row p-1">
        <div className="col-3 text-center">
          <button className="back-btn p-2 px-3 fs-3 " onClick={() => { window.location.href = '/specialities' }}><TiArrowBack /> </button>
        </div>
        <h2 className="col-12 col-lg-7 text-center system-head p-3 fw-bold">  Add New Speciality</h2>
      </div>

      <form className='adduser-form bg-white p-3 row justify-content-center m-0' onSubmit={newSpecialitySubmitHandler}>

        <div className='col-12 col-lg-5 m-1 py-2 p-0'>
          <label className='col-10 col-lg-5 fw-bold add-user-p py-2'>Sub-Speciality:</label>
       <input type='text' placeholder='Speciality Type'
          value={specialityNameState.value}
          onChange={specialityNameChangeHandler}
          onBlur={specialityNameTouchHandler}
          isvalid={specialityNameState.isvalid.toString()}
          className={`col-10 col-lg-7 search p-2 ${!specialityNameState.isvalid &&
            specialityNameState.isTouched &&
            "form-control-invalid"
            }`}
        />
        </div>
        <div className='col-12 col-lg-5 m-1 py-2 p-0'>
          <label className='col-10 col-lg-5 fw-bold add-user-p py-2'>Speciality:</label>
          <input type='text' placeholder='Speciality Name'
            value={specialitTypeState.value}
            onChange={specialitTypeChangeHandler}
            onBlur={specialitTypeTouchHandler}
            isvalid={specialitTypeState.isvalid.toString()}
            className={`col-10 col-lg-7 search p-2 ${!specialitTypeState.isvalid &&
              specialitTypeState.isTouched &&
              "form-control-invalid"
              }`}
          />  
        </div>

        <div className='col-8 m-3 mt-5 row justify-content-center'>
          <button
            disabled={
              !specialitTypeState.isvalid ||
              !specialityNameState.isvalid
            }
            className='add-user-btn p-3  fw-bold col-10 col-lg-5'>
            Add
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddSpeciality
