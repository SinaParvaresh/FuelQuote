import React, { useState, useEffect, Component } from "react";
import NavigationBar from "./navigationBar";

const FuelQuoteHistory = () => {

    const [quoteHistory, setHistory] = useState({});

    const retrieveQuotes = async (some_username) => {
        const request = await fetch('http://localhost:5000/fuelQuoteManagement/getQuotes', {
          method: 'POST',
          body: JSON.stringify({ "userId": some_username }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const response = await request.json();
        console.log(response);
        if (response.status === "success") {
            setHistory(response.data.quotes);
        }
      }

      const USERNAME="someuser@some.com";
  // const USERNAME="someone@email.com";
  // const USERNAME = "davebrown@trash.com";

  useEffect(() => {
    retrieveQuotes(USERNAME);
  }, []);
  console.log(quoteHistory);

    return (
        <div className="page">
            <NavigationBar pageName="FuelQuoteHistory"></NavigationBar>
            <div className='container'>
                <div>
                    <h1> Fuel Quote History</h1>
                </div>
                <br />
                <div className='table'>
                    <table className="table">
                        <thead className="thead-dark">
                            <tr>
                                <th>#</th>
                                <th>Gallons Requested</th>
                                <th>Delivery Address</th>
                                <th>Delivery Date</th>
                                <th>Suggested Price / gallon</th>
                                <th>Total Amount Due</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">1</th>
                                <td>21</td>
                                <td>4800 Calhoun Rd, Houston, TX 77004</td>
                                <td>02/12/2022</td>
                                <td>$3.29</td>
                                <td>$69.09</td>
                            </tr>
                            <tr>
                                <th scope="row">2</th>
                                <td>5</td>
                                <td>1243 Thornton Rd, Bruh, SinatheTweakLand 77478</td>
                                <td>04/20/2022</td>
                                <td>$4.20</td>
                                <td>$69.69</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FuelQuoteHistory;
