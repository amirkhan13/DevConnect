import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { setError, setLoading, setUser } from '../store/authSlice';
import Loader from './Loader';

import { GoogleLogin } from "@react-oauth/google";



function Register() {
  const navigate = useNavigate()

  const dispatch = useDispatch();

  const loading = useSelector((state)=>state.auth.loading)

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleRegister = async (e) => {
    e.preventDefault();

    dispatch(setLoading())

    if (password.length < 8) {
    toast.error("Password must be at least 8 characters long.");
    return;
  }
    dispatch(setLoading());

    const data = {
      username: username,
      email: email,
      password: password
    }

    try {
      const res = await axios.post("/api/v1/users/register", data)



      if (res.data.success) {
        dispatch(setUser(res.data.data));
        toast.success('Registration successful!');
        setUsername('');
        setEmail('');
        setPassword('');
      }
      

    } catch (error) {

      const errorMsg =
        error.response?.data?.message || error.message || 'Something went wrong';

      dispatch(setError(errorMsg));
      toast.error(errorMsg);
    }

  }

  const handleGoogleSuccess = async (response)=>{
        try {
          const res = await axios.post("api/v1/users/google-login" ,{credential:response.credential},{withCredentials:true});
          dispatch(setUser(res.data.data));
          localStorage.setItem('user', JSON.stringify(res.data.data));
          toast.success('Google login Successfull');
          navigate('/feed')
        } catch (error) {
          toast.error(error.response?.data?.message ||'Google login failed');
        }
    }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 rounded-lg">

      <form onSubmit={handleRegister}

        className='bg-white p-6 rounded-2xl shadow-md w-full max-w-md space-y-4'
      >

        <h2 className='text-2xl font-bold text-center text-purple-700'>Create Account</h2>

        <div>
          <label className="block mb-1 text-sm font-medium " htmlFor='username'>username:</label>
          <input type="text"
            placeholder='Username'
            id='username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='w-full border border-purple-400 rounded px-4 py-2'
            required
          />
        </div>

        <div>

          <label className="block mb-1 text-sm font-medium" htmlFor='email'>email:</label>
          <input type="email"
            placeholder='Email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full border border-purple-400 rounded px-4 py-2'
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium" htmlFor='password'>password:</label>
          <input type="password"
            placeholder='Password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            className='w-full border border-purple-400 rounded px-4 py-2'
            required
          />
        </div>

        {loading ?(
          <Loader/>
        ) :(
           <button
          className="w-full bg-purple-700 text-white font-semibold py-2 rounded-md hover:bg-purple-500 transition"
        >
          Register

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
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-purple-600 hover:underline cursor-pointer"
          >
            Login here
          </span>
        </p>

      </form>

      <ToastContainer position="top-right" autoClose={3000} />

    </div>
  )
}

export default Register
