import { React, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './registration.css';
import ClickAlert from './clickalert';
import Button from './Button';

const Registration = (props) => {

    const [button_state, setButton] = useState(false);
    const [errors] = useState({});
    const navigate = useNavigate();

    const checkEmpty = () => {
        const fields = document.querySelectorAll(".form-control");
        if ([].slice.call(fields).reduce((prev, curr) => prev * (!!curr.value), 1))
            setButton(true);
        else
            setButton(false);
    };

    const usernameHandler = (event) => {
        checkEmpty();
        if (!event.target.value.trim().match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/))
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
        const fields = [].slice.call(document.querySelectorAll(".form-control")).map(e => e.value);
        try {
            const request = await fetch('http://localhost:5000/userManagement/addUser', {
                method: 'POST',
                body: JSON.stringify({ "username": fields[0], "password": fields[1] }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const response = await request.json();
            console.log(response);
            if (response.status !== "success")
                alert("This user already exists. Please login instead.");
            else
                navigate('/login');
            // document.getElementById("registration-form").submit();
        }
        catch (err) {
            console.error(err);
        }
    };

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

                <ClickAlert id="usernameAlert" alertType={"danger"} color='rgb(150,0,0)'>Username must be in valid email format.</ClickAlert>

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
