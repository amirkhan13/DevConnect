import React from 'react';
import { FiSearch } from "react-icons/fi";
import { FaHome, FaBook ,FaRegNewspaper } from "react-icons/fa";
import { BsChatDots } from 'react-icons/bs';


function Header() {
  return (
    <header className="bg-white shadow-md px-4 py-3 flex flex-wrap items-center justify-between ">
      
      {/* Left: Logo + Search */}
      <div className="flex items-center gap-4 w-full md:w-1/2">
        {/* Logo */}
        <div className="text-2xl font-bold text-purple-600 whitespace-nowrap">
          DevConnect
        </div>

        {/* Search */}
        <div className="flex items-center bg-white-100 px-3 py-2 rounded-full w-full  border-2 border-purple-300 ">
          <FiSearch className="text-purple-500 mr-2" />
          <input
            type="text"
            placeholder="Search Projects, Resources etc"
            className="bg-transparent focus:outline-none w-full text-sm"
          />
        </div>
      </div>

      
      <div className="flex items-center gap-4 mt-3 md:mt-0">
       
        <div className="flex items-center gap-4 text-sm text-gray-700">
          <div className="flex flex-col items-center text-purple-700 hover:text-purple-300 cursor-pointer font-medium  ">
            <FaHome className="text-xl" />
            <span className="text-xs">Home</span>
          </div>
          <div className="flex flex-col items-center  text-purple-700 hover:text-purple-300 cursor-pointer font-medium ">
            <FaRegNewspaper className="text-xl" />
            <span className="text-xs">Posts</span>
          </div>
          <div className="flex flex-col items-center  text-purple-700 hover:text-purple-300 cursor-pointer font-medium ">
           <FaBook className="text-xl" />
            <span className="text-xs">Resources</span>
          </div>
          <div className="flex flex-col items-center  text-purple-700 hover:text-purple-300 cursor-pointer font-medium ">
           <BsChatDots className="text-xl" />
            <span className="text-xs">Messages</span>
          </div>
        </div>

        {/* Profile Icon */}
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiKJ5jJ2u1e4jpeyyvARsvgAtncKdSTnvEQw&s"
          alt="Profile"
          className="w-10 h-10 rounded-full border-solid border-purple-400 cursor-pointer"
        />
      </div>
    </header>
  );
}

export default Header;
