import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export function Clientes() {
    const [clientes, setClientes] = useState([]);
   

    async function mostrarClientes() {
       
            const response = await fetch("/api/Clientes/Lista");
        if (response.ok) {
            const data = await response.json();
            setClientes(data);
        } else {
            console.log("status code: " + response.status);
        }
            
    }

    useEffect(() => {
        mostrarClientes();
    }, []); // El segundo argumento [] indica que useEffect se ejecuta solo una vez (equivalente a componentDidMount)

    return (

        <table className='table table-striped' aria-labelledby="tabelLabel">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Tipo de documento (C)</th>
                    <th>Numero de documento (F)</th>
                    <th>Direccion</th>
                </tr>
            </thead>
            <tbody>
                {clientes.map((cliente) => (
                    <tr key={cliente.UserId}>
                        <td>{cliente.Nombres}</td>
                        <td>{cliente.TipoDocumento}</td>
                        <td>{cliente.NumeroDocumento}</td>
                        <td>{cliente.DireccionDomicilio}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
    

    
}
