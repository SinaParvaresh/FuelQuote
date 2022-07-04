import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Button from "./Button";
import NavigationBar from "./navigationBar";
import ClickAlert from './clickalert';

const ProfileManagement = (props) => {

  const [cookies, setCookie] = useCookies(['user-token']);
  const navigate = useNavigate();
  const [fetchError, setError] = useState();
  const invokePageError = (message, redirect) => {
    setButton(false);
    [].slice.call(document.getElementById("profile-form").elements).forEach(element => element.disabled = true);
    setError([message, () => navigate(redirect)]);
  }

  const [enteredName, setEnteredName] = useState("");
  const [enteredAddress, setEnteredAddress] = useState("");
  const [enteredSecondAddress, setEnteredSecondAddress] = useState("");
  const [enteredCity, setEnteredCity] = useState("");
  const [enteredStateUS, setEnteredStateUS] = useState("");
  const [enteredZipcode, setEnteredZipcode] = useState("");

  const [profileIsStored, setProfileBool] = useState(false);
  const [recievedProfileInfo, setProfileInfo] = useState({});
  const [button_state, setButton] = useState(false);

  const checkEmpty = () => {
    const formFields = document.querySelectorAll("[class='form-control']");
    if ([].slice.call(formFields).every(field => field.value))
      setButton(true);
    else
      setButton(false);
  };

  const nameChangedHandler = (event) => {
    checkEmpty();
    setEnteredName(event.target.value);
  };

  const addressChangedHandler = (event) => {
    checkEmpty();
    setEnteredAddress(event.target.value);
  };

  const secondAddressChangedHandler = (event) => {
    checkEmpty();
    setEnteredSecondAddress(event.target.value);
  };

  const cityChangedHandler = (event) => {
    checkEmpty();
    setEnteredCity(event.target.value);
  };

  const stateUSChangedHandler = (event) => {
    checkEmpty();
    setEnteredStateUS(event.target.value);
  };

  const zipcodeChangedHandler = (event) => {
    checkEmpty();
    setEnteredZipcode(event.target.value);
  };

  const addProfile = async (userInput) => {
    userInput.preventDefault();
    try {
      const profileInfo = {};
      const formFields = ([].slice.call(userInput.target).slice(0, 6));
      formFields.forEach((element) => profileInfo[element.name] = (element.value.replace(/\s+/g, ' ')));
      if (Object.keys(profileInfo).every(field => profileInfo[field] === recievedProfileInfo[field]))
        return;
      const request = await fetch('http://localhost:5000/profileManagement/updateProfile', {
        method: 'POST',
        body: JSON.stringify(profileInfo),
        headers: {
          'Content-Type': 'application/json',
          'Token': cookies.Token
        }
      });
      const response = await request.json();
      console.log(response);
      if (response.status === "success") {
        setCookie('Token', cookies.Token, { path: '/', maxAge: Math.round(response.expiration / 1000) });
        document.getElementById("profile-form").submit();
      }
      else if (response.status === "error-token") {
        invokePageError("Token is invalid. Please login again.", "/login");
        return;
      }
      else {
        if (!!response.expiration)
          setCookie('Token', cookies.Token, { path: '/', maxAge: Math.round(response.expiration / 1000) });
        invokePageError(`An error {${response.status}} has occurred during profile update request.`, "/");
        return;
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
      [].slice.call(document.getElementById("profile-form").elements).forEach(element => element.disabled = true);
      setError([message, () => navigate(redirect)]);
    }
    if (!cookies.Token) {
      invokePageError("Missing token. Please login before accessing this page.", "/login");
      return;
    }

    const retrieveProfile = async () => {
      let profileInfo = {
        "full_name": "",
        "address_1": "",
        "address_2": "",
        "city": "",
        "usa_state": "",
        "zipcode": ""
      }
      try {
        const request = await fetch('http://localhost:5000/profileManagement/getProfile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Token': cookies.Token
          }
        });
        const response = await request.json();
        console.log(response);
        if (response.status === "success") {
          profileInfo = response.data.profile;
          setProfileInfo(profileInfo);
          setEnteredName(profileInfo.full_name ?? "");
          setEnteredAddress(profileInfo.address_1 ?? "");
          setEnteredSecondAddress(profileInfo.address_2 ?? "");
          setEnteredCity(profileInfo.city ?? "");
          setEnteredStateUS(profileInfo.usa_state ?? "");
          setEnteredZipcode(profileInfo.zipcode ?? "");
          setProfileBool(true);
        }
        else if (response.status === "error-profile") {
          setCookie('Token', cookies.Token, { path: '/', maxAge: Math.round(response.expiration / 1000) });
          document.getElementById("completion-alert").style.display = 'block';
        }
        else if (response.status === "error-token") {
          invokePageError("Token is invalid. Please login again.", "/login");
          return;
        }
        else {
          if (!!response.expiration)
            setCookie('Token', cookies.Token, { path: '/', maxAge: Math.round(response.expiration / 1000) });
          invokePageError(`An error {${response.status}} has occurred during profile info retrieval.`, "/");
          return;
        }
        checkEmpty();
      }
      catch (err) {
        console.error(err);
        invokePageError("An unknown error has occurred during server request.", "/");
      }
    };
    retrieveProfile();
  }, [cookies.Token, setCookie, navigate]);

  return (
    <div className="page" style={{ maxWidth: "100%" }}>
      <NavigationBar pageName="ProfileManagement" disableLinks={!profileIsStored} pageError={(!!fetchError) && (fetchError[1] !== "/")}></NavigationBar>
      <div className="container">
        <div className="card bg-light">
          {!fetchError ? <ClickAlert id="completion-alert" alertType={"info"} >Profile must be completed before visiting other pages.</ClickAlert>
            : <ClickAlert id="errorAlert" alertType={"danger"} color='rgb(100,0,0)' display='block' extraEvent={fetchError[1]}>{fetchError[0]}</ClickAlert>}
          <article className="card-body mx-auto" style={{ maxWidth: "100%" }}>
            <h4 className="card-title mt-3 text-center">Profile</h4>

            <form id="profile-form" onSubmit={addProfile}>
              <div className="form-group input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text" />
                </div>
                <input
                  name="full_name"
                  className="form-control"
                  placeholder="Full Name"
                  type="text"
                  pattern="^\s*(?:[a-zA-Z]+(?:[-][a-zA-Z]+)*)+(\s+(?:[a-zA-Z]+(?:[-][a-zA-Z]+)*)+)+\s*$"
                  value={enteredName}
                  onChange={nameChangedHandler}
                  maxLength={50}
                  required
                />
              </div>

              <div className="form-group input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text" />
                </div>
                <input
                  name="address_1"
                  className="form-control"
                  placeholder="Address 1"
                  type="text"
                  pattern="^\s*\S+(?:\s+\S+)+\s*$"
                  value={enteredAddress}
                  onChange={addressChangedHandler}
                  maxLength={100}
                  required
                />
              </div>
              <div className="form-group input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text" />
                </div>
                <input
                  name="address_2"
                  className="form-control ."
                  placeholder="Address 2"
                  type="text"
                  pattern="^\s*\S+(?:\s+\S+)*\s*$"
                  value={enteredSecondAddress}
                  onChange={secondAddressChangedHandler}
                  maxLength={100}
                />
              </div>

              <div className="form-group input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text" />
                </div>
                <input
                  name="city"
                  className="form-control"
                  placeholder="City"
                  type="text"
                  pattern="^\s*(?:[a-zA-Z]+(?:[-][a-zA-Z]+)*)+(\s+(?:[a-zA-Z]+(?:[-][a-zA-Z]+)*)+)*\s*$"
                  value={enteredCity}
                  onChange={cityChangedHandler}
                  minLength={3}
                  maxLength={100}
                  required
                />
              </div>

              <div className="form-group input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text" />
                </div>
                <select
                  name="usa_state"
                  className="form-control"
                  onChange={stateUSChangedHandler}
                  value={enteredStateUS}
                  required
                >
                  <option value="">Select</option>
                  <option value="AL">Alabama</option>
                  <option value="AK">Alaska</option>
                  <option value="AZ">Arizona</option>
                  <option value="AR">Arkansas</option>
                  <option value="CA">California</option>
                  <option value="CO">Colorado</option>
                  <option value="CT">Connecticut</option>
                  <option value="DE">Delaware</option>
                  <option value="FL">Florida</option>
                  <option value="GA">Georgia</option>
                  <option value="HI">Hawaii</option>
                  <option value="ID">Idaho</option>
                  <option value="IL">Illinois</option>
                  <option value="IN">Indiana</option>
                  <option value="IA">Iowa</option>
                  <option value="KS">Kansas</option>
                  <option value="KY">Kentucky</option>
                  <option value="LA">Louisiana</option>
                  <option value="ME">Maine</option>
                  <option value="MD">Maryland</option>
                  <option value="MA">Massachusetts</option>
                  <option value="MI">Michigan</option>
                  <option value="MN">Minnesota</option>
                  <option value="MS">Mississippi</option>
                  <option value="MO">Missouri</option>
                  <option value="MT">Montana</option>
                  <option value="NE">Nebraska</option>
                  <option value="NV">Nevada</option>
                  <option value="NH">New Hampshire</option>
                  <option value="NJ">New Jersey</option>
                  <option value="NM">New Mexico</option>
                  <option value="NY">New York</option>
                  <option value="NC">North Carolina</option>
                  <option value="ND">North Dakota</option>
                  <option value="OH">Ohio</option>
                  <option value="OK">Oklahoma</option>
                  <option value="OR">Oregon</option>
                  <option value="PA">Pennsylvania</option>
                  <option value="RI">Rhode Island</option>
                  <option value="SC">South Carolina</option>
                  <option value="SD">South Dakota</option>
                  <option value="TN">Tennessee</option>
                  <option value="TX">Texas</option>
                  <option value="UT">Utah</option>
                  <option value="VT">Vermont</option>
                  <option value="VA">Virginia</option>
                  <option value="WA">Washington</option>
                  <option value="WV">West Virginia</option>
                  <option value="WI">Wisconsin</option>
                  <option value="WY">Wyoming</option>
                </select>
              </div>

              <div className="form-group input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text" />
                </div>
                <input
                  name="zipcode"
                  className="form-control"
                  placeholder="Zipcode"
                  type="text"
                  pattern="^\s*[0-9]*\s*$"
                  value={enteredZipcode}
                  onChange={zipcodeChangedHandler}
                  minLength={5}
                  maxLength={9}
                  required
                />
              </div>

              <div className="form-group">
                <Button disabled={!button_state} type="submit"> Submit </Button>
              </div>
            </form>
          </article>
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;
