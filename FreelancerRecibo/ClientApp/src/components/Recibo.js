import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import { rgb, PDFDocument, StandardFonts, drawText, drawImage } from 'pdf-lib';
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

        // Crea un nuevo documento PDF
        const pdfDoc = await PDFDocument.create();

        // Agrega una nueva página al documento
        const page = pdfDoc.addPage([400, 600]);

        // Dibuja contenido en la página
        const { width, height } = page.getSize();
        const fontSize = 12; // Tamaño de fuente para la factura
        const x = 50; // Posición X para el contenido
        let y = height - 50; // Posición Y para el contenido, comenzando desde la parte superior

        // Agregar el título del recibo
        const title = this.state.title || 'Título no especificado';
        page.drawText(`Título del Recibo: ${title}`, {
            x,
            y,
            size: fontSize,
            color: rgb(0, 0, 0),
        });
        y -= 20;

        // Agregar el logo (si está presente)
        if (this.state.logoPreview) {
            const logoImage = await pdfDoc.embedJpg(this.state.logoPreview);
            const logoDims = logoImage.scale(0.2); // Ajusta el tamaño de la imagen según tus necesidades
            page.drawImage(logoImage, {
                x,
                y,
                width: logoDims.width,
                height: logoDims.height,
            });
            y -= logoDims.height + 10;
        }

        // Agregar el tipo de moneda
        const currency = this.state.currency || 'Moneda no especificada';
        page.drawText(`Tipo de Moneda: ${currency}`, {
            x,
            y,
            size: fontSize,
            color: rgb(0, 0, 0),
        });
        y -= 20;

        // Agregar el monto a cobrar
        const amount = this.state.amount || '0';
        page.drawText(`Monto a Cobrar: ${amount}`, {
            x,
            y,
            size: fontSize,
            color: rgb(0, 0, 0),
        });
        y -= 20;

        // Agregar la descripción
        const description = this.state.description || 'Descripción no especificada';
        page.drawText(`Descripción del Recibo: ${description}`, {
            x,
            y,
            size: fontSize,
            color: rgb(0, 0, 0),
        });
        y -= 40;

        // Agregar la dirección
        const address = this.state.address || 'Dirección no especificada';
        page.drawText(`Dirección: ${address}`, {
            x,
            y,
            size: fontSize,
            color: rgb(0, 0, 0),
        });
        y -= 20;

        // Agregar el nombre completo
        const fullName = this.state.fullName || 'Nombre no especificado';
        page.drawText(`Nombres Completos: ${fullName}`, {
            x,
            y,
            size: fontSize,
            color: rgb(0, 0, 0),
        });
        y -= 20;

        // Agregar el tipo de documento
        const documentType = this.state.documentType || 'Tipo de Documento no especificado';
        page.drawText(`Tipo de Documento: ${documentType}`, {
            x,
            y,
            size: fontSize,
            color: rgb(0, 0, 0),
        });
        y -= 20;

        // Agregar el número de documento
        const documentNumber = this.state.documentNumber || 'Número de Documento no especificado';
        page.drawText(`Número de Documento: ${documentNumber}`, {
            x,
            y,
            size: fontSize,
            color: rgb(0, 0, 0),
        });

        // Serializa el documento PDF a bytes
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
                                                onChange={this.handleLogoChange} // Necesitas implementar handleLogoChange
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

    
    

