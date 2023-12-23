import React, { useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Signin from "./components/Signin/Signin";
import Admin from "./components/Admin/Admin";
import { AuthProvider, AuthContext } from "./AuthContext";
import UserA from "./components/UserA/UserA";
import UserB from "./components/UserB/UserB";

function App() {
  const authContext = useContext(AuthContext);
  return (
    <div>
      <BrowserRouter>
        {authContext.auth.admin ? (
          <Routes>
            <Route path="/*" element={<Admin />} />
          </Routes>
        ) : authContext.auth.usera ? (
          <Routes>
            <Route path="/*" element={<UserA />} />
          </Routes>
        ) : authContext.auth.userb ? (
          <Routes>
            <Route path="/*" element={<UserB />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Signin />} />
          </Routes>
        )}
      </BrowserRouter>
    </div>
  );
}

function AppWithStore() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AppWithStore;
