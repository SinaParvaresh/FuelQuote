import { React, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import NavigationBar from "./navigationBar";
import ClickAlert from "./clickalert";
import Button from "./Button";
import calculateRate from "./fuelQuoteCalculation";

const FuelQuoteForm = (props) => {

  const [cookies] = useCookies(['user-token']);
  const navigate = useNavigate();
  const [fetchError, setError] = useState();
  const invokePageError = (message, redirect) => {
    setButton(false);
    [].slice.call(document.getElementById("fuelquote-form").elements).forEach(element => element.disabled = true);
    setError([message, () => navigate(redirect)]);
  }

  const getMinimumDate =()=>{
    const today=new Date()
    return new Date(today.setDate(today.getDate()+1)).toISOString().split('T')[0];
  }

  const [userAddress, setAddress] = useState("Address from backend.");
  const [gallons, setGallons] = useState(0);
  const [priceGalRate, setRate] = useState((1.5).toFixed(2));
  const [quoteFactors, setFactors] = useState({});

  const [button_state, setButton] = useState(false);

  const checkEmpty = () => {
    if (Math.round(document.getElementById("numOfGallons").value) !== 0 &&
      document.getElementById("deliveryDate").value !== "")
      setButton(true);
    else
      setButton(false);
  };

  const gallonsHandler = (event) => {
    checkEmpty();
    const fieldGallons = Math.round(event.target.value);
    setGallons(fieldGallons);
    setRate(calculateRate(fieldGallons, quoteFactors.gallon_rate, quoteFactors.location_factor, quoteFactors.history_factor,
      quoteFactors.amount_factor, quoteFactors.profit_factor));
  };

  const submitQuoteRequest = async (userInput) => {
    userInput.preventDefault();
    const quoteInfo = {};
    const formFields = ([].slice.call(userInput.target).slice(0, 4));
    formFields.forEach((element) => quoteInfo[element.id] = element.value);
    quoteInfo["deliveryDate"] = `${quoteInfo.deliveryDate}T${new Date().toISOString().split('T')[1]}`
    quoteInfo["token"] = cookies.Token;
    try {
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
      else if (response.status === "error-token") {
        invokePageError("Token is invalid. Please login again.", "/login");
        return;
      }
      else if (response.status === "error-address") {
        invokePageError("Given address did not match that of database.", "/profileManagement");
        return;
      }
      else {
        invokePageError("An unknown error has occurred during server request.", "/");
        return;
      }
    }
    catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const invokePageError = (message, redirect) => {
      setButton(false);
      [].slice.call(document.getElementById("fuelquote-form").elements).forEach(element => element.disabled = true);
      setError([message, () => navigate(redirect)]);
    }
    if (!cookies.Token) {
      invokePageError("Missing token. Please login before accessing this page.", "/login");
      return;
    }
    const getDataForQuote = async (user_token) => {
      try {
        const request = await fetch('http://localhost:5000/fuelQuoteManagement/getParamsForQuote', {
          method: 'POST',
          body: JSON.stringify({ token: user_token }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const response = await request.json();
        console.log(response);
        if (response.status === "success") {
          setAddress(response.data.params.address);
          const quoteFacts = response.data.params.quote_factors;
          setFactors(quoteFacts);
          setRate(calculateRate(0, quoteFacts.gallon_rate, quoteFacts.location_factor, quoteFacts.history_factor,
            quoteFacts.amount_factor, quoteFacts.profit_factor));
        }
        else if (response.status === "error-token") {
          invokePageError("Token is invalid. Please login again.", "/login");
          return;
        }
        else if (response.status === "error-address") {
          invokePageError("No address exists for this user.\nPlease complete profile first.", "/profileManagement");
          return;
        }
        else {
          invokePageError("An unknown error has occurred during server request.", "/");
          return;
        }
      }
      catch (err) {
        console.error(err);
      }
    };
    getDataForQuote(cookies.Token);
  }, [cookies.Token, navigate]);

  return (
    <div className="page" style={{ maxWidth: "100%" }}>
      <NavigationBar pageName="FuelQuoteForm" disableRest={fetchError != null} pageError={(fetchError != null) && (fetchError[1] !== "/")}></NavigationBar>
      <div className="container">
        <div className="card bg-light">
          {fetchError != null ? <ClickAlert id="errorAlert" alertType={"danger"} color='rgb(100,0,0)' display='block' extraEvent={fetchError[1]}>{fetchError[0]}</ClickAlert> : null}
          <article className="card-body">
            <form id="fuelquote-form" onSubmit={submitQuoteRequest}>
              <div className="form-group">
                <label htmlFor="numOfGallons">Gallons Requested</label>
                <input id="numOfGallons" onChange={gallonsHandler} type="number" className="form-control" min={0} max={10 ** 6} placeholder="Enter number of gallons." required />
              </div>

              <div className="form-group">
                <label htmlFor="deliveryAddress">Delivery Address</label>
                <input id="deliveryAddress" type="text" className="form-control" value={userAddress} readOnly />
              </div>

              <div className="form-group">
                <label htmlFor="deliveryDate">Delivery Date</label>
                <input id="deliveryDate" onChange={checkEmpty} type="date" className="form-control" min={getMinimumDate()} max={'2100-01-01'} required />
              </div>

              <div className="form-group">
                <label htmlFor="gallonRate">Suggested Price / Gallon</label>
                <input id="gallonRate" type="number" className="form-control" value={priceGalRate} readOnly />
              </div>

              <div className="form-group">
                <label htmlFor="totalCost">Total Amount Due</label>
                <input id="totalCost" type="zipcode" className="form-control" value={(gallons * priceGalRate).toFixed(2)} readOnly />
              </div>

              <Button disabled={!button_state} type="submit" id="submit-register"> Submit </Button>

            </form>
          </article>
        </div>
      </div>
    </div>

  );
};

export default FuelQuoteForm;
