import React, { useState, useEffect, Component } from "react";
import { ReactDOM } from "react";

import Button from "./Button";
import NavigationBar from "./navigationBar";

const ProfileManagement = (props) => {
  const [enteredName, setEnteredName] = useState("");
  const [enteredAddress, setEnteredAddress] = useState("");
  const [enteredSecondAddress, setEnteredSecondAddress] = useState("");
  const [enteredCity, setEnteredCity] = useState("");
  const [enteredZipcode, setEnteredZipcode] = useState("");
  const [enteredStateUS, setEnteredStateUS] = useState("");

  const addProfileHandler = (event) => {
    event.preventDefault();
    // if (enteredName.trim().length === 0 || enteredAddress.trim().length === 0 || enteredCity.trim().length === 0 || enteredZipcode.trim().length === 0 || enteredStateUS=="") {
    //   console.log("empty field");
    //   return;
    // }
    // if (enteredName.trim().length > 50 || enteredAddress.trim().length > 100 || enteredSecondAddress.trim().length > 100 || enteredCity.trim().length > 100 || enteredZipcode.trim().length > 9 || enteredZipcode.trim().length < 5) {
    //   console.log("Field out of bounds");
    //   return;
    // }
    console.log(enteredName, enteredAddress);
    setEnteredName("");
    setEnteredAddress("");
    setEnteredSecondAddress('');
    setEnteredCity("");
    setEnteredZipcode("");
    setEnteredStateUS("");
  };

  const nameChangedHandler = (event) => {
    setEnteredName(event.target.value);
  };

  const addressChangedHandler = (event) => {
    setEnteredAddress(event.target.value);
  };

  const secondAddressChangedHandler = (event) => {
    setEnteredSecondAddress(event.target.value);
  };

  const cityChangedHandler = (event) => {
    setEnteredCity(event.target.value);
  };

  const zipcodeChangedHandler = (event) => {
    setEnteredZipcode(event.target.value);
  };

  const stateUSChangedHandler = (event) => {
    setEnteredStateUS(event.target.value);
  };



  return (
    <div className="page" style={{ maxWidth: "100%" }}>
      <NavigationBar pageName="ProfileManagement"></NavigationBar>
      <div className="container">
        <div className="card bg-light">
          <article className="card-body mx-auto" style={{ maxWidth: "100%" }}>
            <h4 className="card-title mt-3 text-center">Profile</h4>

            <form onSubmit={addProfileHandler}>
              <div className="form-group input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    {" "}
                    <i className="fa fa-user"></i>{" "}
                  </span>
                </div>
                <input
                  name=""
                  className="form-control"
                  placeholder="Full name"
                  type="text"
                  value={enteredName}
                  onChange={nameChangedHandler}
                  required
                  maxLength={50}
                />
              </div>

              <div className="form-group input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    {" "}
                    <i className="fa fa-envelope"></i>{" "}
                  </span>
                </div>
                <input
                  name=""
                  className="form-control"
                  placeholder="Address 1"
                  type="address"
                  value={enteredAddress}
                  onChange={addressChangedHandler}
                  maxLength={100}
                />
              </div>
              <div className="form-group input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    {" "}
                    <i className="fa fa-envelope"></i>{" "}
                  </span>
                </div>
                <input
                  name=""
                  className="form-control"
                  placeholder="Address 2"
                  type="address"
                  value={enteredSecondAddress}
                  onChange={secondAddressChangedHandler}
                  maxLength={100}
                />
              </div>

              <div className="form-group input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    {" "}
                    <i className="fa fa-envelope"></i>{" "}
                  </span>
                </div>
                <input
                  name=""
                  className="form-control"
                  placeholder="City"
                  type="city"
                  value={enteredCity}
                  onChange={cityChangedHandler}
                  maxLength={100}
                  required
                />
              </div>

              <div className="form-group input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    {" "}
                    <i className="fa fa-building"></i>{" "}
                  </span>
                </div>
                <select className="input-group-text" name="state" placeholder='' onChange={stateUSChangedHandler} value={enteredStateUS} required>
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
                  <span className="input-group-text">
                    {" "}
                    <i className="fa fa-lock"></i>{" "}
                  </span>
                </div>
                <input
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
                <Button type="submit"> Continue </Button>
              </div>
            </form>
          </article>
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;
