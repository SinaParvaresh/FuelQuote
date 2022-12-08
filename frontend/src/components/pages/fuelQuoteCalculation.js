/*
Location Factor = 2% for Texas, 4% for out of state.
Rate History Factor = 1% if client requested fuel before, 0% if no history (you can query fuel quote table to check if there are any rows for the client)
Gallons Requested Factor = 2% if more than 1000 Gallons, 3% if less
Company Profit Factor = 10% always

Example:
1500 gallons requested, in state, does have history (i.e. quote history data exist in DB for this client)

Margin => (.02 - .01 + .02 + .1) * 1.50 = .195
Suggested Price/gallon => 1.50 + .195 = $1.695
Total Amount Due => 1500 * 1.695 = $2542.50
*/

const roundDecimal = (num) => {
    return +(Math.round(num + "e+15") + "e-15");
}

const calculateRate = (gallons, gallonRate, locationFactor, historyFactor, amountFactor, profitFactor) => {
    const margin = locationFactor - historyFactor + (gallons > 1000 ? amountFactor[0] : amountFactor[1]) + profitFactor;
    return roundDecimal(gallonRate * (1 + margin));
};

export default calculateRate;