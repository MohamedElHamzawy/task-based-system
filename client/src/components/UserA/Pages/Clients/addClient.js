import React, { useReducer, useState } from 'react'
import { validate, VALIDATOR_EMAIL, VALIDATOR_MINLENGTH } from "../../../../util/validators";
import axios from "axios";
import LoadingSpinner from '../../../../LoadingSpinner/LoadingSpinner';
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";
import { TiArrowBack } from 'react-icons/ti';

//clientName validation
const clientNameReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.clientName,
        isvalid: validate(action.clientName, action.validators),
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
//clientEmail validation
const clientEmailReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.clientEmail,
        isvalid: validate(action.clientEmail, action.validators),
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
//country validation
const countryReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE":
        return {
          ...state,
          value: action.country,
          isvalid: validate(action.country, action.validators),
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
  //city validation
const cityReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.city,
        isvalid: validate(action.city, action.validators),
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
  
//number validation
const numberReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE":
        return {
          ...state,
          value: action.number,
          isvalid: validate(action.number, action.validators),
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


const AddClient = () => {

  //clientName validation
  const [clientNameState, dispatch] = useReducer(clientNameReducer, {
    value: "",
    isvalid: false,
    isTouched: false,
  });

  const clientNameChangeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      clientName: event.target.value,
      validators: [VALIDATOR_MINLENGTH(3)],
    });
  };
  const clientNameTouchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  //clientEmail validation
  const [clientEmailState, dispatch2] = useReducer(clientEmailReducer, {
    value: "",
    isvalid: false,
    isTouched: false,
  });

  const clientEmailChangeHandler = (event) => {
    dispatch2({
      type: "CHANGE",
      clientEmail: event.target.value,
      validators: [VALIDATOR_EMAIL()],
    });
  };
  const clientEmailTouchHandler = () => {
    dispatch2({
      type: "TOUCH",
    });
  };

 //country validation
 const [countryState, dispatch4] = useReducer(countryReducer, {
    value: "",
    isvalid: false,
    isTouched: false,
  });

  const countryChangeHandler = (event) => {
    dispatch4({
      type: "CHANGE",
      country: event.target.value,
      validators: [VALIDATOR_MINLENGTH(3)],
    });
  };
  const countryTouchHandler = () => {
    dispatch4({
      type: "TOUCH",
    });
  };

   //city validation
 const [cityState, dispatch6] = useReducer(cityReducer, {
  value: "",
  isvalid: false,
  isTouched: false,
});

const cityChangeHandler = (event) => {
  dispatch6({
    type: "CHANGE",
    city: event.target.value,
    validators: [VALIDATOR_MINLENGTH(3)],
  });
};
const cityTouchHandler = () => {
  dispatch6({
    type: "TOUCH",
  });
};

    //Number validation
    const [numberState, dispatch5] = useReducer(numberReducer, {
        value: "",
        isvalid: false,
        isTouched: false,
      });
    
      const numberChangeHandler = (event) => {
        dispatch5({
          type: "CHANGE",
          number: event.target.value,
          validators: [VALIDATOR_MINLENGTH(11)],
        });
      };
      const numbertouchHandler = () => {
        dispatch5({
          type: "TOUCH",
        });
      };

  /////////////////////////////////

  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const newSpecialitySubmitHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        "http://localhost:5000/api/client/",
        {
            clientName: clientNameState.value,
            email: clientEmailState.value,
            country: countryState.value,
            phone: numberState.value,
            city: cityState.value
        }
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
      setError(err.message || "SomeThing Went Wrong , Please Try Again .");
    }
    clientEmailState.value = ''
    clientNameState.value = ''
    countryState.value = ''
    numberState.value = ''
    cityState.value = ''

  };

  const errorHandler = () => {
    setError(null);
  };
  return (
    <div className='row text-center p-3 w-100 m-0'>
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && <LoadingSpinner asOverlay />}

      <div className="row p-1">
        <div className="col-3 text-center">
          <button className="back-btn p-2 px-3 fs-3 " onClick={() => { window.location.href = '/clients' }}><TiArrowBack /> </button>
        </div>
        <h2 className="col-12 col-lg-7 text-center system-head p-3">  Add New Client</h2>
      </div>

      <form className='adduser-form bg-white p-3 row justify-content-center m-0' onSubmit={newSpecialitySubmitHandler}>

        <div className='col-12 col-lg-5 m-1 py-2 p-0'>
          <label className='col-10 col-lg-5 fw-bold add-user-p py-2'>Client Name:</label>
       <input type='text' placeholder='Client Name'
          value={clientNameState.value}
          onChange={clientNameChangeHandler}
          onBlur={clientNameTouchHandler}
          isvalid={clientNameState.isvalid.toString()}
          className={`col-10 col-lg-7 search p-2 ${!clientNameState.isvalid &&
            clientNameState.isTouched &&
            "form-control-invalid"
            }`}
        />
        </div>
        <div className='col-12 col-lg-5 m-1 py-2 p-0'>
          <label className='col-10 col-lg-5 fw-bold add-user-p py-2'>Client Email:</label>
          <input type='email' placeholder='Client Email'
            value={clientEmailState.value}
            onChange={clientEmailChangeHandler}
            onBlur={clientEmailTouchHandler}
            isvalid={clientEmailState.isvalid.toString()}
            className={`col-10 col-lg-7 search p-2 ${!clientEmailState.isvalid &&
              clientEmailState.isTouched &&
              "form-control-invalid"
              }`}
          />  
        </div>
        
        <div className='col-12 col-lg-5 m-1 py-2 p-0'>
          <label className='col-10 col-lg-5 fw-bold add-user-p py-2'>Country:</label>
          <input type='text' placeholder='Country'
            value={countryState.value}
            onChange={countryChangeHandler}
            onBlur={countryTouchHandler}
            isvalid={countryState.isvalid.toString()}
            className={`col-10 col-lg-7 search p-2 ${!countryState.isvalid &&
              countryState.isTouched &&
              "form-control-invalid"
              }`}
          />
        </div>

        <div className='col-12 col-lg-5 m-1 py-2 p-0'>
          <label className='col-10 col-lg-5 fw-bold add-user-p py-2'>City:</label>
          <input type='text' placeholder='city'
            value={cityState.value}
            onChange={cityChangeHandler}
            onBlur={cityTouchHandler}
            isvalid={cityState.isvalid.toString()}
            className={`col-10 col-lg-7 search p-2 ${!cityState.isvalid &&
              cityState.isTouched &&
              "form-control-invalid"
              }`}
          />
        </div>

        <div className='col-12 col-lg-5 m-1 py-2 p-0'>
          <label className='col-10 col-lg-5 fw-bold add-user-p py-2'>Phone :</label>
          <input type='number' placeholder='Phone Number'
            value={numberState.value}
            onChange={numberChangeHandler}
            onBlur={numbertouchHandler}
            isvalid={numberState.isvalid.toString()}
            className={`col-10 col-lg-7 search p-2 ${!numberState.isvalid &&
              numberState.isTouched &&
              "form-control-invalid"
              }`}
          />
        </div>

        <div className='col-8 m-3 mt-5 row justify-content-center'>
          <button
            disabled={
              !clientEmailState.isvalid ||
              !clientNameState.isvalid ||
              !numberState.isvalid ||
              !countryState.isvalid ||
              !cityState.isvalid

            }
            className='add-user-btn p-3  fw-bold col-10 col-lg-5'>
            Add
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddClient
