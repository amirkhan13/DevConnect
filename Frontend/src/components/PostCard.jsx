import React from 'react';
import { FaHeart, FaRegCommentDots } from 'react-icons/fa';
import moment from 'moment';

function PostCard({ post }) {
    console.log(post);
  return (
    <div className="bg-white w-full shadow-md rounded-lg p-4 mb-4">
      {/* Author Info */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <img
            src={post?.author?.avatar || '/default-avatar.png'}
            alt={post?.author?.fullName}
            className="w-9 h-9 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-sm sm:text-base">{post?.author?.fullName}</span>
            {post?.author?.Bio && (
              <span className="text-xs sm:text-sm text-gray-500">{post?.author?.Bio}</span>
            )}
          </div>
        </div>
        <div className="text-xs sm:text-sm text-gray-500">
          {moment(post?.createdAt).fromNow()}
        </div>
      </div>

      {/* Post Content */}
      <p className="text-gray-800 whitespace-pre-wrap text-sm sm:text-base">{post?.content}</p>

      {/* Tags */}
      <div className="text-sm text-blue-500 mt-2 flex flex-wrap gap-2">
        {post?.tags?.map((tag, index) => (
          <span key={index}>#{tag}</span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6 mt-3 text-gray-600 text-sm sm:text-base">
        <button className="flex items-center gap-1 hover:text-red-500">
          <FaHeart />
          <span>Like</span>
        </button>
        <button className="flex items-center gap-1 hover:text-blue-500">
          <FaRegCommentDots />
          <span>Comment</span>
        </button>
      </div>
    </div>
  );
}

export default PostCard;
