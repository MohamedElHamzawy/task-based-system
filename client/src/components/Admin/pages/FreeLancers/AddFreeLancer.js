import React, { useEffect, useReducer, useState } from 'react'
import { validate, VALIDATOR_EMAIL, VALIDATOR_MINLENGTH } from "../../../../util/validators";
import axios from "axios";
import LoadingSpinner from '../../../../LoadingSpinner/LoadingSpinner';
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";
import { TiArrowBack } from 'react-icons/ti';


//fullName validation
const fullNameReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.fullName,
        isvalid: validate(action.fullName, action.validators),
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
//email validation
const emailReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.email,
        isvalid: validate(action.email, action.validators),
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


const AddFreeLancer = () => {

  const [currencies, setCurrencies] = useState([]);
  const [countries, setCountries] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios.get("http://localhost:5000/api/speciality/").then((res) => {
          setSpecialities(res.data.specialities);
        });
        setLoading(false);
        setIsLoading(false);
      });
      timerId = setTimeout(async () => {
        await axios.get("http://localhost:5000/api/currency/").then((res) => {
          setCurrencies(res.data.currencies);
        });
        setLoading(false);
        setIsLoading(false);
      });
      timerId = setTimeout(async () => {
        await axios.get("http://localhost:5000/api/country/").then((res) => {
          setCountries(res.data.countries);
        });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);
  console.log(countries)

  //currency value
  const [currency, setCurrency] = useState('');
  const currencyChangeHandler = (newOne) => {
    setCurrency(newOne);
  };
  //speciality value
  const [speciality, setSpeciality] = useState('');
  
  //fullName validation
  const [fullNameState, dispatch2] = useReducer(fullNameReducer, {
    value: "",
    isvalid: false,
    isTouched: false,
  });

  const fullNameChangeHandler = (event) => {
    dispatch2({
      type: "CHANGE",
      fullName: event.target.value,
      validators: [VALIDATOR_MINLENGTH(3)],
    });
  };
  const fullNameTouchHandler = () => {
    dispatch2({
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

  //email validation
  const [emailState, dispatch7] = useReducer(emailReducer, {
    value: "",
    isvalid: false,
    isTouched: false,
  });

  const emailChangeHandler = (event) => {
    dispatch7({
      type: "CHANGE",
      email: event.target.value,
      validators: [VALIDATOR_EMAIL()],
    });
  };
  const emailTouchHandler = () => {
    dispatch7({
      type: "TOUCH",
    });
  };


  //country value
  const [country, setCountry] = useState('');
  const countryChangeHandler = (newOne) => {
    setCountry(newOne);
  };

  /////////////////////////////////

  const newFreeLancerSubmitHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        "http://localhost:5000/api/freelancer/",
        {
          name: fullNameState.value,
          speciality: speciality,
          phone: numberState.value,
          email: emailState.value,
          country: country,
          currency : currency ,
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
    fullNameState.value = ''
    numberState.value = ''
    emailState.value = ''
    setCountry('')
    setSpeciality('')
    setCurrency('')
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
          <button className="back-btn p-2 px-3 fs-3 " onClick={() => { window.location.href = '/freelancers' }}><TiArrowBack /> </button>
        </div>
        <h2 className="col-12 col-lg-7 text-center system-head py-4  fw-bold">  Add New FreeLancer</h2>
      </div>

      <form className='adduser-form bg-white p-3 row justify-content-center m-0' onSubmit={newFreeLancerSubmitHandler}>

        <div className='col-12 col-lg-5 m-1 py-2 p-0'>
          <label className='col-10 col-lg-5 fw-bold add-user-p py-2'> Name:</label>
          <input type='text' placeholder='Full Name'
            value={fullNameState.value}
            onChange={fullNameChangeHandler}
            onBlur={fullNameTouchHandler}
            isvalid={fullNameState.isvalid.toString()}
            className={`col-10 col-lg-7 search p-2 ${!fullNameState.isvalid &&
              fullNameState.isTouched &&
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

        <div className='col-12 col-lg-5 m-1 py-2 p-0'>
          <label className='col-10 col-lg-5 fw-bold add-user-p py-2'>Email:</label>
          <input type='email' placeholder='Email'
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={emailTouchHandler}
            isvalid={emailState.isvalid.toString()}
            className={`col-10 col-lg-7 search p-2 ${!emailState.isvalid &&
              emailState.isTouched &&
              "form-control-invalid"
              }`}
          />
        </div>

        <div className='col-12 col-lg-5 m-1 py-2 p-0'>
          <label className='col-10 col-lg-5 fw-bold add-user-p py-2'>Country:</label>
          <select id="country" name="country" className="p-2 px-4 search col-10 col-lg-7" value={country}
            onChange={(event) => countryChangeHandler(event.target.value)}>
            <option value="" className='text-secondary'>Countries</option>
            {countries.map((country) => (
              <option value={country._id} key={country._id}>{country.counrtyname}</option>
            ))}
          </select>
        </div>

        <div className='d-block col-12 col-lg-5 m-1 py-2 p-0'>
          <label htmlFor="currency" className="col-10 col-lg-5 fw-bold add-user-p py-2"> Currency:</label>

          <select id="currencies" name="currencies" className="p-2 px-4 search col-10 col-lg-7" value={currency}
            onChange={(event) => currencyChangeHandler(event.target.value)}>
            <option value="" className='text-secondary'>currencies</option>
            {currencies.map((currency) => (
              <option value={currency._id} key={currency._id}>{currency.currencyname}</option>
            ))}
          </select>

        </div>

        <div className='d-block col-12 col-lg-5 m-1 py-2 p-0'>
          <label htmlFor="speciality" className="col-10 col-lg-5 fw-bold add-user-p py-2"> Speciality:</label>
          <select  className="px-4 p-2 search col-10 col-lg-7 "
            onChange={(event) => setSpeciality(event.target.value)}>
            <option value="" className='text-secondary'>Specialities</option>
            {specialities.map((speciality) => (
              <option value={speciality._id} key={speciality._id}>{speciality.sub_speciality}</option>
            ))}
          </select>
        </div>


        <div className='col-8 m-3 mt-5 row justify-content-center'>
          <button
            disabled={
              !fullNameState.isvalid ||
              !numberState.isvalid ||
              !emailState.isvalid ||
              !country ||
              !speciality||
              !currency
            }
            className='add-user-btn p-3  fw-bold col-10 col-lg-5'>
            Add
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddFreeLancer
