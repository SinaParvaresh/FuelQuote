import React from 'react'
import { Link } from 'react-router-dom';
import './homePage.css'

const HomePage = () => {
    return (
        <div className='homePage-background'>
            <div className="HomePage">
                <h1 className="text-uppercase font-weight-bold text-lg-center">
                    Welcome<br />to the Fuel Quote Website<br />of GROUP 33!!!
                </h1>
                <br />
                <Link to="/login" style={{ textDecoration: 'none' }}>
                    <button className="btn btn-outline-secondary btn-lg btn-block text-uppercase font-weight-bold">Click here to Login!</button>
                </Link>
            </div>
        </div>
    )
};

export default HomePage;
