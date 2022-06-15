import React, { useEffect } from 'react';
import Button from '../../components/Button';
import InputGroup from '../../components/InputGroup';
import Navbar from '../../components/Navbar';
import "./style.scss";

const Login = () => {

    return (
        <div className="login-page">
            <Navbar title="Login" />
            <div className="login-panel">
                <InputGroup>
                    <input
                        name="username"
                        type="text"
                        placeholder="Username"
                    />
                </InputGroup>
                <InputGroup>
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                    />
                </InputGroup>
                <InputGroup>
                    <Button>
                        Log in
                    </Button>
                </InputGroup>
            </div>
        </div >
    );
};

export default Login;