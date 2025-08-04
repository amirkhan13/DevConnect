import React, { useEffect, useState } from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { useDispatch, useSelector } from 'react-redux';
import LeftSidebar from './LeftSideBar';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import { setPosts, setError, setLoading } from '../store/postSlice';
import { setUser } from '../store/authSlice';
import axios from 'axios';
import Loader from './Loader';

const Feed = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const loading = useSelector((state) => state.posts.loading);
  const user = useSelector((state)=>state.auth.user)
  const [showModal, setShowModal] = useState(false);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const { data } = await axios.get('/api/v1/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setUser(data.user));
    } catch (error) {
      dispatch(setError("Failed to fetch the user"));
    }
  };

  const fetchPosts = async () => {
    try {
      dispatch(setLoading(true));
      const token = localStorage.getItem('token');
      const { data } = await axios.get('/api/v1/posts/getAllPosts', {
        
        headers: { Authorization: `Bearer ${token}` },
      });
      
      dispatch(setPosts(data.data));
    } catch (err) {
      dispatch(setError("Failed to fetch posts"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex flex-1 justify-center bg-gray-50">
        <div className="hidden lg:block w-64 p-4">
          <LeftSidebar compact />
        </div>

        <div className="w-full max-w-2xl mx-4 py-10">
          <div className="p-6 mb-1">

  <div 
    onClick={() => setShowModal(true)}
    className="cursor-pointer bg-white rounded-2xl px-5 py-4 border mt-10 border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-3"
  >
    <img
      src={user?.avatar || '/imgs/default avatar.jpg'}
      alt="avatar"
      className="w-10 h-10 rounded-full object-cover"
    />
    <span className="text-gray-600 text-base font-medium">
      What's on your mind, {user?.fullName?.split(' ')[0]}?
    </span>
  </div>
</div>
   <hr className="border-t border-gray-300 my-2 w-2/4 mx-auto" />




          {loading ? (
            <div className='flex justify-center  items-center'>

              <Loader/>
            </div>
          ) : (
            <div className="space-y-4 p-4">
              {posts.map((post, index) => (
                <PostCard key={index} post={post} compact />
              ))}
            </div>
          )}
        </div>

        <div className="hidden xl:block w-64 p-4" />
      </div>

      <Footer />

      {/* Create Post Modal */}
      <CreatePost
        showModal={showModal}
        setShowModal={setShowModal}
        fetchPosts={fetchPosts}
      />
    </div>
  );
};

export default Feed;
