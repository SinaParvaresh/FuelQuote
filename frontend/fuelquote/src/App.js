import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom'


import Login from './components/pages/login.js';
import FuelQuoteHistory from './components/pages/fuelQuoteHistory.js';



function App() {
  return (
   <BrowserRouter>
     <Routes>
       <Route path="/" element={<App />}/>
       <Route path="/login" element={<Login />}/>
       <Route path="/fuelQuoteHistory" element={<FuelQuoteHistory />}/>
     </Routes>
   </BrowserRouter>
  );
}

export default App;
