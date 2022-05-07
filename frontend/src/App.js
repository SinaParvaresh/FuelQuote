import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap-4-react';

import Login from './components/pages/login';
import Registration from './components/pages/registration';
import FuelQuoteForm from './components/pages/fuelQuoteForm';
import FuelQuoteHistory from './components/pages/fuelQuoteHistory';
import ProfileManagement from './components/pages/profileManagement';
import HomePage from './components/pages/homePage';
import PageNotFound from './components/pages/404Page';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/fuelQuoteForm" element={<FuelQuoteForm />} />
        <Route path="/fuelQuoteHistory" element={<FuelQuoteHistory />} />
        <Route path="/profileManagement" element={<ProfileManagement />} />
        <Route path="*" element={<PageNotFound />} />
        {/* The following line can be used to replace the above if you want
         to redirect to homepage insted of 404 when accessing invalid URLs */}
        {/* <Route path="*" element={<Navigate to='/' replace/>} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// Hello everyone. These are the requirements for the project demo that you will be graded on:
// The app/website is running i.e. when the user enters the address e.g. localhost:3000 it displays a homepage (login/registration).
// Users are able to log in / sign up on the website.
// Users are able to edit their profiles and save them.
// Users can get a fuel quote.
// Users can access fuel quote history.
// All forms are properly validated.
// Check the DB for all the updates a user does.
// Contribution of each team member to the project, and showing it in the code.
// Code coverage and Unit tests.
// Good luck