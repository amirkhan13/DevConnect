import React, { useEffect } from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { useDispatch, useSelector } from 'react-redux';
import LeftSidebar from './LeftSideBar';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import { setError, setLoading, setUser } from '../store/authSlice';
import { setPosts } from '../store/postSlice';
import axios from 'axios';

const Feed = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const { data } = await axios.get('/api/v1/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(setUser(data.user));
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
        }
        dispatch(setError(error.response?.data?.message || "Failed to fetch user"));
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
        dispatch(setLoading(false));
      } catch (err) {
        dispatch(setError("Failed to fetch posts"));
        dispatch(setLoading(false));
      }
    };

    fetchUser();
    fetchPosts();
  }, [dispatch]);

  return (
    <div className="flex justify-evenly flex-col min-h-screen my-10">
      <Header />

      <div className="flex flex-1 w-full bg-gray-50">
        <div className="hidden lg:block">
          <LeftSidebar />
        </div>

        <main className="flex-grow w-full max-w-3xl mx-auto px-4 py-6">
          <CreatePost />
          <div className="mt-6 space-y-6">
            {posts.map((post, index) => (
              <PostCard key={index} post={post} />
            ))}

          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Feed;
