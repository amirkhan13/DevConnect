import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import ChangePassword from './pages/ChangePassword'
import {Routes ,Route} from 'react-router-dom'
import ProctectedRoutes from './components/ProctectedRoutes'
import NotFound from './components/NotFound'
import Feed from './components/Feed'
import CreatePost from './components/CreatePost'




function App() {


  return (
    <>
       <Routes>

       
        <Route path ='/' element ={<Home/>}/>
        <Route path ='/home' element ={<Home/>}/>
        <Route path ='/register' element ={<Register/>}/>
        <Route path ='/login' element ={<Login/>}/>

        
        


        {/* Protected Routes */}
        <Route path='/change-password' element={
          <ProctectedRoutes>

            <ChangePassword/>
          </ProctectedRoutes>
          }/>

          <Route path ='/feed' element={
          <ProctectedRoutes>
            <Feed/>
          </ProctectedRoutes>
          }/>

          <Route path ='/posts/create-post' element={
          <ProctectedRoutes>
            <CreatePost/>
          </ProctectedRoutes>
          }/>

           <Route path ='*' element={<NotFound/>}/>
       </Routes>
    </>
  )
}

export default App
