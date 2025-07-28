import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'

import {Routes ,Route} from 'react-router-dom'
import ChangePassword from './pages/ChangePassword'


function App() {


  return (
    <>
       <Routes>

        <Route path ='/' element ={<Home/>}/>
        <Route path ='/home' element ={<Home/>}/>
        <Route path ='/register' element ={<Register/>}/>
        <Route path ='/login' element ={<Login/>}/>

        {/* Protected Routes */}
        <Route path='/change-password' element={<ChangePassword/>}/>

       </Routes>
    </>
  )
}

export default App
