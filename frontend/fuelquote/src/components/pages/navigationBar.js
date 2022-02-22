import React from "react";
import { Link } from 'react-router-dom';

const NavigationBar = (props) => {

    const determineActive=(listItem)=>{
        const original = "nav-item"
        if(listItem==props.pageName)
            return original+" active";
        return original;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const logoutHandler=(retrieved)=>{
        // retrieved.preventDefault();
        // sleep(1000000000);
    }

    return (
        <div className="container">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container mb-2">
                    <Link className="navbar-brand" to="#">Group 33</Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="container">
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav mr-auto mt-lg-0">
                                <li className={determineActive("ProfileManagement")}>
                                    <Link className="nav-link" to="/profileManagement">Profile Management</Link>
                                </li>
                                <li className={determineActive("FuelQuoteForm")}>
                                    <Link className="nav-link" to="/fuelQuoteForm">Fuel Quote Form</Link>
                                </li>
                                <li className={determineActive("FuelQuoteHistory")}>
                                    <Link className="nav-link" to="/fuelQuoteHistory">Fuel Quote History</Link>
                                </li>
                                {props.children}
                            </ul>
                        </div>
                    </div>
                </div>
                <Link onClick={logoutHandler} to="/login">
                <button className="btn btn-outline-success ml-auto">Logout</button>
                </Link>
            </nav>
        </div>

    );
};

export default NavigationBar;