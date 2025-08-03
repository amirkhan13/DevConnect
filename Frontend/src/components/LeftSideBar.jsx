import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CreatePost from "./CreatePost";

function LeftSidebar() {
  const user = useSelector((state) => state.auth.user);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="w-[220px] bg-white shadow-md mx-4 max-h-screen sticky top-24 self-start border rounded-xl p-3 hidden lg:block text-sm">
      <div className="relative h-24 w-full mb-8">
        <img
          src={user?.CoverImage || "/imgs/default-CoverImage.jpg"}
          alt="Cover"
          className="w-full h-full object-cover rounded-t-md"
        />
        <img
          src={user?.avatar || "/imgs/default avatar.jpg"}
          alt="User Avatar"
          className="w-16 h-16 rounded-full object-cover border-4 border-white absolute left-1/2 transform -translate-x-1/2 -bottom-8"
        />
      </div>

      <div className="mt-10 text-center">
        <h2 className="font-semibold truncate">{user?.fullName || user?.username || "User"}</h2>
        <p className="text-gray-500 text-xs">{user?.Bio || "Developer"}</p>

        <div className="flex justify-center gap-1 mt-3 flex-wrap text-xs">
          {user?.linkedin && <a href={user.linkedin} target="_blank" rel="noreferrer" className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-2 py-1 rounded">LinkedIn</a>}
          {user?.github && <a href={user.github} target="_blank" rel="noreferrer" className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-2 py-1 rounded">GitHub</a>}
          {user?.website && <a href={user.website} target="_blank" rel="noreferrer" className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-2 py-1 rounded">Website</a>}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-bold text-purple-700 uppercase mb-1">Activity</p>
        <Link to="/feed" className="block px-2 py-1 rounded hover:bg-purple-100">📰 Feed</Link>
        <button onClick={() => setShowModal(true)} className="w-full text-left px-2 py-1 rounded hover:bg-purple-100">✍️ Create Post</button>
      </div>

      <div className="mt-4">
        <p className="text-xs font-bold text-purple-700 uppercase mb-1">More</p>
        <Link to="/create-project" className="block px-2 py-1 rounded hover:bg-purple-100">📁 Create Project</Link>
        <Link to="/resources" className="block px-2 py-1 rounded hover:bg-purple-100">📚 Resources</Link>
        <Link to="/profile" className="block px-2 py-1 rounded hover:bg-purple-100">👤 Profile</Link>
      </div>

      <CreatePost showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
}

export default LeftSidebar;
  