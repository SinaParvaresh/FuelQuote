import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom'


import Login from './components/pages/login.js';



function App() {
  return (
   <BrowserRouter>
     <Routes>
       <Route path="/" element={<App />}/>
       <Route path="/login" element={<Login />}/>
     </Routes>
   </BrowserRouter>
  );
}

export default App;
