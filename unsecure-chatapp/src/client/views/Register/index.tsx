import React, { useEffect } from 'react';
import Button from '../../components/Button';
import InputGroup from '../../components/InputGroup';
import Navbar from '../../components/Navbar';
import PageHeader from '../../components/PageHeader';
import "./style.scss";

const Register = () => {

    return (
        <div className="register-page">
            <Navbar title='Register' />
            <div className="register-panel">
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
                    <input
                        name="confirmationPassword"
                        type="password"
                        placeholder="Confirm password"
                    />
                </InputGroup>
                <InputGroup>
                    <Button>
                        Register
                    </Button>
                </InputGroup>
            </div>
        </div >
    );
};

export default Register;