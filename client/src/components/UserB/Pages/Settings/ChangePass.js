import React, { useReducer, useState } from 'react'
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";
import './Settings.css'
import { validate, VALIDATOR_MINLENGTH } from "../../../../util/validators";


//password validation
const passwordReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE":
        return {
          ...state,
          value: action.password,
          isvalid: validate(action.password, action.validators),
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

const ChangePass = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const userID = JSON.parse(localStorage.getItem('UserBData'));

  //password validation
  const [passwordState, dispatch3] = useReducer(passwordReducer, {
    value: "",
    isvalid: false,
    isTouched: false,
  });

  const passwordChangeHandler = (event) => {
    dispatch3({
      type: "CHANGE",
      password: event.target.value,
      validators: [VALIDATOR_MINLENGTH(6)],
    });
  };
  const passwordTouchHandler = () => {
    dispatch3({
      type: "TOUCH",
    });
  };

  //////////////////////////////////////
  const editUserHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        ` http://localhost:5000/api/user/password/${userID}`,
        {
          password: passwordState.value,
        }
      );
      const responseData = await response;
      console.log(responseData)
      if (!(response.statusText === "OK")) {
        throw new Error(responseData.data.message);
      }
      setError(responseData.data.message);
      setIsLoading(false);
      window.location.href = '/settings';
    } catch (err) {
      setIsLoading(false);
      setError(err.message && "SomeThing Went Wrong , Please Try Again .");
    }
  };


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

      <div className="col-12 row text-center system-head p-2">
        <div className="col-12 col-sm-10 col-md-6 ">
          <h1 className='logo text-white bg-danger p-2'>Specialist Service</h1>
        </div>
        <h1 className="col-12 text-center fw-bold">Change Password</h1>
      </div>
      
      <div className="row bg-dark m-1 adduser-form p-1 py-5 justify-content-center">


        <div className="col-12 col-xl-6 row p-2 ">
          <h3 className="col-8 col-md-5  settings-form-lable text-start"> Password :</h3>

          <div className="d-inline col-12 col-md-7 "  >
            <input type='password' placeholder='Enter New Password'
                value={passwordState.value}
                onChange={passwordChangeHandler}
                onBlur={passwordTouchHandler}
                isvalid={passwordState.isvalid.toString()}
                className={`col-12 col-md-10  search p-2 ${!passwordState.isvalid &&
                passwordState.isTouched &&
                "form-control-invalid"
                }`}
            />
          </div>
        </div>

        <div className="col-12  p-3">
          <button
            disabled={
              !passwordState.isvalid
            }
            className="settings-edit-user-btn p-3 col-8 col-lg-2 fw-bold" onClick={editUserHandler}>
            Change
          </button>
        </div>

    
      </div>
    </div>
  )
}

export default ChangePass
