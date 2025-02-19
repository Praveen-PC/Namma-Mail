import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Register from './components/users/Register'
import Login from './components/users/Login';
import PrivateRouter from './components/users/PrivateRouter';
import Dashboard from './components/dashboard/Dashboard';
import Admin from './components/dashboard/Admin';





const App = () => {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/register' element={<Register/>} />
      <Route path='/' element={<Login/>}/>

    
      <Route path='/dashboard' element={<PrivateRouter><Dashboard/></PrivateRouter>}/>
       <Route path='/adminpanel'  element={<PrivateRouter ><Admin/></PrivateRouter>}/>

      
    
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App