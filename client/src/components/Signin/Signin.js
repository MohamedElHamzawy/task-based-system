import React, {useReducer , useState } from 'react';
import SetCookie from '../../hooks/setCookie';
import { SiFreelancer } from 'react-icons/si';
import './Signin.css';

import { Form, Row } from "react-bootstrap";

import {validate  , VALIDATOR_REQUIRE ,VALIDATOR_MINLENGTH} from '../../util/validators';

import ErrorModal from '../../LoadingSpinner/ErrorModal';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import axios from 'axios';

//EMAIL validation
const usernameReducer =(state , action) =>{
  switch(action.type){
    case 'CHANGE':
    return {
      ...state,
      value : action.username, 
      isvalid : validate(action.username , action.validators)
    };
    case 'TOUCH':
      return {
        ...state,       
        isTouched : true
      };
    default:
      return state ;
  }
}
//pass validation
const passReducer =(state , action) =>{
  switch(action.type){
    case 'CHANGE':
    return {
      ...state,
      value : action.pass, 
      isvalid : validate(action.pass , action.validators)
    };
    case 'TOUCH':
      return {
        ...state,       
        isTouched : true
      };
    default:
      return state ;
  }
}


const SignIn = () => {


//EMAIL validation 
const [usernameState , dispatch2 ]= useReducer(usernameReducer , {
  value:'' ,
  isvalid: false,
  isTouched :false
  });
  
  
const usernameChangeHandler = event =>{
  dispatch2({type:'CHANGE', username : event.target.value , validators: [VALIDATOR_MINLENGTH(3)] });
};
const touchHandler = () =>{
  dispatch2({
    type :'TOUCH'
  })
}

//PASS validation 
const [passState , dispatch3 ]= useReducer(passReducer , {
  value:'' ,
  isvalid: false,
  isTouched :false
  });
  
  
  const passChangeHandler = event =>{
    dispatch3({type:'CHANGE', pass : event.target.value , validators: [VALIDATOR_REQUIRE()] });
  };
  const passtouchHandler = () =>{
    dispatch3({
      type :'TOUCH'
    })
  }


const [isLoading ,setIsLoading] = useState(false);
const [error , setError] = useState(false);



const emailSubmitHandler = async event =>{
  event.preventDefault();
  // send api request to validate data and get token
  setIsLoading(true);
  try {
    setError(null);
    const response = await axios.post(
      "http://localhost:5000/api/login",
      {
        userName : usernameState.value,
        password: passState.value  
      }
    );
   const responseData = await response;
   console.log(responseData) ;
   
   SetCookie("Token" , responseData.data.token);
   localStorage.setItem("AdminData", JSON.stringify(responseData.data.user._id))
   setIsLoading(false);
   window.location.href = '/' ;
  } 
  catch (err) {
    console.log(err);
    setIsLoading(false);
    setError(err.responseData.data.error || "SomeThing Went Wrong , Please Try Again .");
  }
};

const errorHandler =() =>{
   setError(null) ;
}

  return (
    <div className='signin p-4 m-0 row justify-content-center w-100'>
      <div>
        <div className=''>
            <h1 className='logo text-white bg-danger col-12 col-lg-4 p-3 '>
              <SiFreelancer/> FreeLancing System 
            </h1>
        </div>
      <div className='col-12 p-5'>
        <h1 className='col-12 text-center text-white m-0 p-0'> Sign In </h1> 
          <div id="header-graphic" className="d-flex justify-content-center ">
              <div className="creative-break ">
                  <div className="left-diamond diamond text-white "></div>
                  <div className="right-diamond diamond text-white"></div> 
              </div>
          </div>
      </div>
      <Row className='col-12 p-0 m-0 justify-content-center '>
        <ErrorModal error={error} onClear={errorHandler} />
        {isLoading && <LoadingSpinner asOverlay/>}
       <Form className="col-12 col-lg-6 m-0 p-0" onSubmit={emailSubmitHandler}>
          <Row className='w-100 justify-content-center m-0'>          
            <Form.Group  className= " col-md-10 col-12 text-center p-0" >
              <Form.Label className="lable fw-bold text-white p-3"> <span style={{ color:'red'}}>*</span> UserName <span style={{ color:'red'}}>*</span></Form.Label>
              <Form.Control
              controlid='username'
              value={usernameState.value}
              onChange={usernameChangeHandler}
              onBlur={touchHandler}
              isvalid={usernameState.isvalid.toString()}
              type='name'
              placeholder="User Name " 
              className={`p-3 ${!usernameState.isvalid && usernameState.isTouched && 'form-control-invalid' }`}/>
            {!usernameState.isvalid && usernameState.isTouched && <p style={{color:'red'}}>Please Enter A Vaild UserName</p>}

            </Form.Group>

            <Form.Group className="mb-3 col-md-10 col-12 text-center p-0" controlId="formGridPassword">
              <Form.Label className="fw-bold text-white p-3"><span style={{ color:'red'}}>*</span>Password <span style={{ color:'red'}}>*</span></Form.Label>
              <Form.Control
              controlid='password'
              value={passState.value}
              onChange={passChangeHandler}
              onBlur={passtouchHandler}
              isvalid={passState.isvalid.toString()}
              type="password" 
              placeholder="Password" 
              className={`p-3 ${!passState.isvalid && passState.isTouched && 'form-control-invalid' }`}
              />
            {!passState.isvalid && passState.isTouched && <p style={{color:'red'}}>Please Enter A Vaild PassWord</p>}

            </Form.Group>

          </Row>
        <div className='row w-100 justify-content-center m-0'>

          <button     
            className='sign-btn fs-4 rounded col-md-4 col-6 fw-bold text-white p-3 my-3'
            disabled={!usernameState.isvalid || !passState.isvalid}
            type="submit"
            style={{ background:'#007063' ,  cursor: 'pointer' }}>
            SIGN IN                              
          </button>

        </div>

      </Form>

    </Row>
    </div>
  </div>
  )
}

export default SignIn