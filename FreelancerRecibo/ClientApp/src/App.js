import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
        };
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });

        if (name === 'amount' && parseFloat(value) < 0) {
            this.setState({ [name]: '0' });
        }
    };
    handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:44415/api/Recibo/GenerateRecibo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });
            if (response.status === 200) {
                const blob = await response.json();
                console.log(blob);
            } else {
                console.error('Error al generar el recibo. Código de estado:', response.status);
            }
        } catch (error) {
            console.error('Error al generar el recibo:', error);
        }
    }
    handleLogoChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            this.setState({ logo: reader.result, logoPreview: reader.result });
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    render() {
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
                <div className="container">
                    <div className="card text-center m-3 p-3 card-body">
                        <h1 className="card-title bg-black text-info">Crear Recibo</h1>

                        <form className="border bg-secondary text-white flex-column" onSubmit={this.handleSubmit}>
                            <div>
                                <label>Titulo del Recibo:</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={this.state.title}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div>
                                <label>Logo de Marca:</label>
                                {this.state.logoPreview ? (
                                    <img
                                        src={this.state.logoPreview}
                                        alt="Logo de Marca"
                                        style={{ maxWidth: '100px' }}
                                    />
                                ) : (
                                    <input
                                        type="file"
                                        name="logo"
                                        onChange={this.handleLogoChange}
                                    />
                                )}
                            </div>
                            <div>
                                <label>Tipo de Moneda:</label>
                                <select
                                    name="currency"
                                    value={this.state.currency}
                                    onChange={this.handleChange}
                                >
                                    <option value="">Seleccione una moneda</option>
                                    {currencyOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                    <div>
                            <label>
                        Monto a Cobrar:
                            </label>
                        <input
                            type="number"
                            name="amount"
                            value={this.state.amount}
                            onChange={this.handleChange}
                            step="0.01" // Permite decimales (centavos)
                        />
                            </div>
                    <div>
                    <label>
                        Descripcion del Recibo:
                            </label>
                        <textarea
                            name="description"
                            value={this.state.description}
                            onChange={this.handleChange}
                                />
                        </div>
                            <div>
                    <label>
                        Direccion:
                            </label>
                        <input
                            type="text"
                            name="address"
                            value={this.state.address}
                            onChange={this.handleChange}
                        />
                            </div>
                            <div>
                    <label>
                        Nombres Completos:
                            </label>
                        <input
                            type="text"
                            name="fullName"
                            value={this.state.fullName}
                            onChange={this.handleChange}
                        />
                            </div>
                            <div>
                    <label>
                        Tipo de Documento:
                            </label>
                        <input
                            type="text"
                            name="documentType"
                            value={this.state.documentType}
                            onChange={this.handleChange}
                        />
                            </div>
                            <div>
                    <label>
                        Numero de Documento:
                            </label>
                        <input
                            type="text"
                            name="documentNumber"
                            value={this.state.documentNumber}
                            onChange={this.handleChange}
                        />
                            </div>
                        
                        <button className="btn btn-danger m-3 p-2" type="submit">Generar Recibo</button>
                    </form>
                </div>
            </div >
            </>
        );
    }
}
