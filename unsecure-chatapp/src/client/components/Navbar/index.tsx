import React, { HTMLAttributes, ReactElement } from 'react';
import { NavLink } from 'react-router-dom';
import PageHeader from '../PageHeader';
import "./style.scss";

interface INavbarProps extends HTMLAttributes<HTMLDivElement> {
    title: string;
}

declare global {
    interface Document {
        pageTitle: string;
    }
}

const Navbar = ({ className = "", title, ...props }: INavbarProps) => {
    return (
        <nav className={`navbar ${className}`} {...props}>
            <div className='left'>
                <NavLink key="1" to="/">Chat</NavLink>
                <NavLink key="2" to="/login">Login</NavLink>
                <NavLink key="3" to="/register">Register</NavLink>
            </div>
            <PageHeader className='center'>
                {title}
            </PageHeader>
            <div className='right'></div>
        </nav>
    );
};

export default Navbar;