import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import { useParams } from "react-router-dom";

const UserDetails = () => {

    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    let { id } = useParams();

    useEffect(() => {
      let timerId;
      if (loading) {
        setIsLoading(true);
        timerId = setTimeout(async () => {
          await axios.get(`http://localhost:5000/api/user/${id}`).then((res) => {
            console.log(res.data.user)
            setUser(res.data.user);
          });
          setLoading(false);
          setIsLoading(false);
        });
      }
      return () => clearTimeout(timerId);
    }, [loading]);


    return  isLoading ? (
        <LoadingSpinner asOverlay />
      ) : (
        <div>
          <h1>
            {user.fullname}
          </h1>
        </div>
    )
}

export default UserDetails
