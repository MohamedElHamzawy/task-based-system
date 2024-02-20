import axios from "axios";
import React, { useEffect, useState, useReducer } from "react";
import { validate, VALIDATOR_MINLENGTH } from "../../../../util/validators";
import GetCookie from "../../../../hooks/getCookie";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";

//Paid validation
const paidReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.paid,
        isvalid: validate(action.paid, action.validators),
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

const Paid = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const token = GetCookie("UserA");

  //paid validation
  const [paidState, dispatch] = useReducer(paidReducer, {
    value: "",
    isvalid: false,
    isTouched: false,
  });

  const paidChangeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      paid: event.target.value,
      validators: [VALIDATOR_MINLENGTH(1)],
    });
  };
  const paidTouchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  //put Paid Handler
  const putPaidHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        ` http://localhost:5000/api/task/partial/${props.id}`,
        {
          statusID: props.statusID,
          paid: paidState.value,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const responseData = await response;

      if (!(response.statusText === "OK")) {
        throw new Error(responseData.data.msg);
      }
      setError(responseData.data.msg);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err.msg && "SomeThing Went Wrong , Please Try Again .");
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
    <div className="row text-center justify-content-center py-4 col-12">
      <ErrorModal error={error} onClear={errorHandler} />

      <div className="row col-12  py-2 p-0 justify-content-center">
        <h5 className="col-12 col-lg-5 fw-bold add-user-p py-2 ">
          Task Price :
        </h5>
        <input
          type="number"
          placeholder="Task Price"
          value={paidState.value}
          onChange={paidChangeHandler}
          onBlur={paidTouchHandler}
          isvalid={paidState.isvalid.toString()}
          className={`col-10 col-lg-5 search p-2 ${
            !paidState.isvalid && paidState.isTouched && "form-control-invalid"
          }`}
        />
      </div>

      <div className="col-12 col-sm-8  p-3">
        <button
          disabled={!paidState.value}
          className="edit-user-btn p-3 col-10 col-lg-4 fw-bold"
          onClick={putPaidHandler}
        >
          Add Offer
        </button>
      </div>
    </div>
  );
};

export default Paid;
