import React, { useState, useEffect } from "react";

import "./Button.module.css";

const Button = (props) => {
  return (
    <button className="btn btn-primary" type={props.type || "button"} onClick={props.onClick} disabled={props.disabled}>
      {props.children}
    </button>
  );
};

export default Button;