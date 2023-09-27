import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import jsPDF from 'jspdf'; // Importa jsPDF

const App = () => {
    const handleDownloadPDF = () => {
        // Crea un nuevo documento PDF
        const pdf = new jsPDF();
             

        // Agrega contenido al PDF
        pdf.text(10, 10, 'Factura');
        pdf.text(20, 20, 'Titulo del Recibo:' + state.title);
        pdf.text(20, 30, 'Tipo de Moneda:' + state.currency);
        pdf.text(20, 40, 'Monto a Cobrar: ' + state.amount);
        pdf.text(20, 50, 'Descripcion del Recibo: ' + state.description);
        pdf.text(20, 60, 'Direccion: ' + state.address);
        pdf.text(20, 70, 'Nombres Completos: ' + state.fullName);
        pdf.text(20, 80, 'Tipo de Documento: ' + state.documentType);
        pdf.text(20, 90, 'Numero de Documento: ' + state.documentNumber);

        if (state.logo) {
        pdf.addImage(state.logo, 'JPEG', 10, 90, 50, 50); // Cambia las coordenadas y dimensiones según tu diseño
    }
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
            <div className="container p-3">
                <div className="card text-center m-3 card-body row">
                    <h1 className="card-title bg-black text-info d-flex align-items-center justify-content-center">Crear Recibo</h1>

                    <form className="border bg-secondary text-white text-center form-control" onSubmit={handleSubmit}>
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
                                    <label className="m-3">Logo de Marca:</label>
                                    {state.logoPreview ? (
                                        <img src={state.logoPreview} alt="Logo de Marca" style={{ maxWidth: '100px' }} />
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

                        <button className="btn btn-danger m-3 p-2" type="submit" onClick={handleDownloadPDF}>
                            Generar y Descargar Recibo PDF
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default App;