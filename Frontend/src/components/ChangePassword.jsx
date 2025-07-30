import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();

  

    try {
      const data = { oldPassword, newPassword };

      if(newPassword.length <8){
        toast.error("new passowrd must be of alteast 8 characters");
        return
      }

      const res = await axios.patch("/api/v1/users/change-password", data, { withCredentials: true });

      toast.success(res.data.message || "Password changed successfully");
      setOldPassword('');
      setNewPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change the password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center px-4">
      <form
        onSubmit={handleChangePassword}
        className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-center text-purple-700">Change Password</h2>

        <div className="space-y-2">
          <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">Old Password:</label>
          <input
            type="password"
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter old password"
            required
            className="w-full px-4 py-2 border border-purple-400 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
            className="w-full px-4 py-2 border border-purple-400 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-700 hover:bg-purple-600 text-white font-semibold py-2.5 rounded-md transition duration-200"
        >
          Update Password
        </button>

        <div className="text-center text-sm mt-4">
          <span className="text-gray-600">Go back to </span>
          <span
            onClick={() => navigate('/home')}
            className="text-purple-600 font-medium cursor-pointer hover:underline"
          >
            Home
          </span>
        </div>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default ChangePassword;
