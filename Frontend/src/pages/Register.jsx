import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { register, resetAuthSlice } from "../store/slices/authSlice";
import logo_with_title from "../assets/logo-with-title.png"; 

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, message, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleRegister = (e) => {
    e.preventDefault();
    // Matches your backend check: password length < 8 || password length > 16
    if (password.length < 8 || password.length > 16) {
      toast.error("Password must be between 8 and 16 characters.");
      return;
    }
    dispatch(register({ name, email, password }));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
      // Backend generates OTP, so we redirect to OTP page
      navigate(`/otp-verification/${email}`);
    }
    if (isAuthenticated) {
      navigate("/");
    }
  }, [dispatch, error, message, isAuthenticated, navigate, email]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="flex flex-col items-center">
          <img src={logo_with_title} alt="Logo" className="h-12 w-auto mb-4" />
          <h2 className="text-3xl font-extrabold text-gray-900">Create an account</h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="8 - 16 characters"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-70"
          >
            {loading ? "Creating Account..." : "Sign up"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account? <Link to="/login" className="text-blue-600 font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;