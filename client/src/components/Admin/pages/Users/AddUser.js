import React, { useEffect, useReducer, useState } from 'react'
import { validate, VALIDATOR_MINLENGTH } from "../../../../util/validators";
import axios from "axios";
import LoadingSpinner from '../../../../LoadingSpinner/LoadingSpinner';
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";
import { TiArrowBack } from 'react-icons/ti';

//userName validation
const userNameReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.userName,
        isvalid: validate(action.userName, action.validators),
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
//password validation
const passwordReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.password,
        isvalid: validate(action.password, action.validators),
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


const AddUser = () => {

  const [specialities, setSpecialities] = useState([]);
  const [countries, setCountries] = useState([]);
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
        await axios.get("http://localhost:5000/api/country/").then((res) => {
          setCountries(res.data.countries);
          console.log(res.data)
        });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);
  
  console.log(countries)

  //userName validation
  const [userNameState, dispatch] = useReducer(userNameReducer, {
    value: "",
    isvalid: false,
    isTouched: false,
  });

  const userNameChangeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      userName: event.target.value,
      validators: [VALIDATOR_MINLENGTH(3)],
    });
  };
  const userNameTouchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

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

  //password validation
  const [passwordState, dispatch3] = useReducer(passwordReducer, {
    value: "",
    isvalid: false,
    isTouched: false,
  });

  const passwordChangeHandler = (event) => {
    dispatch3({
      type: "CHANGE",
      password: event.target.value,
      validators: [VALIDATOR_MINLENGTH(3)],
    });
  };
  const passwordTouchHandler = () => {
    dispatch3({
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

  const [visable, setVisable] = useState(false);

  //Role value
  const [role, setRole] = useState('');
  const RoleChangeHandler = (newOne) => {
    setRole(newOne);
    if (newOne == 'specialistService') {
      setVisable(true)
    } else {
      setVisable(false)
    }
  };

  //speciality value
  const [speciality, setSpeciality] = useState('');

  const specialityChangeHandler = (newOne) => {
    setSpeciality(newOne);
  };

  //country value
  const [country, setCountry] = useState('');
  const countryChangeHandler = (newOne) => {
    setCountry(newOne);
  };

  /////////////////////////////////

  const newUserSubmitHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        "http://localhost:5000/api/user/",
        {
          fullName: fullNameState.value,
          userName: userNameState.value,
          password: passwordState.value,
          userRole: role,
          speciality: speciality,
          userType:speciality,
          country: country,
          phone: numberState.value,
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
    userNameState.value = ''
    passwordState.value = ''
    numberState.value = ''
    setRole('')
    setSpeciality('')
    setCountry('')
  };

  const errorHandler = () => {
    setError(null);
  };

  const uniqueItems = specialities.filter((item,index,self)=>{
    return index === self.findIndex((i)=>(
      i.speciality === item.speciality
    ))
  })
  return (
    <div className='row text-center p-3 w-100 m-0'>
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && <LoadingSpinner asOverlay />}

      <div className="row p-1">
        <div className="col-3 text-center">
          <button className="back-btn p-2 px-3 fs-3 " onClick={() => { window.location.href = '/' }}><TiArrowBack /> </button>
        </div>
        <h2 className="col-9 col-lg-7 text-center system-head  fw-bold">  Add New User</h2>
      </div>

      <form className='adduser-form bg-white p-3 row justify-content-center m-0' onSubmit={newUserSubmitHandler}>

        <div className='col-12 col-lg-5 m-1 py-2 p-0'>
          <label className='col-10 col-lg-5 fw-bold add-user-p'>Full Name:</label>
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
          <label className='col-10 col-lg-5 fw-bold add-user-p'>User Name:</label>
          <input type='text' placeholder='User Name'
            value={userNameState.value}
            onChange={userNameChangeHandler}
            onBlur={userNameTouchHandler}
            isvalid={userNameState.isvalid.toString()}
            className={`col-10 col-lg-7 search p-2 ${!userNameState.isvalid &&
              userNameState.isTouched &&
              "form-control-invalid"
              }`}
          />
        </div>

        <div className='col-12 col-lg-5 m-1 py-2 p-0'>
          <label className='col-10 col-lg-5 fw-bold add-user-p'>Password :</label>
          <input type='password' placeholder='Password'
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={passwordTouchHandler}
            isvalid={passwordState.isvalid.toString()}
            className={`col-10 col-lg-7 search p-2 ${!passwordState.isvalid &&
              passwordState.isTouched &&
              "form-control-invalid"
              }`}
          />
        </div>

        <div className='col-12 col-lg-5 m-1 py-2 p-0'>
          <label className='col-10 col-lg-5 fw-bold add-user-p'>Country:</label>
          <select id="country" name="country" className="p-2 px-4 search col-10 col-lg-7" value={country}
            onChange={(event) => countryChangeHandler(event.target.value)}>
            <option value="" className='text-secondary'>Countries</option>
            {countries.map((country) => (
              <option value={country._id} key={country._id}>{country.counrtyname}</option>
            ))}
          </select>
        </div>

        <div className='col-12 col-lg-5 m-1 py-2 p-0'>
          <label htmlFor="role" className=" col-10 col-lg-5 fw-bold add-user-p"> Role:</label>
          <select id="role" name="role" className="p-2 px-4 search col-10 col-lg-7" value={role}
            onChange={(event) => RoleChangeHandler(event.target.value)}>
            <option value="" className='text-secondary'>Roles</option>
            <option value="admin">Admin</option>
            <option value="customerService">Customer Service</option>
            <option value="specialistService">Specialist Service</option>
          </select>
        </div>

        <div className={visable ? 'd-block col-12 col-lg-5 m-1 py-2 p-0' : 'd-none'}>
          <label htmlFor="speciality" className="col-10 col-lg-5 fw-bold add-user-p"> Speciality:</label>

          <select id="speciality" name="speciality" className="p-2 px-4 search col-10 col-lg-7" value={speciality}
            onChange={(event) => specialityChangeHandler(event.target.value)}>
            <option value="" className='text-secondary'>Specialities</option>
            {uniqueItems.map((speciality) => (
              <option value={speciality._id} key={speciality._id}>{speciality.speciality}</option>
            ))}
          </select>

        </div>

        <div className='col-12 col-lg-5 m-1 py-2 p-0'>
          <label className='col-10 col-lg-5 fw-bold add-user-p'>Phone :</label>
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
            disabled={!visable ?
              !fullNameState.isvalid ||
              !userNameState.isvalid ||
              !passwordState.isvalid ||
              !numberState.isvalid ||
              !country ||
              !role
              :
              !fullNameState.isvalid ||
              !userNameState.isvalid ||
              !passwordState.isvalid ||
              !country ||
              !numberState.isvalid ||
              !role ||
              !speciality
            }
            className='add-user-btn p-3  fw-bold col-10 col-lg-5'>
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddUser
