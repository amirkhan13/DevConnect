import React, { useEffect, useState } from 'react';
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import { useDispatch } from 'react-redux';
import LeftSidebar from './LeftSideBar';
import { setError, setLoading, setUser } from '../store/authSlice';
import axios from 'axios';
import CreatePost from './CreatePost';


const Feed = () => {

    const dispatch = useDispatch();
    const[showModal , setShowModal] = useState(false);

    useEffect(() => {

        const fetchUser =async()=>{
            try {
                const {data} = await axios.get('/api/v1/users/me');
                dispatch(setUser(data.user))
            } catch (error) {
                console.log("failed to fetch the user" , error);
                
            }
        }

        fetchUser();

    
     
    }, [dispatch])
    
  return (
    <>
   
        <Header/>
    <div className='flex'>
  
        <LeftSidebar/>
        <CreatePost/>


    {/* <div className="max-w-2xl mx-auto p-4 space-y-4"> */}

      {/* {posts.map(post => (
        <div key={post.id} className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gray-200" />
            <div>
              <h2 className="font-bold text-lg">{post.name}</h2>
              <p className="text-sm text-gray-500">{post.title}</p>
            </div>
          </div>
          <p className="mt-4 text-gray-800">{post.content}</p>
          <p className="text-sm text-gray-400 mt-2">{post.time}</p>
        </div>
      ))}
    </div> */}
    {/* <Footer/>    */}
      </div>

       </>
  );
};

export default Feed;
