import React from 'react';
import ReactDOM from 'react-dom'; // Importa ReactDOM en lugar de reactDOM
import { BrowserRouter } from 'react-router-dom'; // Importa BrowserRouter
import App from './App';

const baseUrl = process.env.PUBLIC_URL; // Agrega una definición para baseUrl si es necesario

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <BrowserRouter basename={baseUrl}>
        <App />
    </BrowserRouter>
);





