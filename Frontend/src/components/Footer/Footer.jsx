import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gray-100 py-6 mt-10 shadow-inner">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-gray-700">
        
        {/* Left: Brand or Message */}
        <div className="text-center md:text-left mb-2 md:mb-0 font-semibold text-purple-500">
          © 2025 DevConnect. All rights reserved.
        </div>

        {/* Right: Social Icons */}
        <div className="flex space-x-4">
          <a href="#" className="hover:text-purple-600 transition">
            <FaGithub size={20} />
          </a>
          <a href="#" className="hover:text-purple-600 transition">
            <FaLinkedin size={20} />
          </a>
          <a href="mailto:support@devconnect.com" className="hover:text-purple-600 transition">
            <FaEnvelope size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
