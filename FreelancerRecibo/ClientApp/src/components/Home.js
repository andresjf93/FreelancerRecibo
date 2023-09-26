import React, { Component } from 'react';
import axios from 'axios';
import './receipt.css'; 

export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = {
            logo: '', // Para almacenar la URL del logo
            currency: '', // Para almacenar el tipo de moneda
            amount: '', // Para almacenar el monto a cobrar
            title: '', // Para almacenar el título del recibo
            description: '', // Para almacenar la descripción del recibo
            address: '', // Para almacenar la dirección
            fullName: '', // Para almacenar el nombre completo
            documentType: '', // Para almacenar el tipo de documento
            documentNumber: '', // Para almacenar el número de documento
            logoPreview: null, // Para mostrar la vista previa del logo
        };
    }

    // Manejar cambios en los campos de entrada
    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
        if (name === 'amount' && parseFloat(value) < 0) {
            // Si es negativo, establecer el valor en cero
            this.setState({ [name]: '0' });
        } else {
            // Si es un valor no negativo, actualizar el estado normalmente
            this.setState({ [name]: value });
        }
   
    };

    // Manejar el envío del formulario
    handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/api/generateReceipt', this.state);
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'recibo.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error al generar el recibo:', error);
        }
    };
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
            <div className="container">
                <h1>Crear Recibo</h1>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Titulo del Recibo:
                        <input
                            type="text"
                            name="title"
                            value={this.state.title}
                            onChange={this.handleChange}
                        />
                    </label>
                    <label>
                        Logo de Marca:
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
                    </label>
                    <label>
                        Tipo de Moneda:
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
                    </label>
                    <label>
                        Monto a Cobrar:
                        <input
                            type="number"
                            name="amount"
                            value={this.state.amount}
                            onChange={this.handleChange}
                            step="0.01" // Permite decimales (centavos)
                        />
                    </label>
                    <label>
                        Descripcion del Recibo:
                        <textarea
                            name="description"
                            value={this.state.description}
                            onChange={this.handleChange}
                        />
                    </label>
                    <label>
                        Direccion:
                        <input
                            type="text"
                            name="address"
                            value={this.state.address}
                            onChange={this.handleChange}
                        />
                    </label>
                    <label>
                        Nombres Completos:
                        <input
                            type="text"
                            name="fullName"
                            value={this.state.fullName}
                            onChange={this.handleChange}
                        />
                    </label>
                    <label>
                        Tipo de Documento:
                        <input
                            type="text"
                            name="documentType"
                            value={this.state.documentType}
                            onChange={this.handleChange}
                        />
                    </label>
                    <label>
                        Numero de Documento:
                        <input
                            type="text"
                            name="documentNumber"
                            value={this.state.documentNumber}
                            onChange={this.handleChange}
                        />
                    </label>
                    <button type="submit">Generar Recibo</button>
                </form>
            </div>
        );
    }
}
