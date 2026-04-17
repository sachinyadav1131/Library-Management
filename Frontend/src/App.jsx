import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getUser } from "./store/slices/authSlice";
import { getAllBooks } from "./store/slices/bookSlice"; // Added for header math

// --- IMPORTANT: ALL PAGE IMPORTS ---
import Home from "./pages/Home"; 
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import OTP from "./pages/OTP";
import ResetPassword from "./pages/ResetPassword";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // These two ensure your Header shows the correct amount immediately
    dispatch(getUser());
    dispatch(getAllBooks());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Now 'Home' is defined and will work */}
        <Route path="/" element={<Home/>} /> 
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/password/forgot" element={<ForgotPassword/>} />
        <Route path="/otp-verification/:email" element={<OTP/>} />
        <Route path="/password/reset/:token" element={<ResetPassword/>} />
      </Routes>
      <ToastContainer theme="dark" position="bottom-right"/>
    </Router>
  );
};

export default App;