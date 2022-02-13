import React, { useState, useEffect } from 'react'
import './login.css'

const Login = () => {
    return (
        <div className='login-background'>
            <form className="Login" >
                <h1>
                    LOGIN
                </h1>
                <br/>
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="basic-addon1">Username</span>
                    </div>
                    <input type="text" class="form-control" placeholder="user@example.com" aria-label="Username" aria-describedby="basic-addon1" />
                </div>
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="basic-addon1">Password</span>
                    </div>
                    <input type="text" class="form-control" placeholder="**********" aria-label="Username" aria-describedby="basic-addon1" />
                </div>
                <div>
                    <button className="btn btn-primary">Submit</button>
                </div>
            </form>
        </div>

    )
};

export default Login;
