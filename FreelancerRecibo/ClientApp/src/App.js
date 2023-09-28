import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import jsPDF from 'jspdf'; // Importa jsPDF
import 'jspdf-autotable';

const App = () => {

    const handleSubmit = () => {
    // Crea un nuevo documento PDF
    const pdf = new jsPDF();

    // Logo
        if (state.logo) {
            const logoWidth = 30; // Adjust the width as needed
            const logoHeight = 20; // Adjust the height as needed
            pdf.addImage(state.logo, 'JPEG', 130, 70, logoWidth, logoHeight);
        }

        // Add a horizontal line after the logo (adjust coordinates as needed)
        pdf.line(50, 60, 110, 60);

        // Add the header section
        pdf.setFontSize(14);
        pdf.text(20, 70, 'Recibo de Pago');

        // Add the recipient information (e.g., customer's name and address)
        pdf.setFontSize(12);
        pdf.text(20, 90, ''+ state.title);
        pdf.text(20, pdf.autoTableEndPosY() + 100, 'Nombre: ' + state.fullName);
        pdf.text(20, pdf.autoTableEndPosY() + 110, '' + state.documentType + ': ' + state.documentNumber);
        pdf.text(20, pdf.autoTableEndPosY() + 120, 'Direccion: ' + state.address);

        // Add a horizontal line after the recipient information
        pdf.line(20, 130, 190, 120);

        // Define the table for line items
        const tableHeaders = ['Descripcion', 'Monto'];
        const tableData = [
            ['Concepto: ' + state.description, state.currency + state.amount],
            // Puedes agregar más elementos de línea según sea necesario
        ];

        // Define estilos para la tabla
        const styles = {
            cellWidth: 'wrap', // Ajusta automáticamente los anchos de columna según el contenido
            fontSize: 12,
        };

        // Agrega la tabla utilizando la función autoTable
        pdf.autoTable({
            startY: 140,
            head: [tableHeaders],
            body: tableData,
            theme: 'striped',
            styles: styles, // Usa la opción 'styles' para establecer los anchos de columna
        });

        // Agrega una línea horizontal después de la tabla
        pdf.line(20, pdf.autoTableEndPosY() + 5, 190, pdf.autoTableEndPosY() + 5);

       
    // Guarda el PDF como un Blob
    const blob = pdf.output('blob');

    // Crea una URL para el Blob
    const url = URL.createObjectURL(blob);

    // Crea un enlace para descargar el PDF
    const a = document.createElement('a');
    a.href = url;
    a.download = state.title+'_recibo.pdf'; // Nombre del archivo PDF
    a.style.display = 'none';

    // Agrega el enlace al DOM y simula un clic para descargar el PDF
    document.body.appendChild(a);
    a.click();

    // Limpia la URL y elimina el enlace
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
};
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
    const DocumentOptions = [
        { value: 'DNI', label: 'DNI (Documento Nacional de Identidad)' },
        { value: 'CARNET', label: 'Carnet de Identidad' },
        { value: 'PASAPORTE', label: 'Pasaporte' },
        { value: 'RUC', label: 'RUC (Registro Único de Contribuyentes)' },
        { value: 'CE', label: 'Carnet de extrangeria' },

        
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
                                    <select
                                        name="documentType"
                                        value={state.documentType}
                                        onChange={handleChange}
                                        className="form-control"
                                    >
                                        <option value="">Seleccione un tipo de documento</option>
                                        {DocumentOptions.map((option) => (
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
