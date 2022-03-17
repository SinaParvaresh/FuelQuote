import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom';
import './login.css'
import Button from './Button';

const Login = (props) => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [button_state, setButton] = useState(false);

    const checkEmpty = () => {
        const fields = document.querySelectorAll(".form-control");
        if ([].slice.call(fields).reduce((prev, curr) => prev * (!!curr.value), 1))
            setButton(true);
        else
            setButton(false);
    };

    const usernameHandler = (event) => {
        checkEmpty();
        setUsername(event.target.value.trim());
    };

    const passwordHandler = (event) => {
        checkEmpty();
        setPassword(event.target.value);
    };

    const checkUserInfo = async (event) => {
        event.preventDefault();
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
    };

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
                    <input id="usernm" onChange={usernameHandler} value={username} type="text" className="form-control" placeholder="user@example.com" aria-label="Username" aria-describedby="basic-addon1" required />
                </div>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <label htmlFor="passwrd" className="input-group-text" id="basic-addon1">Password</label>
                    </div>
                    <input id="passwrd" onChange={passwordHandler} type="password" className="form-control" placeholder="********" aria-label="Username" aria-describedby="basic-addon1" required />
                </div>
                <div>
                    <Button disabled={!button_state} type="submit"> Submit </Button>
                </div>
                <br />
                <Link to="/registration">New User? Register here.</Link>
            </form>
        </div>

    )
};

export default Login;
