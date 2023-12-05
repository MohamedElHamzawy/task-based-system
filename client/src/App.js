import React, { useContext } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Signin from "./components/Signin/Signin";
import Admin from "./components/Admin/Admin";
import { AuthProvider, AuthContext } from "./AuthContext";
import UserA from "./components/UserA/UserA";
import UserB from "./components/UserB/UserB";

function App() {
  const authContext = useContext(AuthContext);
  const theme = createTheme({
    typography: {
      fontFamily: "Lato",
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 700,
      fontWeightBold: 900,
    },
  });
  return (
    <div className="app">
      <ThemeProvider theme={theme}>
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
      </ThemeProvider>
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
