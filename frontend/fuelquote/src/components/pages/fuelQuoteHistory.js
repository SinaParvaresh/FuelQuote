import React, { useState, useEffect } from "react";
import NavigationBar from "./navigationBar";
import './fuelQuoteHistory.css';

const FuelQuoteHistory = () => {

    const [quoteHistory, setHistory] = useState([]);
    const tdSTYLE = { textAlign: 'center' };
    const thSTYLE = { textAlign: 'center' };

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
            const responseData = response.data.quotes;
            setHistory(Object.keys(responseData).map(e => responseData[e]).slice(1));
        }
    }

    // const USERNAME = "someuser@some.com";
    // const USERNAME="someone@email.com";
    const USERNAME = "davebrown@trash.com";

    useEffect(() => {
        retrieveQuotes(USERNAME);
    }, []);

    const renderTableData = () => {
        return quoteHistory.map((quote, index) => {
            const { deliveryAddress, deliveryDate, gallonRate, numOfGallons, totalCost } = quote; //destructuring
            return (
                <tr key={"q" + index + 1}>
                    <th scope="row">{index + 1}</th>
                    <td style={tdSTYLE}>{numOfGallons + " gal"}</td>
                    <td style={tdSTYLE}>{deliveryAddress}</td>
                    <td style={tdSTYLE}>{new Date(deliveryDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                    <td style={tdSTYLE}>{'$' + gallonRate}</td>
                    <td style={tdSTYLE}>{'$' + totalCost}</td>
                </tr>
            );
        });
    }

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
                                <th style={thSTYLE}>#</th>
                                <th style={thSTYLE}>Gallons Requested</th>
                                <th style={thSTYLE}>Delivery Address</th>
                                <th style={thSTYLE}>Delivery Date</th>
                                <th style={thSTYLE}>Suggested Price / Gallon</th>
                                <th style={thSTYLE}>Total Amount Due</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderTableData()}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FuelQuoteHistory;
