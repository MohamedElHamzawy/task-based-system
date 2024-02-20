import axios from "axios";
import React, { useEffect, useState, useReducer } from "react";
import { validate, VALIDATOR_MINLENGTH } from "../../../../util/validators";
import GetCookie from "../../../../hooks/getCookie";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";

const ShareWith = (props) => {
  const token = GetCookie("AdminToken");
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios
          .get(" http://localhost:5000/api/user/specialistService")
          .then((res) => {
            setUsers(res.data.users);
          });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  //user value
  const [user, setUser] = useState("");
  const userChangeHandler = (newOne) => {
    setUser(newOne);
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
          shareWith: user,
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
        <label
          htmlFor="user"
          className="col-10 col-lg-5 fw-bold add-user-p py-2"
        >
          {" "}
          Share With:
        </label>

        <select
          id="user"
          name="user"
          className="p-2 px-4 search col-10 col-lg-7"
          value={user}
          onChange={(event) => userChangeHandler(event.target.value)}
        >
          <option value="" className="text-secondary">
            SpecialistService
          </option>
          {users.map((user) => (
            <option value={user._id} key={user._id}>
              {user.username}
            </option>
          ))}
        </select>
      </div>

      <div className="col-12 col-sm-8  p-3">
        <button
          className="edit-user-btn p-3 col-10 col-lg-4 fw-bold"
          onClick={putPaidHandler}
        >
          Share With
        </button>
      </div>
    </div>
  );
};

export default ShareWith;
