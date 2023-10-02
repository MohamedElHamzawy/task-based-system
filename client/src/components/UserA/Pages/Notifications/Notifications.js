import React, { useEffect, useState } from 'react'
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import './Notifications.css'
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";
import GetCookie from "../../../../hooks/getCookie";
import { MdOutlineNotificationsActive} from 'react-icons/md';

const Notifications = () => {
    const token = GetCookie("UserA")

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
                await axios.get(" http://localhost:5000/api/note/",
                    { headers: { Authorization: `Bearer ${token}` } }
                ).then((res) => {
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
        <div className='row justify-content-center w-100 p-0 m-0'>
            <ErrorModal error={error} onClear={errorHandler} />
            <div className='row notes-component col-12 col-md-10 row bg-white adduser-form p-1 m-1 justify-content-center'>
                <div>
                    <h1 className='edit-form-lable p-4 fw-bold text-center '>
                        <MdOutlineNotificationsActive className=''/>Notifications</h1>
                    <div className='row p-0 m-0'>
                        <div className='p-0 m-0 row justify-content-center'>
                            {!notifications.length == 0 ? notifications.map((note) => (
                                <div className='col-11 col-md-5 col-lg-3 note m-2 fw-bold p-3 text-start' key={note._id}>
                                    <p className=''>{note.content.split('GMT')[0]}</p>
                                </div>
                            )) :
                                <div className='col-12 note my-2 fw-bold p-3 '>
                                    <p className=''>There Is No Notes </p>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Notifications
