import React from 'react';
import { Route, Routes as ReactRouterRoutes } from 'react-router-dom';
import GlobalChat from './views/GlobalChat';
import Login from './views/Login';
import Register from './views/Register';

export const Routes = () => {
    return (
        <ReactRouterRoutes>
            <Route index element={<GlobalChat />} />
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
        </ReactRouterRoutes>
    );
};