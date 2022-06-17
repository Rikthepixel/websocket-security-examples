import React, { ButtonHTMLAttributes } from 'react';
import "./style.scss";

const Button = ({ className = "", children, ...props }: ButtonHTMLAttributes<HTMLInputElement>) => {
    return (
        <button className={`btn ${className}`} {...props}>{children}</button>
    );
};

export default Button;