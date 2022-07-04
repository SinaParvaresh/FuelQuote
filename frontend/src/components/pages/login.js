import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import './login.css'
import ClickAlert from './clickalert';
import Button from './Button';

const Login = (props) => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [button_state, setButton] = useState(false);
    const [, setCookie] = useCookies(['user-token']);
    const navigate = useNavigate();
    const [fetchError, setError] = useState();
    const invokePageError = (message, redirect) => {
        setButton(false);
        [].slice.call(document.getElementById("login-form").elements).forEach(element => element.disabled = true);
        setError([message, () => navigate(redirect)]);
    }

    const checkEmpty = () => {
        document.getElementById('loginAlert').style.display = 'none';
        const formFields = document.querySelectorAll(".form-control");
        if ([].slice.call(formFields).every(field => field.value))
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
        try {
            const request = await fetch('http://localhost:5000/userManagement/authentication', {
                method: 'POST',
                body: JSON.stringify({ "username": username, "password": password }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const response = await request.json();
            console.log(response);
            if (response.status === "error-credentials") {
                document.getElementById('loginAlert').style.display = 'block';
                console.error("Invalid credentials.");
            }
            else if (response.status !== "success") {
                invokePageError(`An error {${response.status}} has occured during registration request.`, "/");
                return;
            }
            else {
                setCookie('Token', response.data.token, { path: '/', maxAge: Math.round(response.data.expiration / 1000) });
                navigate('/profileManagement');
            }
        }
        catch (err) {
            console.error(err);
            invokePageError("An unknown error has occurred during server request.", "/");
        }
    };

    useEffect(() => {
        const invokePageError = (message, redirect) => {
            setButton(false);
            [].slice.call(document.getElementById("login-form").elements).forEach(element => { element.disabled = true; element.value = ''; });
            setError([message, () => navigate(redirect)]);
        }
        const checkServer = async () => {
            try {
                const request = await fetch('http://localhost:5000', {
                    method: 'HEAD'
                });
                await request.json();
            }
            catch (err) {
                console.error(err);
                invokePageError("Can't reach server. Please try again later.", "/");
            }
        };
        checkServer();
    }, [navigate]);

    return (
        <div className='login-background'>
            <form id="login-form" onSubmit={checkUserInfo} className="Login" action="/profileManagement">
                <h1>
                    LOGIN
                </h1>
                <br />
                {!!fetchError ? <ClickAlert id="errorAlert" alertType={"danger"} color='rgb(100,0,0)' display='block' extraEvent={fetchError[1]}>{fetchError[0]}</ClickAlert> : null}
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

                <ClickAlert id="loginAlert" alertType={"danger"} color='rgb(100,0,0)'>Invalid Credentials.</ClickAlert>

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
