// Various functions for this Fuel Quote App.

const convertToDate = (dateValue) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dateObj = new Date(dateValue);
    return months[dateObj.getMonth()] + " " + dateObj.getDate() + ", " + dateObj.getFullYear();
}

export default convertToDate;