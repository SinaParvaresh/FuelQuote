import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import './login.css'

const Login = () => {
    return (
        <div className='login-background'>
            <form className="Login" >
                <h1>
                    LOGIN
                </h1>
                <br/>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">Username</span>
                    </div>
                    <input type="text" className="form-control" placeholder="user@example.com" aria-label="Username" aria-describedby="basic-addon1" required/>
                </div>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">Password</span>
                    </div>
                    <input type="password" className="form-control" placeholder="********" aria-label="Username" aria-describedby="basic-addon1" required/>
                </div>
                <div>
                    <button className="btn btn-primary">Submit</button>
                </div>
                <br/>
                <Link to="/registration">New User? Register here.</Link>
            </form>
        </div>

    )
};

export default Login;
