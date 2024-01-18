import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";
import GetCookie from "../../../../hooks/getCookie";
import { MdOutlineNotificationsActive } from "react-icons/md";
import NotificationCard from "./Notification";

const Notifications = () => {
  const token = GetCookie("UserA");

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URL}:5000/api/note/`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            setNotifications(res.data.notes);
          });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  //error message
  const errorHandler = () => {
    setError(null);
    window.location.reload(true);
  };

  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="justify-center min-h-[calc(100vh-100px)]">
      <ErrorModal error={error} onClear={errorHandler} />
      <div className="flex justify-center items-center my-8">
        <MdOutlineNotificationsActive className="text-3xl mr-2" />
        <h1 className="text-2xl m-0 p-0">Notifications</h1>
        {/* <div className="">FILTERS</div> */}
      </div>

      {notifications.length === 0 ? (
        <div className="flex justify-center items-center">
          <h1 className="text-2xl">No Notifications</h1>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification._id}
              content={notification.content}
              createdAt={notification.createdAt}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
