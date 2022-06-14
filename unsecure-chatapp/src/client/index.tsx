import React from 'react';
import { createRoot } from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import { Routes } from "./Routes";

const root = createRoot(
    document.getElementById("react-root")
);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes></Routes>
        </BrowserRouter>
    </React.StrictMode>
);