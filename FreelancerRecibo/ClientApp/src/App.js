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
        try {
            const response = await fetch("/api/crear/GenerarPDF", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({ state: state }),
            });
            console.log(response);
            if (response.ok) {
                // Aquí puedes realizar alguna acción después de generar el PDF, si es necesario.
                // Por ejemplo, mostrar un mensaje de éxito o redirigir a otra página.
            } else {
                console.error('Error al generar el recibo. Código de estado:', response.status);
            }
        } catch (error) {
            console.error('Error al generar el recibo:', error);
        }
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
        // ... Otras opciones de moneda
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
