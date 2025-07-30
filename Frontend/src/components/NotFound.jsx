import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9FAFB] px-6">
      <h1 className="text-[100px] font-extrabold text-purple-700">404</h1>
      <p className="text-2xl font-semibold text-[#1F2937]">Page Not Found</p>
      <p className="text-[#6B7280] mt-2 max-w-md text-center">
        Sorry, we couldn’t find the page you’re looking for. It might have been moved or deleted.
      </p>

      <Link
        to="/"
        className="mt-6 bg-purple-700 hover:bg-purple-500 text-white px-6 py-2 rounded-md text-sm font-medium shadow-md transition"
      >
        ← Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
