import React, { useState } from "react";
import {
  FaHeart, FaRegHeart, FaRegComment, FaComment, FaEdit, FaTrash, FaEllipsisH,
} from "react-icons/fa";
import moment from "moment";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { deletePost,  updatePost } from "../store/postSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { showError ,showSuccess } from "../utils/toatUtils";

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const imageMap = useSelector((state) => state.posts.images);
  const images = imageMap?.[post._id] || [];
  const image = images?.[0]||"";

  const isAuthor = currentUser?._id === post?.author?._id;
  const [showComments, setShowComments] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isLiked, setIsLiked] = useState(post.likes?.includes(currentUser._id));
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    dispatch(likePost(post._id));
  };

  const handleDelete = async () => {
  const confirmDelete = window.confirm("Are you sure you want to delete this post?");
  if (!confirmDelete) return;

  try {
    const res = await axios.delete(`/api/v1/posts/${post._id}`, {
      withCredentials: true,
    });

    if (res.status === 200) {
      dispatch(deletePost(post._id));
      setShowOptions(false)
      showSuccess("Post deleted");
    } else {
        showError("Failed to delete post");
    }
  } catch (error) {
    console.error(error);
      showError("Failed to delete post");
  }
};


  const handleEdit = () => {
    dispatch(editPost(post)); 
  };

  return (
    <div className="bg-white w-full shadow rounded-lg p-4 mb-6 border border-gray-100">
      {/* Header */}
      <div className="flex justify-between mb-3">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.author._id}`}>
            <img
              src={post?.author?.avatar || "/default-avatar.png"}
              alt={post?.author?.fullName}
              className="w-10 h-10 rounded-full object-cover"
            />
          </Link>
          <div>
            <Link to={`/profile/${post.author._id}`} className="font-semibold text-sm hover:text-purple-600">
              {post?.author?.fullName}
            </Link>
            {post?.author?.Bio && (
              <p className="text-xs text-gray-500">{post?.author?.Bio}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{moment(post?.createdAt).fromNow()}</span>
          {isAuthor && (
            <div className="relative">
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <FaEllipsisH size={14} />
              </button>
              {showOptions && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <button onClick={handleEdit} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <FaEdit size={12} /> Edit
                  </button>
                  <button onClick={handleDelete} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                    <FaTrash size={12} /> Delete

                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <p className="text-sm text-gray-800 whitespace-pre-wrap mb-3">{post?.content}</p>

      {/* Image */}
      {image && (
        <div className="mb-3 w-full rounded-md overflow-hidden">
          <img src={image} alt="post-img" className="w-full max-h-[500px] object-cover rounded" />
        </div>
      )}

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map((tag, i) => (
            <span key={i} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="flex justify-between items-center text-xs text-gray-500 border-t border-b border-gray-100 py-2 mb-3">
        <span>{likeCount} likes</span>
        <span>{post.comments?.length || 0} comments</span>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center text-sm">
        <button onClick={handleLike} className={`flex items-center gap-1 px-3 py-1.5 rounded-md ${isLiked ? "text-red-500" : "text-gray-600 hover:bg-gray-100"}`}>
          {isLiked ? <FaHeart /> : <FaRegHeart />} Like
        </button>
        <button onClick={() => setShowComments(!showComments)} className={`flex items-center gap-1 px-3 py-1.5 rounded-md ${showComments ? "text-blue-500" : "text-gray-600 hover:bg-gray-100"}`}>
          {showComments ? <FaComment /> : <FaRegComment />} Comment
        </button>
      </div>

      {/* Comment Section */}
      {showComments && (
        <div className="mt-3">
          <p className="text-sm text-gray-500 italic">Comment section coming soon...</p>
        </div>
      )}
     
    </div>
  );
};

export default PostCard;
