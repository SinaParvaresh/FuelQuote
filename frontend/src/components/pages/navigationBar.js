import React from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const NavigationBar = (props) => {

    const [cookies, , removeCookie] = useCookies(['user-token']);
    const navigate = useNavigate();

    const logoutHandler = async (event) => {
        event.preventDefault();
        try {
            if (!cookies.Token) {
                navigate('/login');
                return;
            }
            const request = await fetch('http://localhost:5000/userManagement/logout', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Token': cookies.Token
                }
            });
            Object.keys(cookies).forEach(c => removeCookie(c, { domain: "localhost" }));
            const response = await request.json();
            console.log(response);
            // console.log(!props.pageError);
            if ((response.status !== "success") && (response.cause !== "missing") && (!props.pageError))
                alert("An error occured while logging out.");
            navigate('/login');
        }
        catch (err) {
            console.error(err);
            alert("An unknown error has occurred during server request.");
            navigate('/login');
        }
    };

    const disableClick = (linkAddress) => {
        if (props.pageError === linkAddress)
            return {};
        return ((props.disableLinks || props.pageError) === true ? { pointerEvents: "none" } : {});
    };

    visualViewport.onresize = () => {
        const icon = document.getElementById("menu_toggler_icon")
        if (icon == null)
            return;
        const navMenu = document.getElementById("navbarNav")
        if (icon.offsetParent !== null)
            navMenu.classList.add("ml-3");
        else
            navMenu.classList.remove("ml-3");
    };

    return (
        <div className="container">
            <nav className="navbar navbar-expand-md navbar-light bg-light">
                <NavLink className="navbar-brand" to="/" style={{ textDecoration: 'none' }}>Group 33</NavLink>
                <button onClick={logoutHandler} className="btn btn-outline-success" style={{ position: "absolute", top: "10px", right: "15px" }}>Logout</button>
                <button className="navbar-toggler mr-auto" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span id="menu_toggler_icon" className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mr-auto mt-lg-0">
                        <NavLink className="nav-item nav-link disabled" to="/profileManagement" style={disableClick("/profileManagement")}>Profile Management</NavLink>
                        <NavLink className="nav-item nav-link disabled" to="/fuelQuoteForm" style={disableClick("/fuelQuoteForm")}>Fuel Quote Form</NavLink>
                        <NavLink className="nav-item nav-link disabled" to="/fuelQuoteHistory" style={disableClick("/fuelQuoteHistory")}>Fuel Quote History</NavLink>
                        {props.children}
                    </ul>
                </div>
            </nav>
        </div>
    );
};

export default NavigationBar;