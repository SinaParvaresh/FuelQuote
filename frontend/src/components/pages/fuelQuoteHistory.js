import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import NavigationBar from "./navigationBar";
import ClickAlert from "./clickalert";
import './fuelQuoteHistory.css';

const FuelQuoteHistory = () => {

    const [cookies, setCookie] = useCookies(['user-token']);
    const navigate = useNavigate();
    const [fetchError, setError] = useState();

    const [quoteHistory, setHistory] = useState([]);
    const tdSTYLE = { textAlign: 'center' };
    const thSTYLE = { textAlign: 'center' };

    useEffect(() => {
        const invokePageError = (message, redirect) => {
            setError([message, redirect]);
        }
        if (!cookies.Token) {
            invokePageError("Missing token. Please login before accessing this page.", "/login");
            return;
        }
        const retrieveQuotes = async () => {
            try {
                const request = await fetch('http://localhost:5000/fuelQuoteManagement/getQuotes', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Token': cookies.Token
                    }
                });
                const response = await request.json();
                console.log(response);
                if (response.status === "success") {
                    setCookie('Token', cookies.Token, { path: '/', maxAge: Math.round(response.expiration / 1000) });
                    const responseData = response.data.quotes;
                    setHistory(Object.keys(responseData).map(e => responseData[e]).slice(1));
                }
                else if (response.status === "error-token") {
                    invokePageError("Token is invalid. Please login again.", "/login");
                    return;
                }
                else if (response.status === "error-profile") {
                    setCookie('Token', cookies.Token, { path: '/', maxAge: Math.round(response.expiration / 1000) });
                    invokePageError("Please complete profile prior to accessing this page.", "/profileManagement");
                    return;
                }
                else {
                    if (!!response.expiration)
                        setCookie('Token', cookies.Token, { path: '/', maxAge: Math.round(response.expiration / 1000) });
                    invokePageError(`An error {${response.status}} has occurred during fuel quote retrieval.`, "/");
                    return;
                }
            }
            catch (err) {
                console.error(err);
                invokePageError("An unknown error has occurred during server request.", "/");
            }
        };
        retrieveQuotes();
    }, [cookies.Token, setCookie, navigate]);

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
            <NavigationBar pageName="FuelQuoteHistory" disableLinks={!!fetchError} pageError={((!!fetchError) && (fetchError[1] !== "/")) ? fetchError[1] : false}></NavigationBar>
            <div className='container'>
                <div>
                    <h1> Fuel Quote History</h1>
                </div>
                <br />
                {!!fetchError ? <ClickAlert id="errorAlert" alertType={"danger"} color='rgb(100,0,0)' display='block' extraEvent={!!fetchError ? () => navigate(fetchError[1]) : false}>{fetchError[0]}</ClickAlert> : null}
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
