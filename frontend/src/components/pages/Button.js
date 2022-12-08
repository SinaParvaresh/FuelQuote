import React from "react";

import "./Button.module.css";

const Button = (props) => {
  return (
    <button id={props.id} className="btn btn-primary" type={props.type ?? "button"} onClick={props.onClick} disabled={props.disabled}>
      {props.children}
    </button>
  );
};

export default React.memo(Button);