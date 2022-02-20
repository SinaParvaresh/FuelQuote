import React, { useState, useEffect, Component } from "react";
import { ReactDOM } from "react";

import Button from "./Button";

const ProfileManagement = (props) => {
  const [enteredName, setEnteredName] = useState("");
  const [enteredAddress, setEnteredAddress] = useState("");
  const [enteredSecondAddress, setEnteredSecondAddress] = useState("");
  const [enteredCity, setEnteredCity] = useState("");
  const [enteredZipcode, setEnteredZipcode] = useState("");

  const addProfileHandler = (event) => {
    event.preventDefault();
    if (enteredName.trim().length === 0 || enteredAddress.trim().length === 0 || enteredSecondAddress.trim().length === 0 || enteredCity.trim().length === 0 || enteredZipcode.trim().length === 0) {
      return;
    }
    if (enteredName.trim().length > 50 || enteredAddress.trim().length > 100 || enteredSecondAddress.trim().length > 100 || enteredCity.trim().length > 100 || enteredZipcode.trim().length > 9 || enteredZipcode.trim().length < 5) {
      return;
    }
    console.log(enteredName, enteredAddress);
    setEnteredName("");
    setEnteredAddress("");
    setEnteredSecondAddress('');
    setEnteredCity("");
    setEnteredZipcode("");
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

  return (
    <div className="maincontainer">
      <div className="container">
        <div className="card bg-light">
          <article className="card-body mx-auto" style={{ maxWidth: "400px" }}>
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
                />
              </div>

              <div className="form-group input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    {" "}
                    <i className="fa fa-building"></i>{" "}
                  </span>
                </div>
                <select name="state">
                  <option value="AL">AL</option>
                  <option value="AK">AK</option>
                  <option value="AZ">AZ</option>
                  <option value="AR">AR</option>
                  <option value="CA">CA</option>
                  <option value="CO">CO</option>
                  <option value="CT">CT</option>
                  <option value="DE">DE</option>
                  <option value="DC">DC</option>
                  <option value="FL">FL</option>
                  <option value="GA">GA</option>
                  <option value="HI">HI</option>
                  <option value="ID">ID</option>
                  <option value="IL">IL</option>
                  <option value="IN">IN</option>
                  <option value="IA">IA</option>
                  <option value="KS">KS</option>
                  <option value="KY">KY</option>
                  <option value="LA">LA</option>
                  <option value="ME">ME</option>
                  <option value="MD">MD</option>
                  <option value="MA">MA</option>
                  <option value="MI">MI</option>
                  <option value="MN">MN</option>
                  <option value="MS">MS</option>
                  <option value="MO">MO</option>
                  <option value="MT">MT</option>
                  <option value="NE">NE</option>
                  <option value="NV">NV</option>
                  <option value="NH">NH</option>
                  <option value="NJ">NJ</option>
                  <option value="NM">NM</option>
                  <option value="NY">NY</option>
                  <option value="NC">NC</option>
                  <option value="ND">ND</option>
                  <option value="OH">OH</option>
                  <option value="OK">OK</option>
                  <option value="OR">OR</option>
                  <option value="PA">PA</option>
                  <option value="RI">RI</option>
                  <option value="SC">SC</option>
                  <option value="SD">SD</option>
                  <option value="TN">TN</option>
                  <option value="TX">TX</option>
                  <option value="UT">UT</option>
                  <option value="VT">VT</option>
                  <option value="VA">VA</option>
                  <option value="WA">WA</option>
                  <option value="WV">WV</option>
                  <option value="WI">WI</option>
                  <option value="WY">WY</option>
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
                  type="zipcode"
                  value={enteredZipcode}
                  onChange={zipcodeChangedHandler}
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
