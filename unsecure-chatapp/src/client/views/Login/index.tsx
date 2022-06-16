import React, { useCallback, useEffect, useState } from 'react';
import Button from '../../components/Button';
import InputGroup from '../../components/InputGroup';
import Navbar from '../../components/Navbar';
import axios, { } from "axios";
import "./style.scss";
import { ILoginResponse } from '../../models/AuthModels';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/user';

const Login = () => {

    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const sendLogin = useCallback(async () => {
        loginUser(username, password)
            .then(setAuth)
            .catch(setError);
    }, [username, password]);

    useEffect(() => {
        if (auth.loggedIn) return navigate("/");
    }, [auth.loggedIn]);

    return (
        <div className="login-page">
            <Navbar title="Login" />
            <div className="login-panel">
                <InputGroup>
                    <input
                        name="username"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </InputGroup>
                <InputGroup>
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </InputGroup>
                <InputGroup>
                    <Button onClick={sendLogin}>
                        Log in
                    </Button>
                </InputGroup>
                <InputGroup className='error'>
                    {error}
                </InputGroup>
            </div>
        </div >
    );
};

export default Login;