import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom'


import Login from './components/pages/login.js';
import Registration from './components/pages/registration.js';
import FuelQuoteHistory from './components/pages/fuelQuoteHistory.js';


function App() {
  return (
    // <div className="App">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} /> 
        {/* ^ Maybe make a home page later and have it be pointed by this 
        instead of App since it seems that we can't write on the same page
        as the BrowserRouter. Or maybe just have login be this page since
        I think it is the frist page the user should encounter?*/}
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/fuelQuoteHistory" element={<FuelQuoteHistory />} />
      </Routes>
    </BrowserRouter>
    //   <header className="App-header">
    //     <p>This is the hope page?</p>
    //   </header>      
    // </div>
  );
}

export default App;
