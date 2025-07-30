import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { setError, setLoading, setUser } from '../store/authSlice';
import { GoogleLogin } from '@react-oauth/google';
import Loader from './Loader';

function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state)=>state.auth.loading)

  

  useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (storedUser) {
    navigate('/feed');
  }
}, []);


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
      const { accessToken , user } = res.data.data;
      dispatch(setUser(user));

      localStorage.setItem("token", accessToken);

      localStorage.setItem('user', JSON.stringify(user));

      toast.success('Logged In successfully!');
      navigate('/feed');
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Login failed"));
      toast.error(error.response?.data?.message || error.message || 'Something went wrong');
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const res = await axios.post("api/v1/users/google-login", { credential: response.credential }, { withCredentials: true });
      dispatch(setUser(res.data.data));
      localStorage.setItem('user', JSON.stringify(res.data.data));
      toast.success('Google login successful');
      navigate('/feed');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Google login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 sm:p-8 rounded-2xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-purple-700">Welcome Back</h2>

        <div>
          <label className="block mb-1 text-sm font-medium" htmlFor="identifier">Username or Email:</label>
          <input
            type="text"
            id='identifier'
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Username or Email"
            className="w-full border border-purple-500 rounded px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium" htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border border-purple-500 rounded px-4 py-2"
            required
          />
        </div>

       {loading ?(
        <Loader/>
       ):(
         <button
          type="submit"
          className="w-full bg-purple-700 text-white font-semibold py-2 rounded-md hover:bg-purple-500 transition"
        >
          Login
        </button>
       )}

        <div className="flex items-center my-2">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            theme='filled_black'
            shape='pill'
            size='large'
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error("Google login failed")}
          />
        </div>

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
