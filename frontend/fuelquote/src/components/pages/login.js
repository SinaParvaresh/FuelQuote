import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom';
import './login.css'

const Login = (props) => {

    //let history = useHistory();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    //const checkUserInfo = async (event) => {
    const checkUserInfo = async (event) => {
        event.preventDefault();
        console.log(username);
        console.log(password);

        const response = await fetch('http://localhost:5000/userManagement/authentication', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log(data);
        if (data.status != "success") {
            alert("Invalid Entry");

        } else {
            //Navigate to the next page
            //props.login(username,data.users[0].first_name)
            /*           alert("Success"); */
            document.getElementById("login-form").submit();
            //props.history.push(`/dashboard/${body.data.users[0].first_name}`);
            //history.push(`/fuelQuoteHistory/${data.users[0].first_name}`);
        }

    }

    // const submitHandler = (event) => {
    //     event.preventDefault();
    // }

    return (
        <div className='login-background'>
            <form id="login-form" onSubmit={checkUserInfo} className="Login" action="profileManagement">
                <h1>
                    LOGIN
                </h1>
                <br />
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">Username</span>
                    </div>
                    <input onChange={event => setUsername(event.target.value)} value={username} type="text" className="form-control" placeholder="user@example.com" aria-label="Username" aria-describedby="basic-addon1" required />
                </div>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">Password</span>
                    </div>
                    <input onChange={event => setPassword(event.target.value)} type="password" className="form-control" placeholder="********" aria-label="Username" aria-describedby="basic-addon1" required />
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
