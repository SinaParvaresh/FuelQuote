import React from "react";
const ClickAlert = (props) => {

    const closeAlert = (event) => {
        document.getElementById(event.target.offsetParent.id).style.display = 'none';
        if (!!props.extraEvent)
            props.extraEvent();
    };

    return (
        <div id={props.id} className={`alert alert-${props.alertType} collapse`} role="alert" style={{ display: props.display, textAlign: props.textAlign ?? "center" }}>
            <span className="text-center font-weight-bold" style={{ color: props.color, fontSize: props.fontSize ?? '11pt' }}>{props.children}</span>
            <button type="button" className="close" onClick={closeAlert} aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    );
};

export default React.memo(ClickAlert);