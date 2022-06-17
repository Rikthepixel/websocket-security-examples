import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../../api/user';
import Button from '../../components/Button';
import InputGroup from '../../components/InputGroup';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../hooks/useAuth';
import "./style.scss";

const Register = () => {

    const [auth, setAuth] = useAuth();
    const nagivate = useNavigate();
    const [error, setError] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");

    const sendRegister = useCallback(() => {
        if (username.length < 3) {
            return setError("Username needs to be at least 3 characters long");
        }
        if (password.length < 8) {
            return setError("Password needs to be at least 8 characters long");
        }
        if (password !== confPassword) {
            return setError("Password has got to match confirmation password");
        }

        registerUser(username, password)
            .then((resp) => {
                loginUser(username, password)
                    .then(setAuth)
                    .catch(setError);
            })
            .catch(setError);
    }, [username, password, confPassword]);

    useEffect(() => {
        if (auth.loggedIn) {
            nagivate("/");
        }
    }, [auth.loggedIn]);

    return (
        <div className="register-page">
            <Navbar title='Register' />
            <div className="register-panel">
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
                    <input
                        name="confirmationPassword"
                        type="password"
                        placeholder="Confirm password"
                        value={confPassword}
                        onChange={(e) => setConfPassword(e.target.value)}
                    />
                </InputGroup>
                <InputGroup>
                    <Button onClick={sendRegister}>
                        Register
                    </Button>
                </InputGroup>
                <InputGroup className='error'>
                    {error}
                </InputGroup>
            </div>
        </div >
    );
};

export default Register;