import './Transactions.css'
import React, { useEffect, useReducer, useState } from 'react'
import { validate, VALIDATOR_MINLENGTH } from "../../../../util/validators";
import axios from "axios";
import LoadingSpinner from '../../../../LoadingSpinner/LoadingSpinner';
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";
import { TiArrowBack } from 'react-icons/ti';
import Select from 'react-select'

//amount validation
const amountReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.amount,
        isvalid: validate(action.amount, action.validators),
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

const Transactions = () => {
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [method ,setMethod] = useState('')
    const [accounts, setAccounts] = useState([]);
    const [account, setAccount] = useState('');

    useEffect(() => {
        let timerId;
        if (loading) {
          setIsLoading(true);
          timerId = setTimeout(async () => {
            await axios.get(" https://smarteduservices.com:5000/api/account/").then((res) => {
              setAccounts(res.data.accounts);
               
            });
            setLoading(false);
            setIsLoading(false);
          });
        }
        return () => clearTimeout(timerId);
      }, [loading]);

  //amount validation
  const [amountState, dispatch] = useReducer(amountReducer, {
    value: "",
    isvalid: false,
    isTouched: false,
  });

  const amountChangeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      amount: event.target.value,
      validators: [VALIDATOR_MINLENGTH(1)],
    });
  };
  const amountTouchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  //number validation
  const [numberState, dispatch2] = useReducer(numberReducer, {
    value: "",
    isvalid: false,
    isTouched: false,
  });

  const numberChangeHandler = (event) => {
    dispatch2({
      type: "CHANGE",
      number: event.target.value,
      validators: [VALIDATOR_MINLENGTH(3)],
    });
  };
  const numberTouchHandler = () => {
    dispatch2({
      type: "TOUCH",
    });
  };
//////////////////////////////

const handleChange =(selectedOption)=>{
  setAccount(selectedOption.value);
}

  /////////////////////////////////


  const newTransactionSubmitHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        " https://smarteduservices.com:5000/api/transaction/",
        {
          amount: amountState.value,
          method : method,
          account_id :account,
          accountNumber : numberState.value
        }
      );

      const responseData = await response;
       
      if (!(response.statusText === "OK")) {
        throw new Error(responseData.data.message);
      }
      setError(responseData.data.message);
      setIsLoading(false);

    } catch (err) {
      setIsLoading(false);
      setError(err.message || "SomeThing Went Wrong , Please Try Again .");
    }
    amountState.value = ''
    setAccount('')
    setMethod('')
  };

  const errorHandler = () => {
    setError(null);
  };
  return (
    <div className='row text-center p-3 w-100 m-0'>
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && <LoadingSpinner asOverlay />}

      <div className="row p-1">
        <h2 className="col-12 text-center system-head p-3  fw-bold">  Add Transaction </h2>
      </div>

      <form className='adduser-form bg-white p-3 row justify-content-center m-0' onSubmit={newTransactionSubmitHandler}>

        <div className='col-12 col-lg-5 m-1 py-2 p-0'>
          <label className='col-10 col-lg-5 fw-bold add-user-p'>Amount:</label>
       <input type='number' placeholder='Amount'
          value={amountState.value}
          onChange={amountChangeHandler}
          onBlur={amountTouchHandler}
          isvalid={amountState.isvalid.toString()}
          className={`col-10 col-lg-7 search p-2 ${!amountState.isvalid &&
            amountState.isTouched &&
            "form-control-invalid"
            }`}
        />
        </div>

        <div className='col-12 col-lg-5 m-1 py-2 p-0'>
          <label className='col-10 col-lg-5 fw-bold add-user-p'>method :</label>
          <select id="Method" name="Method" className="p-2 px-4 search col-10 col-lg-7" value={method}
            onChange={(event) => setMethod(event.target.value)}>
            <option value="" className='text-secondary'>Methods</option>
            <option value="VodafoneCash" className=''>VodafoneCash</option>
            <option value="Visa" className=''>Visa</option>      
          </select>
        </div>

        <div className='col-12 col-lg-5 m-1 py-2 p-0'>
          <label className='col-10 col-lg-5 fw-bold add-user-p'>Account Number :</label>
          <input type='text' placeholder='Account Number'
            value={numberState.value}
            onChange={numberChangeHandler}
            onBlur={numberTouchHandler}
            isvalid={numberState.isvalid.toString()}
            className={`col-10 col-lg-7 search p-2 ${!numberState.isvalid &&
              numberState.isTouched &&
              "form-control-invalid"
              }`}
          />
        </div>

        <div className='col-12 col-lg-5 m-1 py-2 p-0 justify-content-lg-end justify-content-center text-center row ' >
          <label htmlFor="client" className="col-10 col-lg-5 fw-bold add-user-p "> Account:</label>
          <Select  
              // value={account}
              options={accounts.map(account =>({label:account.title , value:account._id}))}
              onChange={handleChange}
              className="basic-single  col-10 col-lg-7 "
              classNamePrefix="select"
              name="account"
            />
        </div>

        <div className='col-8 m-3 mt-5 row justify-content-center'>
          <button
            disabled={
              !amountState.isvalid ||
              !method ||
              !account ||
              !numberState.isvalid 
            }
            className='add-trans-btn p-3  fw-bold col-10 col-lg-5'>
            Add
          </button>
        </div>
      </form>
    </div>
  )
}

export default Transactions
