import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
export class Recibo extends Component {
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


    handleSubmit = async (event) => {
        event.preventDefault();

       const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([595, 842]);

    // Agrega un logo (ajusta las coordenadas y dimensiones según sea necesario)
        if (this.state.logo) {
            const logoImage = await pdfDoc.embedJpg(this.state.logo);
        const logoDims = logoImage.scale(0.2);
        page.drawImage(logoImage, {
            x: 230,
            y: 700,
            width: logoDims.width,
            height: logoDims.height,
        });
    }

    page.drawLine({
        start: { x: 50, y: 690 },
        end: { x: 500, y: 690 },
        thickness: 1,
        color: rgb(0, 0, 0),
    });

    page.drawText('Recibo de Pago', {
        x: 250,
        y: 670,
        size: 14,
        color: rgb(0, 0, 0),
    });

        page.drawText(this.state.title, {
        x: 50,
        y: 650,
        size: 12,
        color: rgb(0, 0, 0),
    });
        page.drawText(`Nombre: ${this.state.fullName}`, {
        x: 50,
            y: 580,
        size: 12,
        color: rgb(0, 0, 0),
    });
        page.drawText(`${this.state.documentType}: ${this.state.documentNumber}`, {
        x: 50,
        y: 550,
        size: 12,
        color: rgb(0, 0, 0),
    });
        page.drawText(`Dirección: ${this.state.address}`, {
        x: 50,
        y: 530,
        size: 12,
        color: rgb(0, 0, 0),
    });

    // Agrega una línea horizontal después de la información del destinatario
    page.drawLine({
        start: { x: 50, y: 500 },
        end: { x: 500, y: 500 },
        thickness: 1,
        color: rgb(0, 0, 0),
    });

    // Define los datos de la tabla de línea de artículos
    const tableData = [
        ['Descripción', 'Monto'],
        [this.state.description, `${this.state.currency} ${this.state.amount}`],
        // Puedes agregar más elementos de línea según sea necesario
    ];
        // Establece las coordenadas iniciales de la tabla
        let tableX = 30;
        let tableY = 450;

        // Define el ancho de las columnas
        const columnWidth = 260;

        // Define estilos para la tabla
        const tableStyle = {
            fontSize: 12,
            padding: 5,
            color: rgb(0, 0, 0),
        };
        const tableWidth = columnWidth * 2;
        const tableHeight = (tableData.length + 1) * 20; // Altura de la tabla más una fila para los encabezados
        const bgColor = rgb(240 / 255, 240 / 255, 240 / 255); // Color de fondo gris claro

        page.drawRectangle({
            x: tableX,
            y: tableY - tableHeight,
            width: tableWidth,
            height: tableHeight,
            color: bgColor, // Color de fondo de la tabla (gris claro)
            borderColor: rgb(0, 0, 0), // Color del borde de la tabla (negro en este ejemplo)
            borderWidth: 1, // Ancho del borde
        });
        // Dibuja los bordes de la tabla
        for (let i = 0; i <= tableData.length - 1; i++) {
            page.drawLine({
                start: { x: tableX, y: tableY - i * 20 },
                end: { x: tableX + columnWidth * 2, y: tableY - i * 20 },
                thickness: 1,
                color: rgb(0, 0, 0),
            });
        }

        // Dibuja los datos de la tabla
        tableData.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                page.drawText(cell, {
                    x: tableX + columnIndex * columnWidth,
                    y: tableY - rowIndex * 20 - 15, // Alinea verticalmente el texto en el centro de la celda
                    size: 12,
                    color: rgb(0, 0, 0),
                });
            });
        });

     
    // Guarda el PDF como un Blob
    const pdfBytes = await pdfDoc.save();

    // Crea una URL para el Blob
    const pdfUrl = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));

    // Crea un enlace para descargar el PDF
    const a = document.createElement('a');
    a.href = pdfUrl;
        a.download = `${this.state.title}_recibo.pdf`; // Nombre del archivo PDF
    a.style.display = 'none';

    // Agrega el enlace al DOM y simula un clic para descargar el PDF
    document.body.appendChild(a);
    a.click();

    // Limpia la URL y elimina el enlace
    URL.revokeObjectURL(pdfUrl);
    document.body.removeChild(a);
};



    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });

        if (name === 'amount' && parseFloat(value) < 0) {
            this.setState({ [name]: '0' });
        }
    };
    handleLogoChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            this.setState({ ...this.state, logo: reader.result, logoPreview: reader.result });
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    currencyOptions = [
        { value: 'S/', label: 'Sol peruano (PEN)' },
        { value: '$', label: 'Dolar estadounidense (USD)' },
        { value: '€', label: 'Euro (EUR)' },
        { value: '£', label: 'Libra esterlina (GBP)' },
        { value: '¥', label: 'Yen japones (JPY)' },
        { value: 'C$', label: 'Dolar canadiense (CAD)' },
        { value: 'A$', label: 'Dolar australiano (AUD)' },
        { value: 'CHF', label: 'Franco suizo (CHF)' },
        { value: '¥', label: 'Yuan chino (CNY)' },
        { value: '₹', label: 'Rupia india (INR)' },
        { value: 'R$', label: 'Real brasileno (BRL)' },
        { value: 'R', label: 'Rand sudafricano (ZAR)' },
        { value: 'ARG$', label: 'Peso argentino (ARS)' },
        { value: 'Mex$', label: 'Peso mexicano (MXN)' },
        { value: 'Cop$', label: 'Peso colombiano (COP)' },
    ];

    DocumentOptions = [
        { value: 'DNI', label: 'DNI (Documento Nacional de Identidad)' },
        { value: 'CARNET', label: 'Carnet de Identidad' },
        { value: 'PASAPORTE', label: 'Pasaporte' },
        { value: 'RUC', label: 'RUC (Registro Único de Contribuyentes)' },
        { value: 'CE', label: 'Carnet de extranjería' }, // Corregido 'extrangeria' a 'extranjería'
    ];

    render() {
        return (
            <div className="container mt-5">
                <div className="card">
                    <h1 className="card-header bg-info text-white text-center">Crear Recibo</h1>
                    <div className="card-body">
                        <form onSubmit={this.handleSubmit}>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="title">Titulo del Recibo:</label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={this.state.title}
                                            onChange={this.handleChange}
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Logo de Marca:</label>
                                        {this.state.logoPreview ? (
                                            <img
                                                src={this.state.logoPreview}
                                                alt="Logo de Marca"
                                                className="img-fluid m-3"
                                                style={{ maxWidth: '100px' }}
                                            />
                                        ) : (
                                            <input
                                                type="file"
                                                name="logo"
                                                onChange={this.handleLogoChange} 
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
                                            value={this.state.currency}
                                            onChange={this.handleChange}
                                            className="form-control"
                                        >
                                            <option value="">Seleccione una moneda</option>
                                            {this.currencyOptions.map((option) => (
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
                                            value={this.state.amount}
                                            onChange={this.handleChange}
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
                                    value={this.state.description}
                                    onChange={this.handleChange}
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
                                            value={this.state.address}
                                            onChange={this.handleChange}
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
                                            value={this.state.fullName}
                                            onChange={this.handleChange}
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Tipo de Documento:</label>
                                        <select
                                            name="documentType"
                                            value={this.state.documentType}
                                            onChange={this.handleChange}
                                            className="form-control"
                                        >
                                            <option value="">Seleccione un tipo de documento</option>
                                            {this.DocumentOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Numero de Documento:</label>
                                        <input
                                            type="text"
                                            name="documentNumber"
                                            value={this.state.documentNumber}
                                            onChange={this.handleChange}
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
    }
}

    
    

