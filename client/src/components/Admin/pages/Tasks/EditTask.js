import React, { useEffect, useReducer, useState } from "react";
import { validate, VALIDATOR_MINLENGTH } from "../../../../util/validators";
import axios from "axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";

//Title validation
const titleReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.title,
        isvalid: validate(action.title, action.validators),
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

//price validation
const priceReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.price,
        isvalid: validate(action.price, action.validators),
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

//Freelancer Price validation
const freelancerPriceReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.freelancerPrice,
        isvalid: validate(action.freelancerPrice, action.validators),
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

//channel validation
// const channelReducer = (state, action) => {
//   switch (action.type) {
//     case "CHANGE":
//       return {
//         ...state,
//         value: action.channel,
//         isvalid: validate(action.channel, action.validators),
//       };
//     case "TOUCH":
//       return {
//         ...state,
//         isTouched: true,
//       };
//     default:
//       return state;
//   }
// };

//Description validation
const descriptionReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.description,
        isvalid: validate(action.description, action.validators),
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

const EditTask = (props) => {
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const [userSpeciality, setUserSpeciality] = useState(
    props.task.speciality._id
  );
  const [currency, setCurrency] = useState(props.task.task_currency._id);
  const [deadline, setDeadline] = useState(props.task.deadline);

  const [specialities, setSpecialities] = useState([]);
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URL}:5000/api/speciality/`)
          .then((res) => {
            setSpecialities(res.data.specialities);
          });
      });
      timerId = setTimeout(async () => {
        await axios
          .get(
            `${process.env.REACT_APP_BACKEND_URL}:5000/api/currency/valid/list`
          )
          .then((res) => {
            setCurrencies(res.data.currencies);
          });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  //title validation
  const [titleState, dispatch] = useReducer(titleReducer, {
    value: props.task.title,
    isvalid: false,
    isTouched: false,
  });

  const titleChangeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      title: event.target.value,
      validators: [VALIDATOR_MINLENGTH(3)],
    });
  };
  const titleTouchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  //channel validation
  // const [channelState, dispatch4] = useReducer(channelReducer, {
  //   value: props.task.channel,
  //   isvalid: false,
  //   isTouched: false,
  // });

  // const channelChangeHandler = (event) => {
  //   dispatch4({
  //     type: "CHANGE",
  //     channel: event.target.value,
  //     validators: [VALIDATOR_MINLENGTH(3)],
  //   });
  // };
  // const channelTouchHandler = () => {
  //   dispatch4({
  //     type: "TOUCH",
  //   });
  // };

  //Description validation
  const [descriptionState, dispatch2] = useReducer(descriptionReducer, {
    value: props.task.description,
    isvalid: false,
    isTouched: false,
  });

  const descriptionChangeHandler = (event) => {
    dispatch2({
      type: "CHANGE",
      description: event.target.value,
      validators: [VALIDATOR_MINLENGTH(3)],
    });
  };
  const descriptionTouchHandler = () => {
    dispatch2({
      type: "TOUCH",
    });
  };

  //price validation
  const [priceState, dispatch5] = useReducer(priceReducer, {
    value: props.task.paid,
    isvalid: false,
    isTouched: false,
  });

  const priceChangeHandler = (event) => {
    dispatch5({
      type: "CHANGE",
      price: event.target.value,
      validators: [VALIDATOR_MINLENGTH(1)],
    });
  };
  const pricetouchHandler = () => {
    dispatch5({
      type: "TOUCH",
    });
  };

  //freelancerPrice validation
  const [freelancerPriceState, dispatch7] = useReducer(freelancerPriceReducer, {
    value: props.task.cost,
    isvalid: false,
    isTouched: false,
  });

  const freelancerPriceChangeHandler = (event) => {
    dispatch7({
      type: "CHANGE",
      freelancerPrice: event.target.value,
      validators: [VALIDATOR_MINLENGTH(1)],
    });
  };
  const freelancerPricetouchHandler = () => {
    dispatch7({
      type: "TOUCH",
    });
  };

  //Channel value
  const [channel, setChannel] = useState(props.task.channel);
  const channelChangeHandler = (newOne) => {
    setChannel(newOne);
  };

  //speciality value
  const specialityChangeHandler = (newOne) => {
    setUserSpeciality(newOne);
  };

  //currency value
  const currencyChangeHandler = (newOne) => {
    setCurrency(newOne);
  };

  // edit task handler
  const editTaskHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/task/${props.id}`,
        {
          title: titleState.value,
          channel: channel,
          description: descriptionState.value,
          speciality: userSpeciality,
          deadline: deadline,
          paid: priceState.value,
          cost: freelancerPriceState.value,
          task_currency: currency,
        },
        { headers: { Authorization: `Bearer ${props.token}` } }
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

  const errorHandler = () => {
    setError(null);
    window.location.reload(true);
  };
  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="grid grid-cols-3 gap-2">
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && <LoadingSpinner asOverlay />}
      <div className="">
        <h5 className="m-0 p-0 w-2/3 font-semibold text-base text-gray-400">
          Title
        </h5>
        <input
          type="text"
          value={titleState.value}
          onChange={titleChangeHandler}
          onBlur={titleTouchHandler}
          isvalid={titleState.isvalid.toString()}
          className={`font-medium border w-full rounded my-0 mr-0 py-2 px-0 text-center drop-shadow-sm ${
            !titleState.isvalid && titleState.isTouched && "text-red-500"
          }`}
        />
      </div>

      <div className="">
        <h5 className="m-0 p-0 w-2/3 font-semibold text-base text-gray-400">
          Speciality
        </h5>
        <select
          id="speciality"
          name="speciality"
          className="font-medium border w-full rounded my-0 mr-0 py-2 px-0 text-center drop-shadow-sm"
          value={userSpeciality}
          onChange={(event) => specialityChangeHandler(event.target.value)}
        >
          <option value="" className="text-secondary">
            Specialities
          </option>
          {specialities.map((speciality) => (
            <option value={speciality._id} key={speciality._id}>
              {speciality.sub_speciality}
            </option>
          ))}
        </select>
      </div>

      <div className="">
        <h5 className="m-0 p-0 w-2/3 font-semibold text-base text-gray-400">
          Channel
        </h5>
        <select
          id="Channel"
          name="Channel"
          className="font-medium border w-full rounded my-0 mr-0 py-2 px-0 text-center drop-shadow-sm"
          value={channel}
          onChange={(event) => channelChangeHandler(event.target.value)}
        >
          <option value="" className="text-secondary">
            Channels
          </option>
          <option value="Telegram" className="">
            Telegram
          </option>
          <option value="WhatsApp" className="">
            WhatsApp
          </option>
          <option value="Website" className="">
            Website
          </option>
          <option value="Other" className="">
            Other
          </option>
        </select>
      </div>

      <div className="">
        <h5 className="m-0 p-0 w-2/3 font-semibold text-base text-gray-400">
          Currency
        </h5>
        <select
          id="currencies"
          name="currencies"
          className="font-medium border w-full rounded my-0 mr-0 py-2 px-0 text-center drop-shadow-sm"
          value={currency}
          onChange={(event) => currencyChangeHandler(event.target.value)}
        >
          <option value="" className="text-secondary">
            currencies
          </option>
          {currencies.map((currency) => (
            <option value={currency._id} key={currency._id}>
              {currency.currencyname}
            </option>
          ))}
        </select>
      </div>

      <div className="">
        <h5 className="m-0 p-0 w-2/3 font-semibold text-base text-gray-400">
          Client Price
        </h5>
        <input
          type="number"
          value={priceState.value}
          onChange={priceChangeHandler}
          onBlur={pricetouchHandler}
          isvalid={priceState.isvalid.toString()}
          className={`font-medium border w-full rounded my-0 mr-0 py-2 px-0 text-center drop-shadow-sm ${
            !priceState.isvalid && priceState.isTouched && "text-red-500"
          }`}
        />
      </div>

      <div className="">
        <h5 className="m-0 p-0 w-2/3 font-semibold text-base text-gray-400">
          Freelancer Price
        </h5>
        <input
          type="number"
          value={freelancerPriceState.value}
          onChange={freelancerPriceChangeHandler}
          onBlur={freelancerPricetouchHandler}
          isvalid={freelancerPriceState.isvalid.toString()}
          className={`font-medium border w-full rounded my-0 mr-0 py-2 px-0 text-center drop-shadow-sm ${
            !freelancerPriceState.isvalid &&
            freelancerPriceState.isTouched &&
            "text-red-500"
          }`}
        />
      </div>

      <div className="col-span-3">
        <h5 className="m-0 p-0 w-1/4 font-semibold text-base text-gray-400">
          Dead Line
        </h5>
        <input
          type="datetime-local"
          id="meeting-time"
          name="meeting-time"
          placeholder="DeadLine"
          onChange={(e) => setDeadline(e.target.value)}
          className="font-medium border w-full rounded my-0 mr-0 py-2 px-0 text-center drop-shadow-sm"
        />
      </div>

      <div className="col-span-3">
        <h5 className="m-0 p-0 w-1/4 font-semibold text-base text-gray-400">
          Description
        </h5>
        <textarea
          type="text"
          placeholder="Description"
          rows="2"
          value={descriptionState.value}
          onChange={descriptionChangeHandler}
          onBlur={descriptionTouchHandler}
          isvalid={descriptionState.isvalid.toString()}
          className={`font-medium border w-full rounded my-0 mr-0 py-2 px-0 text-center drop-shadow-sm ${
            !descriptionState.isvalid &&
            descriptionState.isTouched &&
            "text-red-500"
          }`}
        />
      </div>

      <div className="col-span-3 flex items-center justify-center">
        <button
          disabled={
            !titleState.isvalid &&
            !channel &&
            !descriptionState.isvalid &&
            !priceState.isvalid &&
            !deadline &&
            !currency &&
            !userSpeciality &&
            !freelancerPriceState.isvalid
          }
          className="border bg-blue-500 text-white p-2.5 rounded-md font-semibold w-1/3"
          onClick={editTaskHandler}
        >
          Edit Task
        </button>
      </div>
    </div>
  );
};

export default EditTask;
