import React from "react";
import { Link, NavLink, useNavigate } from 'react-router-dom';
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
                method: 'POST',
                body: JSON.stringify({ token: cookies.Token }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            // removeCookie('Token', { path: '/', domain: "localhost" });
            Object.keys(cookies).forEach(c => removeCookie(c, { domain: "localhost" }));
            const response = await request.json();
            console.log(response);
            if ((response.status !== "success") && (response.cause !== "missing"))
                alert("An error occured while logging out.");
            navigate('/login');
        }
        catch (err) {
            console.error(err);
        }
    };

    const disableClick = () => {
        return props.disableRest === true ? { pointerEvents: "none" } : {};
    };

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
                            <ul className="navbar-nav mr-auto mt-lg-0">
                                <NavLink className="nav-item nav-link disabled" to="/profileManagement" style={disableClick}>Profile Management</NavLink>
                                <NavLink className="nav-item nav-link disabled" to="/fuelQuoteForm" style={disableClick}>Fuel Quote Form</NavLink>
                                <NavLink className="nav-item nav-link disabled" to="/fuelQuoteHistory" style={disableClick}>Fuel Quote History</NavLink>
                                {props.children}
                            </ul>
                        </div>
                    </div>
                </div>
                {/* <Link id="Logout-link" to="/login" style={{ textDecoration: 'none' }}> */}
                <button onClick={logoutHandler} className="btn btn-outline-success ml-auto">Logout</button>
                {/* </Link> */}
            </nav>
        </div>

    );
};

export default NavigationBar;