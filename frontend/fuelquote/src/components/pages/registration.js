import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import './registration.css'

const Registration = () => {

    const [button_state, setButton] = useState('disabled');
    const [errors, setErrors] = useState({});

    const checkEmpty = (retrieved) => {
        let fields = document.querySelectorAll("[class^='form-control']");

        if ([].slice.call(fields).reduce((prev, curr) => prev * (!!curr.value), 1))
            setButton('');
        else
            setButton('disabled');
    }

    const submitHandler = (retrieved) => {
        if (Object.keys(errors).length > 0)
            retrieved.preventDefault();

        // const fields=[].slice.call(document.querySelectorAll("[class^='form-con']")).map(e=>e.value);
        const fields = [].slice.call(retrieved.target).map(e => e.value);

        // let errorMsg=errors.reduce((prev,curr)=>prev+'\n'+curr,'')
        let errorsMsg = "";
        for (let err in errors)
            errorsMsg += errors[err] + '\n';
        if (errorsMsg.length > 0)
            alert(errorsMsg.trim());
    }

    const usernameHandler = (retrieved) => {
        checkEmpty(retrieved);

        if (!retrieved.target.value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/))
            errors["username"] = "Username must be in valid email format";
        else
            delete errors["username"];
    }

    const passwordHandler = (retrieved) => {
        checkEmpty(retrieved);

        if (retrieved.target.value.length < 8)
            errors["password"] = "Password must be at least 8 characters long.";
        else if (!retrieved.target.value.match(/^\S+$/))
            errors["password"] = "Password cannot contain whitespaces.";
        else
            delete errors["password"];
    }

    return (
        <div className='registration-background'>
            <form onSubmit={submitHandler} className="Registration" >
                <h1>
                    REGISTRATION
                </h1>
                <br />
                <div className="input-group mb-0">
                    <div className="input-group-prepend">
                        <label htmlFor="usernm" className="input-group-text" id="basic-addon1">Create Username</label>
                    </div>
                    <input id="usernm" onChange={usernameHandler} type="email" className="form-control" placeholder="user@example.com" aria-label="Username" aria-describedby="basic-addon1" maxLength={30} required/>
                </div>
                    <small className="form-text text-muted pt-0 mt-0 mb-3">Username should be of email format.</small>
                <div className="input-group mb-0">
                    <div className="input-group-prepend">
                        <label htmlFor="passwrd" className="input-group-text" id="basic-addon1">Create Password</label>
                    </div>
                    <input id="passwrd" onChange={passwordHandler} type="text" className="form-control" placeholder="********" aria-label="Password" aria-describedby="basic-addon1" maxLength={16} required/>
                </div>
                    <small className="form-text text-muted pt-0 mt-0 mb-3">Password should be at least 8 characters without whitespaces.</small>
                    {/* Replace alert with style={{}} and useState for span message. */}
                <div>
                    <button disabled={button_state} id="submit-register" className="btn btn-primary">Submit</button>
                </div>
                <br/>
                <Link to="/login">Already a user? Login</Link>
            </form>
        </div>

    )
};

export default Registration;
