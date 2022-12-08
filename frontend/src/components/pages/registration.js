import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './registration.css';
import ClickAlert from './clickalert';
import Button from './Button';

const Registration = (props) => {

    const [button_state, setButton] = useState(false);
    const [errors] = useState({});
    const navigate = useNavigate();
    const [fetchError, setError] = useState();
    const invokePageError = (message, redirect) => {
        setButton(false);
        [].slice.call(document.getElementById("registration-form").elements).forEach(element => element.disabled = true);
        setError([message, () => navigate(redirect)]);
    }

    const checkEmpty = () => {
        const formFields = document.querySelectorAll(".form-control");
        if ([].slice.call(formFields).every(field => field.value))
            setButton(true);
        else
            setButton(false);
    };

    const usernameHandler = (event) => {
        document.getElementById('registeredAlert').style.display = 'none';
        checkEmpty();
        if (!event.target.value.trim().match(/^\w+(?:[.-]?\w+)*@\w+(?:[.-]?\w+)*(?:\.\w{2,3})+$/))
            errors["username"] = 1;
        else {
            delete errors["username"];
            document.getElementById('usernameAlert').style.display = 'none';
        }
    };

    const passwordHandler = (event) => {
        checkEmpty();
        if (!event.target.value.match(/^\S+$/))
            errors["password"] = 2;
        else {
            delete errors["password"];
            document.getElementById('passwordAlert').style.display = 'none';
        }
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        for (let err in errors)
            document.getElementById(err + 'Alert').style.display = 'block';
        if (Object.keys(errors).length > 0)
            return;
        const formFields = [].slice.call(document.querySelectorAll(".form-control")).map(e => e.value);
        try {
            const request = await fetch('http://localhost:5000/userManagement/addUser', {
                method: 'POST',
                body: JSON.stringify({ "username": formFields[0], "password": formFields[1] }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const response = await request.json();
            console.log(response);
            if (response.status === "error-duplicate") {
                document.getElementById('registeredAlert').style.display = 'block';
                console.error("User is already registered.");
                return;
            }
            else if (response.status !== "success") {
                invokePageError(`An error {${response.status}} has occured during registration request.`, "/");
                return;
            }
            else
                navigate('/login');
        }
        catch (err) {
            console.error(err);
            invokePageError("An unknown error has occurred during server request.", "/");
        }
    };

    useEffect(() => {
        const invokePageError = (message, redirect) => {
            setButton(false);
            [].slice.call(document.getElementById("registration-form").elements).forEach(element => { element.disabled = true; element.value = ''; });
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
        <div className='registration-background'>
            <form id="registration-form" onSubmit={submitHandler} className="Registration" action="/login" >
                <h1>
                    REGISTRATION
                </h1>
                <br />
                {!!fetchError ? <ClickAlert id="errorAlert" alertType={"danger"} color='rgb(100,0,0)' display='block' extraEvent={fetchError[1]}>{fetchError[0]}</ClickAlert> : null}
                <div className="input-group mb-0">
                    <div className="input-group-prepend">
                        <label htmlFor="usernm" className="input-group-text" id="basic-addon1">Create Username</label>
                    </div>
                    <input id="usernm" onChange={usernameHandler} type="email" className="form-control" placeholder="user@example.com" aria-label="Username" aria-describedby="basic-addon1" maxLength={30} required />
                </div>
                <small className="form-text text-muted pt-0 mt-0 mb-3">Username should be of email format.</small>

                <ClickAlert id="usernameAlert" alertType={"danger"} color='rgb(150,0,0)'>Username must be in valid email format.</ClickAlert>
                <ClickAlert id="registeredAlert" alertType={"danger"} color='rgb(100,0,0)' fontSize='10pt'>This user already exists. Please login instead.</ClickAlert>

                <div className="input-group mb-0">
                    <div className="input-group-prepend">
                        <label htmlFor="passwrd" className="input-group-text" id="basic-addon1">Create Password</label>
                    </div>
                    <input id="passwrd" onChange={passwordHandler} type="text" className="form-control" placeholder="********" aria-label="Password" aria-describedby="basic-addon1" minLength={8} maxLength={16} required />
                </div>
                <small className="form-text text-muted pt-0 mt-0 mb-3">Password should be 8 to 16 characters without whitespaces.</small>

                <ClickAlert id="passwordAlert" alertType={"danger"} color='rgb(150,0,0)'>Password cannot contain whitespaces.</ClickAlert>

                <div>
                    <Button disabled={!button_state} type="submit" id="submit-register"> Submit </Button>
                </div>
                <br />
                <Link to="/login">Already a user? Login</Link>
            </form>
        </div>

    )
};

export default Registration;
