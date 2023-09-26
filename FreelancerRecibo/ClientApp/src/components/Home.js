import React, { Component } from 'react';
import axios from 'axios';

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
        };
    }

    // Manejar cambios en los campos de entrada
    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
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
          this.setState({ logo: reader.result }); // Almacena la URL de la imagen en el estado
            };

            if (file) {
                reader.readAsDataURL(file);
            }
        };

       
    };

render() { 
        return (
            <div>
                <h1>Crear Recibo</h1>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Logo de Marca:
                        <input
                            type="file"
                            name="logo"
                            onChange={this.handleLogoChange}
                        />
                    </label>
                    <label>
                        Tipo de Moneda:
                        <input
                            type="text"
                            name="currency"
                            value={this.state.currency}
                            onChange={this.handleChange}
                        />
                    </label>
                    <label>
                        Monto a Cobrar:
                        <input
                            type="text"
                            name="amount"
                            value={this.state.amount}
                            onChange={this.handleChange}
                        />
                    </label>
                    <label>
                        Título del Recibo:
                        <input
                            type="text"
                            name="title"
                            value={this.state.title}
                            onChange={this.handleChange}
                        />
                    </label>
                    <label>
                        Descripción del Recibo:
                        <textarea
                            name="description"
                            value={this.state.description}
                            onChange={this.handleChange}
                        />
                    </label>
                    <label>
                        Dirección:
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
                        Número de Documento:
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
