import React from "react";
import { Link, NavLink } from 'react-router-dom';

const NavigationBar = (props) => {

    const sleep = async (ms) => {
        await new Promise(resolve => setTimeout(resolve, ms));
    }

    const logoutHandler = (retrieved) => {
        retrieved.preventDefault();
        sleep(1000).then(function () { console.log("Sleep of 2 seconds successful."); document.getElementById("Logout-link").click(); })
    }

    return (
        <div className="container">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container mb-2">
                    <Link className="navbar-brand" to="/" style={{ textDecoration: 'none' }}>Group 33</Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="container">
                        <div className="collapse navbar-collapse" id="navbarNav">
                            {props.disableRest === true ?
                                <ul className="navbar-nav mr-auto mt-lg-0">
                                    <NavLink className="nav-item nav-link disabled" to="/profileManagement" style={{ pointerEvents: "none" }}>Profile Management</NavLink>
                                    <NavLink className="nav-item nav-link disabled" to="/fuelQuoteForm" style={{ pointerEvents: "none" }}>Fuel Quote Form</NavLink>
                                    <NavLink className="nav-item nav-link disabled" to="/fuelQuoteHistory" style={{ pointerEvents: "none" }}>Fuel Quote History</NavLink>
                                    {props.children}
                                </ul>
                                :
                                <ul className="navbar-nav mr-auto mt-lg-0">
                                    <NavLink className="nav-item nav-link" to="/profileManagement">Profile Management</NavLink>
                                    <NavLink className="nav-item nav-link" to="/fuelQuoteForm">Fuel Quote Form</NavLink>
                                    <NavLink className="nav-item nav-link" to="/fuelQuoteHistory">Fuel Quote History</NavLink>
                                    {props.children}
                                </ul>
                            }
                        </div>
                    </div>
                </div>
                <Link id="Logout-link" to="/login" style={{ textDecoration: 'none' }}>
                    <button onClick={logoutHandler} className="btn btn-outline-success ml-auto">Logout</button>
                </Link>
            </nav>
        </div>

    );
};

export default NavigationBar;