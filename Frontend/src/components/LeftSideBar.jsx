import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CreatePost from "./CreatePost";

function LeftSidebar() {
  const user = useSelector((state) => state.auth.user);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="w-[250px] bg-white shadow-md mx-5 h-fit sticky top-24 self-start border rounded-lg p-4 hidden lg:block">
      <div className="relative h-32 w-full mb-10">
        <img
          src={user?.CoverImage || "/imgs/default-CoverImage.jpg"}
          alt="Cover"
          className="w-full h-full object-cover rounded-t-lg"
        />
        <img
          src={user?.avatar || "/imgs/default avatar.jpg"}
          alt="User Avatar"
          className="w-20 h-20 rounded-full object-cover border-4 border-white absolute left-1/2 transform -translate-x-1/2 -bottom-10"
        />
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-lg font-semibold">
          {user?.fullName || user?.username || "User"}
        </h2>
        <p className="text-sm text-gray-500">{user?.Bio || "Developer"}</p>

        <div className="flex justify-center gap-2 mt-4 flex-wrap">
          {user?.linkedin && (
            <a
              href={user.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium rounded px-3 py-1 text-sm transition"
            >
              LinkedIn
            </a>
          )}
          {user?.github && (
            <a
              href={user.github}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium rounded px-3 py-1 text-sm transition"
            >
              GitHub
            </a>
          )}
          {user?.website && (
            <a
              href={user.website}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium rounded px-3 py-1 text-sm transition"
            >
              Website
            </a>
          )}
        </div>
      </div>

      <nav className="mt-6">
        <div className="mb-4">
          <p className="text-xs font-bold text-purple-700 uppercase mb-2">Activity</p>
          <Link to="/feed" className="block p-2 rounded hover:bg-purple-100 transition">📰 Feed</Link>
          <button
            onClick={() => setShowModal(true)}
            className="w-full text-left block p-2 rounded hover:bg-purple-100 transition"
          >
            ✍️ Create Post
          </button>
        </div>

        <div>
          <p className="text-xs font-bold text-purple-700 uppercase mb-2">More</p>
          <Link to="/create-project" className="block p-2 rounded hover:bg-purple-100 transition">📁 Create Project</Link>
          <Link to="/resources" className="block p-2 rounded hover:bg-purple-100 transition">📚 Resources</Link>
          <Link to="/profile" className="block p-2 rounded hover:bg-purple-100 transition">👤 Profile</Link>
        </div>
      </nav>

      <CreatePost showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
}

export default LeftSidebar;
