import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom';
import './login.css'

const Login = (props) => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const checkUserInfo = async (event) => {
        event.preventDefault();
        console.log(username);
        console.log(password);
        const request = await fetch('http://localhost:5000/userManagement/authentication', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const response = await request.json();
        console.log(response);
        if (response.status !== "success") {
            alert("Invalid Entry");

        } else {
            document.getElementById("login-form").submit();
        }
    }

    return (
        <div className='login-background'>
            <form id="login-form" onSubmit={checkUserInfo} className="Login" action="profileManagement">
                <h1>
                    LOGIN
                </h1>
                <br />
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <label htmlFor="usernm" className="input-group-text" id="basic-addon1">Username</label>
                    </div>
                    <input id="usernm" onChange={event => setUsername(event.target.value)} value={username} type="text" className="form-control" placeholder="user@example.com" aria-label="Username" aria-describedby="basic-addon1" required />
                </div>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <label htmlFor="passwrd" className="input-group-text" id="basic-addon1">Password</label>
                    </div>
                    <input id="passwrd" onChange={event => setPassword(event.target.value)} type="password" className="form-control" placeholder="********" aria-label="Username" aria-describedby="basic-addon1" required />
                </div>
                <div>
                    <button type='submit' className="btn btn-primary">Submit</button>
                </div>
                <br />
                <Link to="/registration">New User? Register here.</Link>
            </form>
        </div>

    )
};

export default Login;
