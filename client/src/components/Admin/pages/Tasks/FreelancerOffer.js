import axios from 'axios';
import React, { useEffect, useState, useReducer } from 'react'
import { validate, VALIDATOR_MINLENGTH } from "../../../../util/validators";
import GetCookie from '../../../../hooks/getCookie';
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";

//Cost validation
const costReducer = (state, action) => {
    switch (action.type) {
        case "CHANGE":
            return {
                ...state,
                value: action.cost,
                isvalid: validate(action.cost, action.validators),
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

const FreelancerOffer = (props) => {
    const [freeLancers, setFreeLancers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    const [freeLancer, setFreeLancer] = useState('');

    const token = GetCookie("AdminToken")


    useEffect(() => {
        let timerId;
        if (loading) {
            setIsLoading(true);
            timerId = setTimeout(async () => {
                await axios.get("http://localhost:5000/api/freelancer/").then((res) => {
                    setFreeLancers(res.data.freelancers);
                });
                setLoading(false);
                setIsLoading(false);
            });
        }
        return () => clearTimeout(timerId);
    }, [loading]);

    //Cost validation
    const [costState, dispatch] = useReducer(costReducer, {
        value: "",
        isvalid: false,
        isTouched: false,
    });

    const costChangeHandler = (event) => {
        dispatch({
            type: "CHANGE",
            cost: event.target.value,
            validators: [VALIDATOR_MINLENGTH(1)],
        });
    };
    const costTouchHandler = () => {
        dispatch({
            type: "TOUCH",
        });
    };

    const freeLancerOffer = async (event) => {
        event.preventDefault();
        // send api request to validate data
        setIsLoading(true);
        try {
            setError(null);
            const response = await axios.post(
                `http://localhost:5000/api/task/addOffer/${props.id}`,
                {
                    freelancer: freeLancer,
                    cost: costState.value
                },
                { headers: { Authorization: `Bearer ${token}` } }
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
        <div className='row text-center justify-content-center'>
            <ErrorModal error={error} onClear={errorHandler} />

            <div className='col-12 col-lg-5 m-1 py-2 p-0'>
                <label className='col-10 col-lg-5 fw-bold add-user-p py-2'>Freelancer :</label>
                <select id="Freelancer" name="Freelancer" className="search col-10 col-lg-7 p-2" value={freeLancer}
                    onChange={(e) => { setFreeLancer(e.target.value); }}>
                    <option value="" className='text-secondary'>Freelancers</option>
                    {freeLancers && freeLancers.map((freeLancer) => (
                        <option value={freeLancer._id} key={freeLancer._id}>{freeLancer.freelancername}</option>
                    ))}
                </select>
            </div>
            <div className='col-12 col-lg-5 m-1 py-2 p-0'>
                <label className='col-10 col-lg-5 fw-bold add-user-p py-2'>Cost :</label>
                <input type='number' placeholder='Task Price '
                    value={costState.value}
                    onChange={costChangeHandler}
                    onBlur={costTouchHandler}
                    isvalid={costState.isvalid.toString()}
                    className={`col-10 col-lg-7 search p-2 ${!costState.isvalid &&
                        costState.isTouched &&
                        "form-control-invalid"
                        }`}
                />
            </div>

            <div className="col-12 col-sm-8  p-3">
                <button
                    disabled={
                        !freeLancer &&
                        !costState.value
                    }
                    className="edit-user-btn p-3 col-10 col-lg-4 fw-bold"
                    onClick={freeLancerOffer}
                >
                    Add Offer
                </button>
            </div>

        </div>
    )
}

export default FreelancerOffer
