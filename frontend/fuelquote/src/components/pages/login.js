import React, { useState, useEffect } from 'react'
import './login.css'

const Login = () => {
    return (
        <div>
            <form className="Login" >
                <h1>
                    LOGIN
                </h1>
                <div className='form-group row'>
                    <label className="col-sm-2 col-form label">Email</label>
                    <div className="col-sm-10">
                        <input type="text" className="form-control" placeholder="email@example.com" />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Password</label>
                    <div className="col-sm-10">
                        <input type="password" className="form-control" id="inputPassword" placeholder="Password" />
                    </div>
                </div>
                <br/>
                <div>
                    <button className="btn btn-primary">Submit</button>
                </div>
            </form>
        </div>
        
    )
};

export default Login;
