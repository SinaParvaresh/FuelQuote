const GALLON_RATE = 1.5;
const LOCATION_FACTOR = [0.02, 0.04];
const HISTORY_FACTOR = [0.01, 0.0];
const AMOUNT_FACTOR = [0.02, 0.03];
const PROFIT_FACTOR = 0.10;

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

exports.getQuoteFactors = (state, history) => {
    return {
        "gallon_rate": GALLON_RATE, "location_factor": (state == "TX" ? LOCATION_FACTOR[0] : LOCATION_FACTOR[1]),
        "history_factor": (history > 0 ? HISTORY_FACTOR[0] : HISTORY_FACTOR[1]), "amount_factor": AMOUNT_FACTOR, "profit_factor": PROFIT_FACTOR
    }
}

exports.calculateRate = (gallons, state, history) => {
    const margin = (state == "TX" ? LOCATION_FACTOR[0] : LOCATION_FACTOR[1]) - (history > 0 ? HISTORY_FACTOR[0] : HISTORY_FACTOR[1])
        + (gallons > 1000 ? AMOUNT_FACTOR[0] : AMOUNT_FACTOR[1]) + PROFIT_FACTOR;
    return roundDecimal(GALLON_RATE * (1 + margin));
};