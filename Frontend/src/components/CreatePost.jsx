import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setLoading } from '../store/postSlice';
import { toast } from 'react-toastify';

function CreatePost({ showModal = false, setShowModal, fetchPosts }) {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const dispatch = useDispatch();

  const handlePost = async (e) => {
    e.preventDefault();

    if (!content.trim() || !tags.trim()) {
      toast.error("All fields are required");
      return;
    }

    try {
      dispatch(setLoading(true));
      const token = localStorage.getItem('token');
      const res = await axios.post(
        "/api/v1/posts/create-post",
        {
          content,
          tags: tags.split(',').map(tag => tag.trim()),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Post created successfully!");
      setContent('');
      setTags('');
      setShowModal(false);

      if (typeof fetchPosts === 'function') {
        await fetchPosts(); 
        console.log("fetch function called");
        
      }
    } catch (error) {
      toast.error("Error creating post");
      console.error("Post Creation Error:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (!showModal) return null;

  return (
    <>
     
      <div
        className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40"
        onClick={() => setShowModal(false)}
      />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 w-[95%] sm:w-[500px] -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-lg z-50">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Create a Post</h2>
        <form onSubmit={handlePost}>
          <textarea
            className="w-full p-3 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
            rows="4"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default CreatePost;
