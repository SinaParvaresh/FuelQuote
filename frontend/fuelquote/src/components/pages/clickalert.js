import React from "react";
const ClickAlert = (props) => {

    const closeAlert = (retrieved) => {
        document.getElementById(retrieved.target.offsetParent.id).style.display = 'none';
    };

    return (
        <div id={props.id} className={"alert alert-" + props.alertType + " collapse"} role="alert" style={{ display: props.display, textAlign: "center" }}>
            <span className="text-center font-weight-bold" style={{ color: props.color, fontSize: '11pt' }}>{props.children}</span>
            <button type="button" className="close" onClick={closeAlert} aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    );
};

export default ClickAlert;