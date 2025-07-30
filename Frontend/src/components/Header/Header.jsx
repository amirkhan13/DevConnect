import React, { useState, useRef, useEffect } from 'react';
import { FiSearch } from "react-icons/fi";
import { FaHome, FaBook, FaRegNewspaper } from "react-icons/fa";
import { BsChatDots } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setUser, setLoading, logoutUser, setError,  } from '../../store/authSlice';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        dispatch(setLoading());
        const res = await axios.get("/api/v1/users/me");
        dispatch(setUser(res.data.user));
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {

    try {

      const res  = await axios.post("/api/v1/users/logout" ,{} , {withCredentials:true})
      if(res.status ==200){

        dispatch(logoutUser());
        navigate('/login')
      }
    } catch (error) {
      dispatch(setError())
    }

    
  };

  return (
    <header className="bg-white shadow-md px-4 py-3 flex flex-wrap items-center justify-between">
      <div className="flex items-center gap-4 w-full md:w-1/2">
        <div className="text-2xl font-bold text-purple-600 whitespace-nowrap">
          DevConnect
        </div>

        <div className="flex items-center bg-white-100 px-3 py-2 rounded-full w-full border-2 border-purple-300">
          <FiSearch className="text-purple-500 mr-2" />
          <input
            type="text"
            placeholder="Search Projects, Resources etc"
            className="bg-transparent focus:outline-none w-full text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 mt-3 mx-4 md:mt-0 relative">
        <div className="flex items-center gap-4 text-sm text-gray-700">
          <div className="flex flex-col items-center text-purple-700 hover:text-purple-300 cursor-pointer font-medium">
            <FaHome className="text-xl" />
            <span className="text-xs">Home</span>
          </div>
          <div className="flex flex-col items-center text-purple-700 hover:text-purple-300 cursor-pointer font-medium">
            <FaRegNewspaper className="text-xl" />
            <span className="text-xs">Posts</span>
          </div>
          <div className="flex flex-col items-center text-purple-700 hover:text-purple-300 cursor-pointer font-medium">
            <FaBook className="text-xl" />
            <span className="text-xs">Resources</span>
          </div>
          <div className="flex flex-col items-center text-purple-700 hover:text-purple-300 cursor-pointer font-medium">
            <BsChatDots className="text-xl" />
            <span className="text-xs">Messages</span>
          </div>
        </div>

        <div className="relative" ref={dropdownRef}>
          <img
            src={user?.avatar}
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-purple-400 cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-purple-500 rounded-lg shadow-lg z-50">
              <Link to="#" className="block px-4 py-2 text-sm text-purple-700 hover:bg-purple-50">Profile</Link>
              <Link to="/#" className="block px-4 py-2 text-sm text-purple-700 hover:bg-purple-50">Posts & Activity</Link>
              <Link to="/create-post" className="block px-4 py-2 text-sm text-purple-700 hover:bg-purple-50">Projects </Link>
              <Link to="/#" className="block px-4 py-2 text-sm text-purple-700 hover:bg-purple-50">Add Resources</Link>
              <Link to="/change-password" className="block px-4 py-2 text-sm text-purple-700 hover:bg-purple-50">Change Password</Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm font-bold text-red-500 hover:bg-purple-50 border-t border-purple-100 mt-1"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
