import React, { useEffect, useState } from "react";
import axios from "axios";
import GetCookie from "../../../../hooks/getCookie";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";

const Users = () => {

// const token = GetCookie("Token") ;
// const userId = JSON.parse(localStorage.getItem('UserData')) ;
const [ users, setUsers ] = useState([]);
const [loading ,setLoading] = useState(true) ;
const [isLoading ,setIsLoading] = useState(false);

// useEffect(() => {
//   let timerId;
//   if (loading) {
//     setIsLoading(true);
//     timerId = setTimeout(async () => {
//       await axios.get("https://localhost:5000/api/user/").then((res) => {
//         console.log(res)
//         setUsers(res);
//       });
//       setLoading(false);
//       setIsLoading(false);
//     });
//   }
//   return () => clearTimeout(timerId);
// }, [loading]);

  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div>
      Users
    </div>
  )
}

export default Users
