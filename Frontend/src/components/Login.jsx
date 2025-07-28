import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { setError, setLoading, setUser } from '../store/authSlice';

function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(setLoading());

    const data = {
      email: identifier,
      username: identifier,
      password,
    };

    try {
      const res = await axios.post("/api/v1/users/login", data);
      dispatch(setUser(res.data.data));
      localStorage.setItem('user', JSON.stringify(res.data.data));
      toast.success('Logged In successfully!');
      navigate('/home')
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Login failed"));
      toast.error(error.response?.data?.message || error.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 rounded-lg">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-purple-500">Welcome Back</h2>

        <div>
          <label className="block mb-1 text-sm font-medium" htmlFor="identifier">Username or Email:</label>
          <input
            type="text"
            placeholder="Username or Email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full border border-purple-400 rounded px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium" htmlFor="password">Password:</label>
          <input
            type="password"
            placeholder="Password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-purple-400 rounded px-4 py-2"
            required
          />
          <div className="text-right mt-1">
            <span
              onClick={() => navigate("/change-password")}
              className="text-sm text-black hover:text-purple-600 hover:underline cursor-pointer"
            >
              Forgot password?
            </span>
          </div>
        </div>

        <button
          className="w-full bg-purple-700 text-white font-semibold py-2 rounded-md hover:bg-purple-500 transition"
        >
          Login
        </button>

        <div className="flex items-center my-2">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Google Login Placeholder */}
        {/* 
        <GoogleLogin
          render={(renderProps) => (
            <button
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
              className="w-full border border-gray-300 rounded flex items-center justify-center gap-2 py-2 hover:bg-gray-100 transition"
            >
              <FcGoogle size={20} />
              <span>Sign up with Google</span>
            </button>
          )}
        /> 
        */}

        <p className="text-center text-sm">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-purple-600 hover:underline cursor-pointer"
          >
            Register here
          </span>
        </p>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Login;
