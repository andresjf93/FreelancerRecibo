import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    const [state, setState] = useState({
        logo: '',
        currency: '',
        amount: '',
        title: '',
        description: '',
        address: '',
        fullName: '',
        documentType: '',
        documentNumber: '',
        logoPreview: null,
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setState({ ...state, [name]: value });

        if (name === 'amount' && parseFloat(value) < 0) {
            setState({ ...state, [name]: '0' });
        }
    };
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Generar el contenido HTML a partir del estado
        let htmlContent = `
        <div>
            <h1>${state.title}</h1>
            <p>${state.description}</p>
            <p>Moneda: ${state.currency}</p>
            <p>Monto: ${state.amount}</p>
            <p>Dirección: ${state.address}</p>
            <p>Nombre completo: ${state.fullName}</p>
            <p>Tipo de documento: ${state.documentType}</p>
            <p>Número de documento: ${state.documentNumber}</p>
        </div>
    `;

        // El resto de tu código...
    

        const response = await fetch('/api/Crear/GenerarPDF', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(htmlContent)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("HTTP error " + response.status);
                }
                return response.blob();
            })
            .then(blob => {
                // Crear un enlace para descargar el archivo PDF
                let url = window.URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = url;
                a.download = 'recibo.pdf';
                a.click();
            })
            .catch(error => {
                console.log('Error al generar el PDF: ' + error);
            });
    };

    const handleLogoChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setState({ ...state, logo: reader.result, logoPreview: reader.result });
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const currencyOptions = [
        { value: 'PEN', label: 'Sol peruano (PEN)' },
        { value: 'USD', label: 'Dolar estadounidense (USD)' },
        { value: 'EUR', label: 'Euro (EUR)' },
        { value: 'GBP', label: 'Libra esterlina (GBP)' },
        { value: 'JPY', label: 'Yen japones (JPY)' },
        { value: 'CAD', label: 'Dolar canadiense (CAD)' },
        { value: 'AUD', label: 'Dolar australiano (AUD)' },
        { value: 'CHF', label: 'Franco suizo (CHF)' },
        { value: 'CNY', label: 'Yuan chino (CNY)' },
        { value: 'INR', label: 'Rupia india (INR)' },
        { value: 'BRL', label: 'Real brasileno (BRL)' },
        { value: 'ZAR', label: 'Rand sudafricano (ZAR)' },
        { value: 'ARS', label: 'Peso argentino (ARS)' },
        { value: 'MXN', label: 'Peso mexicano (MXN)' },
        { value: 'COP', label: 'Peso colombiano (COP)' },
    ];

    return (
        <div className="container mt-5">
            <div className="card">
                <h1 className="card-header bg-info text-white text-center">Crear Recibo</h1>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="title">Titulo del Recibo:</label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={state.title}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Logo de Marca:</label>
                                    {state.logoPreview ? (
                                        <img
                                            src={state.logoPreview}
                                            alt="Logo de Marca"
                                            className="img-fluid m-3"
                                            style={{ maxWidth: '100px' }} />
                                        
                                    ) : (
                                        <input
                                            type="file"
                                            name="logo"
                                            onChange={handleLogoChange}
                                            className="form-control"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Tipo de Moneda:</label>
                                    <select
                                        name="currency"
                                        value={state.currency}
                                        onChange={handleChange}
                                        className="form-control"
                                    >
                                        <option value="">Seleccione una moneda</option>
                                        {currencyOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Monto a Cobrar:</label>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={state.amount}
                                        onChange={handleChange}
                                        step="0.01"
                                        className="form-control"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Descripcion del Recibo:</label>
                            <textarea
                                name="description"
                                value={state.description}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Direccion:</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={state.address}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Nombres Completos:</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={state.fullName}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Tipo de Documento:</label>
                                    <input
                                        type="text"
                                        name="documentType"
                                        value={state.documentType}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Numero de Documento:</label>
                                    <input
                                        type="text"
                                        name="documentNumber"
                                        value={state.documentNumber}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>
                            </div>
                        </div>
                        <button className="btn btn-danger btn-block mt-3" type="submit">
                            Generar y Descargar Recibo PDF
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default App;
