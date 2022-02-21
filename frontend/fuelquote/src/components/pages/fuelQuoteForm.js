import React, { useState, useEffect, Component } from "react";

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

  // let priceGalRate=(Math.random() * 10).toPrecision(3);

  const [gallons, setGallons] = useState(0);
  const gallonsHandler = (retrieved) => {
    setGallons(retrieved.target.value);
  };
  const [priceGalRate, setRate] = useState((Math.random()*8+1).toPrecision(3));
  // const rateHandler = (retrieved) => {
  //   setRate(retrieved.target.value);
  // };


  return (

    <div className="maincontainer">
      <div className="container">
        <div className="card bg-light">
          <article className="card-body">
            <form>

              {/* - Gallons Requested (numeric, required)
              - Delivery Address (Non-editable, comes from client profile)
              - Delivery Date (Calender, date picker)
              - Suggested Price / gallon (numeric non-editable, price will be calculated by Pricing Module - we are not building pricing module yet)
              - Total Amount Due (numeric non-editable, calculated (gallons * price)) */}


              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Gallons Requested</label>
                <input onChange={gallonsHandler} type="number" className="form-control" min={0} max={10 ** 9} placeholder="Enter number of gallons." required />
              </div>

              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Delivery Address</label>
                <input type="text" className="form-control" value="Address from backend." readOnly />
              </div>

              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Delivery Date</label>
                <input type="date" className="form-control" min={getTodayDate()} max={'2100-01-01'} required />
              </div>

              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Suggested Price / Gallon</label>
                <input type="number" className="form-control" value={priceGalRate} readOnly />
              </div>

              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Total Amount Due</label>
                <input type="zipcode" className="form-control" value={(gallons*priceGalRate)} readOnly />
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
