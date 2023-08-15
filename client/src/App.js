import React, { useContext } from 'react';
import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Signin from './components/Signin/Signin';
import Admin from './components/Admin/Admin';
import {AuthProvider , AuthContext } from './AuthContext';

function App() {
  const authContext = useContext(AuthContext);

  return (
    <div className="app">
    <BrowserRouter>
    {authContext.auth.name ?   
      <Routes>
        <Route path="/*" element={<Admin />} />
      </Routes> 
      :
      <Routes> 
        <Route path="/" element={<Signin />} />
      </Routes> 
    }
    </BrowserRouter>  
    </div>
  );
}

function AppWithStore(){
  return (<AuthProvider>
    <App />
  </AuthProvider>);
}

export default AppWithStore;