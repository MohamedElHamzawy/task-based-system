import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Signin from "./components/Signin/Signin";
import Admin from "./components/Admin/Admin";
import { AuthProvider, AuthContext } from "./AuthContext";
import UserA from "./components/UserA/UserA";
import UserB from "./components/UserB/UserB";

import "react-datepicker/dist/react-datepicker.css";
import NotificationCard from "./components/Notification";
import { AnimatePresence, motion } from "framer-motion";

function App() {
  const authContext = useContext(AuthContext);
  const [notification, setNotification] = useState({
    message: "this is a test notification!",
    createdAt: new Date(),
  });

  useEffect(() => {
    if (notification) {
      setTimeout(() => {
        setNotification(null);
      }, 2500);
    }
  }, [notification]);

  return (
    <div>
      <AnimatePresence>
        {notification && (
          <motion.div
            className="z-50 max-w-md w-full fixed top-20 right-4"
            initial={{ opacity: 0, x: 500 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 500 }}
            transition={{ duration: 0.35, type: "spring" }}
          >
            <NotificationCard
              content={notification.message}
              createdAt={notification.createdAt}
            />
          </motion.div>
        )}
      </AnimatePresence>
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
