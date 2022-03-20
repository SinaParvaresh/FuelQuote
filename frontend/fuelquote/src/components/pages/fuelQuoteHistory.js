import { React, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import NavigationBar from "./navigationBar";
import ClickAlert from "./clickalert";
import './fuelQuoteHistory.css';

const FuelQuoteHistory = () => {

    const [cookies] = useCookies(['user-token']);
    const navigate = useNavigate();
    const [fetchError, setError] = useState();

    const [quoteHistory, setHistory] = useState([]);
    const tdSTYLE = { textAlign: 'center' };
    const thSTYLE = { textAlign: 'center' };

    useEffect(() => {
        const setPageError = (message, redirect) => {
            setError([message, () => navigate(redirect)]);
        }
        if (!cookies.Token) {
            setPageError("Missing token. Please login before accessing this page.", "/login");
            return;
        }
        const retrieveQuotes = async (some_token) => {
            try {
                const request = await fetch('http://localhost:5000/fuelQuoteManagement/getQuotes', {
                    method: 'POST',
                    body: JSON.stringify({ "token": some_token }),
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
                else if (response.status === "error-token") {
                    setPageError("Token is invalid. Please login again.", "/login");
                    return;
                }
                else {
                    setPageError("An unknown error has occurred during server request.", "/");
                    return;
                }
            }
            catch (err) {
                console.error(err);
            }
        };
        retrieveQuotes(cookies.Token);
    }, [cookies.Token, navigate]);

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
            <NavigationBar pageName="FuelQuoteHistory" disableRest={fetchError != null}></NavigationBar>
            <div className='container'>
                <div>
                    <h1> Fuel Quote History</h1>
                </div>
                <br />
                {fetchError != null ? <ClickAlert id="errorAlert" alertType={"danger"} color='rgb(100,0,0)' display='block' extraEvent={fetchError[1]}>{fetchError[0]}</ClickAlert> : null}
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
