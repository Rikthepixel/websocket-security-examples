import React, { HtmlHTMLAttributes } from 'react';
import "./style.scss";

const InputGroup = ({ className = "", children, ...props }: HtmlHTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`input-group ${className}`} {...props}>{children}</div>
  );
};

export default InputGroup;