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

        // Crea un nuevo documento PDF en formato A4 (595x842 puntos)
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([595, 842]);

        // Dibuja el contenido en la página
        const { width, height } = page.getSize();
        const fontSize = 12;
        const margin = 50; // Margen izquierdo
        let y = height - margin;

        // Definir una función para dibujar una fila de la tabla
        const drawTableRow = (label, value) => {
            page.drawText(label, {
                x: margin,
                y,
                size: fontSize,
                color: rgb(0, 0, 0), // Color de texto negro
            });
            page.drawText(value, {
                x: margin + 200, // Alinea el valor a la derecha
                y,
                size: fontSize,
                color: rgb(0, 0, 0),
            });
            y -= 20; // Espacio entre filas
        };

        // Agregar el logo (si está presente)
        if (this.state.logoPreview) {
            const logoImage = await pdfDoc.embedJpg(this.state.logoPreview);
            const logoDims = logoImage.scale(0.2); // Ajusta el tamaño de la imagen según tus necesidades
            page.drawImage(logoImage, {
                x: margin,
                y: height - margin - logoDims.height,
                width: logoDims.width,
                height: logoDims.height,
                rotate: degrees(0), // Rotación de la imagen (0 grados en este caso)
            });
            y -= logoDims.height + 10; // Espacio después de agregar el logo
        }

        // Agregar el título de la factura
        page.drawText('Factura', {
            x: margin + 200, // Alinea el título al centro
            y,
            size: fontSize + 4, // Tamaño de fuente más grande para el título
            color: rgb(0, 0, 0),
        });
        y -= 40;

    // Agregar filas a la "tabla" con los datos
    drawTableRow('Título del Recibo:', this.state.title || 'Título no especificado');
    drawTableRow('Tipo de Moneda:', this.state.currency || 'Moneda no especificada');
    drawTableRow('Monto a Cobrar:', this.state.amount || '0');
    drawTableRow('Descripción del Recibo:', this.state.description || 'Descripción no especificada');
    drawTableRow('Dirección:', this.state.address || 'Dirección no especificada');
    drawTableRow('Nombres Completos:', this.state.fullName || 'Nombre no especificado');
    drawTableRow('Tipo de Documento:', this.state.documentType || 'Tipo de Documento no especificado');
    drawTableRow('Número de Documento:', this.state.documentNumber || 'Número de Documento no especificado');
    const pdfBytes = await pdfDoc.save();

    // Convierte los bytes en un Blob
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });

    // Crea una URL para el Blob
    const pdfUrl = URL.createObjectURL(pdfBlob);

    // Crea un enlace para descargar el PDF
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = 'factura.pdf'; // Puedes configurar aquí el nombre del archivo
    a.style.display = 'none';

    // Agrega el enlace al DOM y simula un clic
    document.body.appendChild(a);
    a.click();

    // Limpia después de la descarga
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
        { value: '$', label: 'Peso argentino (ARS)' },
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

    
    

