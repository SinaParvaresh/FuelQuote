import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom'


import Login from './components/pages/login';
import Registration from './components/pages/registration';
import FuelQuoteForm from './components/pages/fuelQuoteForm';
import FuelQuoteHistory from './components/pages/fuelQuoteHistory';
import ProfileManagement from './components/pages/profileManagement';
import HomePage from './components/pages/homePage';

function App() {
  const [clientCredentials,setCredentials] = useState({});

  const printCredentials=(word)=>{
    console.log("App_u"+word+" || "+clientCredentials.username);
    console.log("App_p"+word+" || "+clientCredentials.password);
  }

  const changeCredentials=(newCredentials)=>{
    printCredentials('2');
    for(let cred in newCredentials)
    clientCredentials[cred]=newCredentials[cred];
    printCredentials('3');
  }

  // printCredentials('1');
  // changeCredentials({'username':'someUser','password':'123456'});
  // printCredentials('4');


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} /> 
        {/* ^ Maybe make a home page later and have it be pointed by this 
        instead of App since it seems that we can't write on the same page
        as the BrowserRouter. Or maybe just have login be this page since
        I think it is the frist page the user should encounter?*/}
        <Route path="/login" element={<Login credentials={clientCredentials} updateCredentials={changeCredentials}/>} />
        <Route path="/registration" element={<Registration credentials={clientCredentials} updateCredentials={changeCredentials}/>} />
        <Route path="/fuelQuoteForm" element={<FuelQuoteForm />} />
        <Route path="/fuelQuoteHistory" element={<FuelQuoteHistory />} />
        <Route path="/profileManagement" element={<ProfileManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
