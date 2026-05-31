import React from 'react';
import './Button.css';

const Button = ({ children, onClick, type = 'button', icon }) => {
  return (
    <button className="button" onClick={onClick} type={type}>
      <span className="button-text">{children}</span>
      {icon && <span className="button-icon">{icon}</span>}
    </button>
  );
};

export default Button;
