import React, { useState, useEffect } from "react";
import NavigationBar from "./navigationBar";

const FuelQuoteForm = (props) => {
  const getTodayDate = () => {
    const today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    const yyyy = today.getFullYear();
    if (dd < 10)
      dd = '0' + dd;
    if (mm < 10)
      mm = '0' + mm;
    return yyyy + '-' + mm + '-' + dd;
  }

  const [userAddress, setAddress] = useState("Address from backend.");
  const [gallons, setGallons] = useState(0);
  const gallonsHandler = (retrieved) => {
    setGallons(retrieved.target.value);
  };

  const [priceGalRate, setRate] = useState((1.5).toFixed(2));

  const USERNAME = "someuser@some.com";
  // const USERNAME="someone@email.com";
  // const USERNAME = "davebrown@trash.com";

  const getDataForQuote = async (some_username) => {
    const request = await fetch('http://localhost:5000/fuelQuoteManagement/getParamsForQuote', {
      method: 'POST',
      body: JSON.stringify({ "userId": some_username }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const response = await request.json();
    console.log(response);
    if (response.status === "success") {
      setAddress(response.data.params.address);
      setRate(response.data.params.gallon_rate);
    }
    else if (response.status === "error-address")
      alert("No address exists for this user.\nPlease complete profile first.");
    else
      alert("No account exists for this user.\nPlease register user first.");
  }

  useEffect(() => {
    getDataForQuote(USERNAME);
  }, []);

  const submitQuoteRequest = async (userInput) => {
    userInput.preventDefault();

    const quoteInfo = {};
    const fields = ([].slice.call(userInput.target).slice(0, 4));
    fields.forEach((element) => quoteInfo[element.id] = element.value);

    quoteInfo["userId"] = USERNAME;

    const request = await fetch('http://localhost:5000/fuelQuoteManagement/addQuote', {
      method: 'POST',
      body: JSON.stringify(quoteInfo),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const response = await request.json();
    console.log(response);
    if (response.status === "success")
      document.getElementById("fuelquote-form").submit();
    else
      alert("No account exists for this user.\nPlease register user first.");
  }

  return (
    <div className="page" style={{ maxWidth: "100%" }}>
      <NavigationBar pageName="FuelQuoteForm"></NavigationBar>
      <div className="container">
        <div className="card bg-light">
          <article className="card-body">

            <form id="fuelquote-form" onSubmit={submitQuoteRequest}>
              <div className="form-group">
                <label htmlFor="numOfgallons">Gallons Requested</label>
                <input id="numOfgallons" onChange={gallonsHandler} type="number" className="form-control" min={0} max={10 ** 9} placeholder="Enter number of gallons." required />
              </div>

              <div className="form-group">
                <label htmlFor="deliveryAddress">Delivery Address</label>
                <input id="deliveryAddress" type="text" className="form-control" value={userAddress} readOnly />
              </div>

              <div className="form-group">
                <label htmlFor="deliveryDate">Delivery Date</label>
                <input id="deliveryDate" type="date" className="form-control" min={getTodayDate()} max={'2100-01-01'} required />
              </div>

              <div className="form-group">
                <label htmlFor="gallonRate">Suggested Price / Gallon</label>
                <input id="gallonRate" type="number" className="form-control" value={priceGalRate} readOnly />
              </div>

              <div className="form-group">
                <label htmlFor="totalCost">Total Amount Due</label>
                <input id="totalCost" type="zipcode" className="form-control" value={(gallons * priceGalRate).toFixed(2)} readOnly />
              </div>

              <button type="submit" className="btn btn-primary">Submit</button>

            </form>
          </article>
        </div>
      </div>
    </div>

  );
};

export default FuelQuoteForm;
