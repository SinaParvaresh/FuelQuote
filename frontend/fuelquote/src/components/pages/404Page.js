import React from 'react';
import { Link } from 'react-router-dom';
const PageNotFound = () => {
    const styling = {
        textAlign: 'center', margin: 0, position: 'absolute', top: '50%', left: '50%',
        msTransform: 'translate(-50%, -50%)', transform: 'translate(-50%, -50%)'
    };
    console.error("This page does not exist.\nTry navigating to one of the following:" +
        "\n'/', '/login', '/registration', '/profileManagement', '/fuelQuoteForm', '/fuelQuoteHistory'");
    return (
        <div style={styling}>
            <h1>404 Error</h1>
            <h4>Page Not Found</h4>
            <p><Link to="/">Click here to return to home page.</Link></p>
        </div>
    );
}

export default PageNotFound;