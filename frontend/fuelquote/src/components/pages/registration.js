import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import './registration.css'

const Registration = (props) => {

    const [button_state, setButton] = useState(true);
    const [errors, setErrors] = useState({});

    const checkEmpty = (retrieved) => {
        let fields = document.querySelectorAll("[class^='form-control']");

        if ([].slice.call(fields).reduce((prev, curr) => prev * (!!curr.value), 1))
            setButton(false);
        else
            setButton(true);
    }

    const submitHandler = async (retrieved) => {
        retrieved.preventDefault();

        for (let err in errors)
            document.getElementById(err + 'Alert').style.display = 'block';

        if (Object.keys(errors).length > 0)
            return;

        const fields = [].slice.call(document.querySelectorAll("[class^='form-control']")).map(e => e.value);
        // const fields = [].slice.call(retrieved.target).map(e => e.value);
        console.log(fields);

        const response = await fetch('http://localhost:5000/userManagement/addUser', {
            method: 'POST',
            body: JSON.stringify({ "username": fields[0], "password": fields[1] }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log(data);
        if (data.status != "success")
            alert("This user already exists. Please login instead.");
        else
            document.getElementById("registration-form").submit();
    }

    const usernameHandler = (retrieved) => {
        checkEmpty(retrieved);

        if (!retrieved.target.value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/))
            errors["username"] = 1;
        else {
            delete errors["username"];
            document.getElementById('usernameAlert').style.display = 'none';
        }
    }

    const passwordHandler = (retrieved) => {
        checkEmpty(retrieved);

        if (!retrieved.target.value.match(/^\S+$/))
            errors["password"] = 2;
        else {
            delete errors["password"];
            document.getElementById('passwordAlert').style.display = 'none';
        }
    }

    const closeAlert = (retrieved) => {
        document.getElementById(retrieved.target.offsetParent.id).style.display = 'none';
    }

    return (
        <div className='registration-background'>
            <form id="registration-form" onSubmit={submitHandler} className="Registration" action="/login" >
                <h1>
                    REGISTRATION
                </h1>
                <br />
                <div className="input-group mb-0">
                    <div className="input-group-prepend">
                        <label htmlFor="usernm" className="input-group-text" id="basic-addon1">Create Username</label>
                    </div>
                    <input id="usernm" onChange={usernameHandler} type="email" className="form-control" placeholder="user@example.com" aria-label="Username" aria-describedby="basic-addon1" maxLength={30} required />
                </div>
                <small className="form-text text-muted pt-0 mt-0 mb-3">Username should be of email format.</small>

                <div id="usernameAlert" className="alert alert-danger collapse" role="alert">
                    <span className="text-center font-weight-bold" style={{ color: 'rgb(150,0,0)', fontSize: '11pt' }}>Username must be in valid email format.</span>
                    <button type="button" className="close" onClick={closeAlert} aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div className="input-group mb-0">
                    <div className="input-group-prepend">
                        <label htmlFor="passwrd" className="input-group-text" id="basic-addon1">Create Password</label>
                    </div>
                    <input id="passwrd" onChange={passwordHandler} type="text" className="form-control" placeholder="********" aria-label="Password" aria-describedby="basic-addon1" minLength={8} maxLength={16} required />
                </div>
                <small className="form-text text-muted pt-0 mt-0 mb-3">Password should be 8 to 16 characters without whitespaces.</small>

                <div id="passwordAlert" className="alert alert-danger collapse" role="alert">
                    <span className="text-center font-weight-bold" style={{ color: 'rgb(150,0,0)', fontSize: '11pt' }}>Password cannot contain whitespaces.</span>
                    <button type="button" className="close" onClick={closeAlert} aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div>
                    <button disabled={button_state} type="submit" id="submit-register" className="btn btn-primary">Submit</button>
                </div>
                <br />
                <Link to="/login">Already a user? Login</Link>
            </form>
        </div>

    )
};

export default Registration;
