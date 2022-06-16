import React, { HTMLAttributes, ReactElement, useCallback, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import PageHeader from '../PageHeader';
import "./style.scss";
import { logoutUser } from '../../api/user';

interface INavbarProps extends HTMLAttributes<HTMLDivElement> {
    title: string;
}

declare global {
    interface Document {
        pageTitle: string;
    }
}

const Navbar = ({ className = "", title, ...props }: INavbarProps) => {
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();

    const logout = useCallback(() => {
        logoutUser(auth.refresh)
            .then((newAuth: any) => {
                console.log(newAuth);
                setAuth(newAuth);
            })
            .catch((err) => console.log(err));
    }, [auth]);

    useEffect(() => {

        if (!auth.loggedIn && location.pathname !== "/login" && location.pathname !== "/register") {
            navigate("/login");
        }
    }, [auth.loggedIn]);

    return (
        <nav className={`navbar ${className}`} {...props}>
            <div className='left'>
                {auth.loggedIn && <NavLink to="/">Chat</NavLink>}
            </div>
            <PageHeader className='center'>
                {title}
            </PageHeader>
            <div className='right'>
                {!auth.loggedIn ? <>
                    <NavLink to="/login">Login</NavLink>
                    <NavLink to="/register">Register</NavLink>
                </> : <>
                    <NavLink to="/login" onClick={logout}>Log out</NavLink>
                </>}
            </div>
        </nav>
    );
};

export default Navbar;