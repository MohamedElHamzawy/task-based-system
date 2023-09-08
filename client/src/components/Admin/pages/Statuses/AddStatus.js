import React, { useReducer, useState } from 'react'
import { validate, VALIDATOR_MINLENGTH } from "../../../../util/validators";
import axios from "axios";
import LoadingSpinner from '../../../../LoadingSpinner/LoadingSpinner';
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";
import { TiArrowBack } from 'react-icons/ti';

//statusName validation
const statusNameReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.statusName,
        isvalid: validate(action.statusName, action.validators),
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


const AddStatus = () => {

  //statusName validation
  const [statusNameState, dispatch] = useReducer(statusNameReducer, {
    value: "",
    isvalid: false,
    isTouched: false,
  });

  const statusNameChangeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      statusName: event.target.value,
      validators: [VALIDATOR_MINLENGTH(3)],
    });
  };
  const statusNameTouchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };


  /////////////////////////////////

  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const newStatusSubmitHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        "http://localhost:5000/api/status/",
        {
          name: statusNameState.value,
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
    statusNameState.value = ''
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
          <button className="back-btn p-2 px-3 fs-3 " onClick={() => { window.location.href = '/statuses' }}><TiArrowBack /> </button>
        </div>
        <h2 className="col-12 col-lg-7 text-center system-head p-3">  Add New Status</h2>
      </div>

      <form className='adduser-form bg-white p-3 row justify-content-center m-0' onSubmit={newStatusSubmitHandler}>

        <div className='col-12 col-lg-5 m-1 py-2 p-0'>
          <label className='col-10 col-lg-5 fw-bold add-user-p'>status Name:</label>
       <input type='text' placeholder='status Name'
          value={statusNameState.value}
          onChange={statusNameChangeHandler}
          onBlur={statusNameTouchHandler}
          isvalid={statusNameState.isvalid.toString()}
          className={`col-10 col-lg-7 search p-2 ${!statusNameState.isvalid &&
            statusNameState.isTouched &&
            "form-control-invalid"
            }`}
        />
        </div>

        <div className='col-8 m-3 mt-5 row justify-content-center'>
          <button
            disabled={
              !statusNameState.isvalid
            }
            className='add-user-btn p-3  fw-bold col-10 col-lg-5'>
            Add
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddStatus
