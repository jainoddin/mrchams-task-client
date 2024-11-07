import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Loginpage from "./components/Loginpage"
import Admindetails from './components/Admindetails';
import Userdetails from './components/Userdetails';
import { UserProvider } from '../src/components/UserContext';
import Registration from './components/Registration'

const App = () => {
  return (
   <>
   <UserProvider>
   <BrowserRouter>
   <Routes>
   <Route path="/" element={<Loginpage></Loginpage>}></Route>
   <Route path="/adminlogin" element={<Admindetails></Admindetails>}></Route>
   <Route path="/userlogin" element={<Userdetails></Userdetails>}></Route>
   <Route path="/reg" element={<Registration></Registration>}></Route>



   </Routes>
   </BrowserRouter>
   </UserProvider>
   </>
  )
}

export default App