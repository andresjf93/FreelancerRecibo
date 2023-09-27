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
            const response = await fetch("api/Crear/PDF", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({state : state }),
            });
    console.log(response)
            if (response.ok) {
                const data = await response.json();
                setState(data);
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
        <>
            <div className="container  p-3 ">
                <div className="card text-center m-3  card-body row ">
                    <h1 className="card-title bg-black text-info d-flex align-items-center justify-content-center ">Crear Recibo</h1>

                    <form className="border bg-secondary text-white  text-center form-control "
                        onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="title ">Titulo del Recibo:</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={state.title}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-group">
                            <label>Logo de Marca:</label>
                            {state.logoPreview ? (
                                <img
                                    src={state.logoPreview}
                                    alt="Logo de Marca"
                                    style={{ maxWidth: '100px' }}
                                />
                            ) : (
                                <input
                                    type="file"
                                    name="logo"
                                    onChange={handleLogoChange}
                                />
                            )}
                        </div>
                        <div className="input-group">
                        <label>Tipo de Moneda:</label>
                        <select
                            name="currency"
                            value={state.currency}
                            onChange={handleChange}
                        >
                            <option value="">Seleccione una moneda</option>
                            {currencyOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        </div>
                        <div className="input-group">
                            <label>
                                Monto a Cobrar:
                            </label>
                            <input
                                type="number"
                                name="amount"
                                value={state.amount}
                                onChange={handleChange}
                                step="0.01" // Permite decimales (centavos)
                            />
                        </div>
                        <div className="input-group">
                            <label>
                                Descripcion del Recibo:
                            </label>
                            <textarea
                                name="description"
                                value={state.description}
                                onChange={handleChange}
                            />
                        
                        </div>
                        <div className="input-group">
                            <label>
                                Direccion:
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={state.address}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-group">
                            <label>
                                Nombres Completos:
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={state.fullName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-group">
                            <label>
                                Tipo de Documento:
                            </label>
                            <input
                                type="text"
                                name="documentType"
                                value={state.documentType}
                                onChange={handleChange}
                            />
                        </div>
                           <div>
                            <label>
                                Numero de Documento:
                            </label>
                            <input
                                type="text"
                                name="documentNumber"
                                value={state.documentNumber}
                                onChange={handleChange}
                            />
                        </div>
                    
                        <button className="btn btn-danger m-3 p-2" type="submit">Generar Recibo</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default App;