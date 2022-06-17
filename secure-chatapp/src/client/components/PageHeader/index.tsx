import React, { PropsWithChildren } from 'react';
import "./style.scss";

interface IPageHeaderProps extends PropsWithChildren {
    className?: string;
}

const PageHeader = ({ children, className }: IPageHeaderProps) => {
    return (
        <h1 className={`page-header ${className}`}>
            {children}
        </h1 >
    );
};

export default PageHeader;;;