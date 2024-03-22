import React, { useEffect, useReducer, useState } from "react";
import { validate, VALIDATOR_MINLENGTH } from "../../../../util/validators";
import axios from "axios";
import customAxios from "../../../../axios";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../../../LoadingSpinner/ErrorModal";
import Select from "react-select";

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
  const [method, setMethod] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [account, setAccount] = useState("");
  const [bankAccounts, setBankAccounts] = useState([]);
  const [bankAccount, setBankAccount] = useState("");

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      const accountsResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}:5000/api/account/`
      );
      const bankAccountsResponse = await customAxios.get("/bank");

      setAccounts(accountsResponse.data.accounts);
      setBankAccounts(bankAccountsResponse.data);

      setLoading(false);
      setIsLoading(false);
    })();
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

  const handleChange = (defaultValueOption) => {
    setAccount(defaultValueOption.value);
  };

  /////////////////////////////////

  const newTransactionSubmitHandler = async (event) => {
    event.preventDefault();
    // send api request to validate data
    setIsLoading(true);
    try {
      setError(null);
      const body = {
        amount: amountState.value,
        method: method,
        account_id: account,
        bankAccountId: bankAccount,
      };
      const response = await customAxios.post(`/transaction`, body);
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
    amountState.value = "";
    setAccount("");
    setMethod("");
  };

  const errorHandler = () => {
    setError(null);
  };

  return (
    <div className="min-h-[calc(100vh-4em)] flex flex-col text-center p-3 w-full m-0">
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && <LoadingSpinner asOverlay />}

      <div className="flex p-1">
        <h2 className="w-full text-center p-3 font-bold">Add Transaction</h2>
      </div>

      <form
        className="p-3 items-center m-0 rounded"
        onSubmit={newTransactionSubmitHandler}
      >
        <div className="flex items-center">
          <div className="w-full flex items-center lg:w-1/2 m-1 py-2 p-0">
            <label className="w-4/5 lg:w-1/2 font-bold">Amount:</label>
            <input
              type="number"
              placeholder="Amount"
              value={amountState.value}
              onChange={amountChangeHandler}
              onBlur={amountTouchHandler}
              isvalid={amountState.isvalid.toString()}
              className={`${
                !amountState.isvalid &&
                amountState.isTouched &&
                "form-control-invalid"
              }`}
            />
          </div>

          <div className="w-full flex items-center lg:w-1/2 m-1 py-2 p-0">
            <label className="w-4/5 lg:w-1/2 font-bold">Method :</label>
            <select
              id="Method"
              name="Method"
              value={method}
              onChange={(event) => setMethod(event.target.value)}
            >
              <option value="" defaultValue disabled className="text-secondary">
                Methods
              </option>
              <option value="VodafoneCash">VodafoneCash</option>
              <option value="Visa">Visa</option>
            </select>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-full flex items-center lg:w-1/2 m-1 py-2 p-0">
            <label className="w-4/5 lg:w-1/2 font-bold">Bank Account:</label>
            <Select
              options={bankAccounts.map((account) => ({
                label: account.title,
                value: account._id,
              }))}
              onChange={(e) => setBankAccount(e.value)}
              className="w-full"
              name="bankAccount"
            />
          </div>

          <div className="w-full flex items-center lg:w-1/2 m-1 py-2 p-0 text-center">
            <label htmlFor="client" className="w-4/5 lg:w-1/2 font-bold">
              Account:
            </label>
            <Select
              options={accounts.map((account) => ({
                label: account.title,
                value: account._id,
              }))}
              onChange={handleChange}
              className="w-full"
              name="account"
            />
          </div>
        </div>

        <div className="w-full flex items-center justify-center">
          <button
            disabled={
              !amountState.isvalid ||
              !method ||
              !account ||
              !bankAccount ||
              bankAccount === ""
            }
            className="bg-cyan-600 text-white rounded py-1 font-bold w-4/5 lg:w-1/5 transition-all hover:bg-cyan-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default Transactions;
