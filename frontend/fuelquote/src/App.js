import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom'


import Login from './components/pages/login.js';
import Registration from './components/pages/registration.js';
import FuelQuoteForm from './components/pages/fuelQuoteForm.js';
import FuelQuoteHistory from './components/pages/fuelQuoteHistory.js';
import ProfileManagement from './components/pages/profileManagement.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} /> 
        {/* ^ Maybe make a home page later and have it be pointed by this 
        instead of App since it seems that we can't write on the same page
        as the BrowserRouter. Or maybe just have login be this page since
        I think it is the frist page the user should encounter?*/}
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/fuelQuoteForm" element={<FuelQuoteForm />} />
        <Route path="/fuelQuoteHistory" element={<FuelQuoteHistory />} />
        <Route path="/profileManagement" element={<ProfileManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
