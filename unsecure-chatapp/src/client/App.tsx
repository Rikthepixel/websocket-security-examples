import React from 'react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { refreshTokens } from './api/user';
import { AuthProvider } from './hooks/useAuth';
import { Routes } from './Routes';

const App = () => {

    const navigate = useNavigate();

    return (
        <AuthProvider
            refreshCall={(refresh) => refreshTokens(refresh)}
            onLoginRequired={() => {
                console.log("Login required");

                navigate("/login");
            }}
        >
            <Routes></Routes>
        </AuthProvider>
    );
};

export default App;