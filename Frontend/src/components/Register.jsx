import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { setError, setLoading, setUser } from '../store/authSlice';

// import { GoogleLogin, googleLogout } from "@react-oauth/google";
// import { FcGoogle } from "react-icons/fc"


function Register() {
  const navigate = useNavigate()

  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleRegister = async (e) => {
    e.preventDefault();
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



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 rounded-lg">

      <form onSubmit={handleRegister}

        className='bg-white p-6 rounded-2xl shadow-md w-full max-w-md space-y-4'
      >

        <h2 className='text-2xl font-bold text-center text-purple-500'>Create Account</h2>

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
            className='w-full border border-purple-400 rounded px-4 py-2'
            required
          />
        </div>

        <button
          className="w-full bg-purple-700 text-white font-semibold py-2 rounded-md hover:bg-purple-500 transition"
        >
          Register

        </button>

        <div className="flex items-center my-2">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* <GoogleLogin
          // onSuccess={handleGoogleSuccess}
          // onError={handleGoogleError}
          render={(renderProps) => (
            <button
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
              className="w-full border border-gray-300 rounded flex items-center justify-center gap-2 py-2 hover:bg-gray-100 transition"
            >
              <FcGoogle size={20} />
              <span >Sign up with Google</span>
            </button>
          )}
        /> */}

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
