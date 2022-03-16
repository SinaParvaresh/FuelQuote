import React, { useState, useEffect } from "react";

import Button from "./Button";
import NavigationBar from "./navigationBar";
import ClickAlert from './clickalert';

const ProfileManagement = (props) => {

  const [enteredName, setEnteredName] = useState("");
  const [enteredAddress, setEnteredAddress] = useState("");
  const [enteredSecondAddress, setEnteredSecondAddress] = useState("");
  const [enteredCity, setEnteredCity] = useState("");
  const [enteredStateUS, setEnteredStateUS] = useState("");
  const [enteredZipcode, setEnteredZipcode] = useState("");
  const [profileIsStored, setProfileBool] = useState(false);

  const [recievedProfileIfo, setProfileInfo] = useState({});
  const [button_state, setButton] = useState(false);

  const checkEmpty = () => {
    const fields = document.querySelectorAll("[class='form-control']");
    if ([].slice.call(fields).reduce((prev, curr) => prev * (!!curr.value), 1))
      setButton(true);
    else
      setButton(false);
  };

  const retrieveProfile = async (some_username) => {
    let profileInfo = {
      "full_name": "",
      "address_1": "",
      "address_2": "",
      "city": "",
      "usa_state": "",
      "zipcode": ""
    }
    const request = await fetch('http://localhost:5000/profileManagement/getProfile', {
      method: 'POST',
      body: JSON.stringify({ "userId": some_username }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const response = await request.json();
    console.log(response);
    if (response.status === "success") {
      profileInfo = response.data.profile;
      setProfileInfo(profileInfo);
      setEnteredName(profileInfo.full_name || "");
      setEnteredAddress(profileInfo.address_1 || "");
      setEnteredSecondAddress(profileInfo.address_2 || "");
      setEnteredCity(profileInfo.city || "");
      setEnteredStateUS(profileInfo.usa_state || "");
      setEnteredZipcode(profileInfo.zipcode || "");
      setProfileBool(true);
    }
    else
      document.getElementById("completion-alert").style.display = 'block';
    checkEmpty();
  };

  const USERNAME = "someuser@some.com";
  // const USERNAME="someone@email.com";
  // const USERNAME = "davebrown@trash.com";

  useEffect(() => {
    retrieveProfile(USERNAME);
  }, []);

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
    const profileInfo = {};
    const fields = ([].slice.call(userInput.target).slice(0, 6));
    fields.forEach((element) => profileInfo[element.name] = element.value);
    if (Object.keys(profileInfo).reduce((prev, curr) => prev * (profileInfo[curr] == recievedProfileIfo[curr]), 1))
      return;
    profileInfo["userId"] = USERNAME;
    const request = await fetch('http://localhost:5000/profileManagement/updateProfile', {
      method: 'POST',
      body: JSON.stringify(profileInfo),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const response = await request.json();
    console.log(response);
    if (response.status === "success")
      document.getElementById("profile-form").submit();
    else
      alert("No account exists for this user.\nPlease register user first.");
  };



  return (
    <div className="page" style={{ maxWidth: "100%" }}>
      <NavigationBar pageName="ProfileManagement" disableRest={!profileIsStored}></NavigationBar>
      <div className="container">
        <div className="card bg-light">
          <ClickAlert id="completion-alert" alertType={"info"} >Profile must be completed before visiting other pages.</ClickAlert>
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
                  value={enteredName}
                  onChange={nameChangedHandler}
                  required
                  maxLength={50}
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
                  value={enteredAddress}
                  onChange={addressChangedHandler}
                  maxLength={100}
                />
              </div>
              <div className="form-group input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text" />
                </div>
                <input
                  name="address_2"
                  className="form-control "
                  placeholder="Address 2"
                  type="text"
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
                  value={enteredCity}
                  onChange={cityChangedHandler}
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
                  className="form-control "
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
                  pattern="[0-9]*"
                  value={enteredZipcode}
                  onChange={zipcodeChangedHandler}
                  required
                  minLength={5}
                  maxLength={9}
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
