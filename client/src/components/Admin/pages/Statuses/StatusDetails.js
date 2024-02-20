import React, { useEffect, useReducer, useState } from "react";
import { validate, VALIDATOR_MINLENGTH } from "../../../../util/validators";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";

import { useParams } from "react-router-dom";
import { BiSolidEditAlt } from "react-icons/bi";
import { RiDeleteBinFill } from "react-icons/ri";
import { TiArrowBack } from "react-icons/ti";
import { ImCancelCircle } from "react-icons/im";

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

const StatusDetails = () => {
  const [edit, setEdit] = useState(false);

  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  let { id } = useParams();

  const [status, setStatus] = useState([]);
  const [Name, setName] = useState("");

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios
          .get(` http://localhost:5000/api/status/${id}`)
          .then((res) => {
            setStatus(res.data.message);
            setName(res.data.message.statusname);
          });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  const [role, setRole] = useState();
  //statusName validation
  const [statusNameState, dispatch] = useReducer(statusNameReducer, {
    value: status.statusname,
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

  //////////////////////////////////////
  const editStatusHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        ` http://localhost:5000/api/status/${status._id}`,
        {
          name: statusNameState.value,
          role: role,
        }
      );
      const responseData = await response;

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
        `  http://localhost:5000/api/status/${id}`
        //  ,
        //  { headers :{
        //     'Authorization':`Bearer ${token}`
        //   }
        // }
      );
      const responseData = await response;

      setError(responseData.data.message);
      setIsLoading(false);
      window.location.href = "/statuses";
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "SomeThing Went Wrong , Please Try Again .");
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

      <div className="row mb-4">
        <div className="col-3 text-center">
          <button
            className="back-btn p-2 px-3 fs-3 "
            onClick={() => {
              window.location.href = "/statuses";
            }}
          >
            <TiArrowBack />{" "}
          </button>
        </div>
        <h2 className="col-12 col-lg-7 text-center system-head p-2 pt-4">
          {" "}
          Status Details
        </h2>
      </div>

      <div className="row bg-white adduser-form p-1 m-1 justify-content-center">
        {status.changable ? (
          <div className="col-12 row p-3 justify-content-end ">
            <div className="col-4">
              <button
                className="delete-btn px-4 p-1 fs-3"
                onClick={deleteStatusHandler}
              >
                <RiDeleteBinFill />
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
        {/* /////////////////////// */}
        <div className="col-12 col-md-6 row p-3">
          <h3 className="col-12 col-sm-7  edit-form-lable text-start py-3">
            Status Name:
          </h3>
          <p
            className={
              !edit
                ? "d-inline col-10 col-sm-5 pt-4 edit-form-p fw-bold "
                : "d-none"
            }
          >
            {" "}
            {status.statusname}{" "}
          </p>
          <div className={edit ? "d-inline col-10 col-sm-5 pt-3 " : "d-none"}>
            <input
              type="text"
              placeholder={status.statusname}
              value={statusNameState.value}
              onChange={statusNameChangeHandler}
              onBlur={statusNameTouchHandler}
              isvalid={statusNameState.isvalid.toString()}
              className={`search w-100 p-2 ${
                !statusNameState.isvalid &&
                statusNameState.isTouched &&
                "form-control-invalid"
              }`}
            />
          </div>
        </div>
        <div className="col-12 col-md-6 row p-3">
          <h3 className="col-6  edit-form-lable text-start py-3"> Role :</h3>
          <p
            className={
              !edit ? "d-inline col-6 pt-4 edit-form-p fw-bold " : "d-none"
            }
          >
            {" "}
            {status.role}{" "}
          </p>
          <div className={edit ? "d-inline col-6 pt-3 " : "d-none"}>
            <select
              id="role"
              name="role"
              className="p-2 search col-12"
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              <option value="" className="text-secondary">
                Roles
              </option>
              <option value="admin" className="">
                Admin
              </option>
              <option value="specialistService" className="">
                SpecialistService
              </option>
              <option value="customerService" className="">
                CustomerService
              </option>
              <option value="all" className="">
                All
              </option>
            </select>
          </div>
        </div>

        {/* /////////////////////// */}

        {status.changable ? (
          <div className="col-12  p-3">
            {!edit ? (
              <button
                className="edit-user-btn p-3 col-10 col-lg-4 fw-bold"
                onClick={() => {
                  setEdit(!edit);
                }}
              >
                Edit
              </button>
            ) : (
              ""
            )}
            {edit ? (
              <>
                <button
                  disabled={!statusNameState.isvalid && !role}
                  className="edit-user-btn p-3 col-8 col-lg-4 fw-bold"
                  onClick={editStatusHandler}
                >
                  Submit
                </button>
                <button
                  className="bg-danger cancel-btn p-3 col-3 col-md-1 mx-2 fw-bold"
                  onClick={() => {
                    setEdit(!edit);
                  }}
                >
                  <ImCancelCircle className="fs-3" />
                </button>
              </>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default StatusDetails;
