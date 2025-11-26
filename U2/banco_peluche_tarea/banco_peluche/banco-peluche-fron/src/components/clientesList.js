import React, { useEffect, useState } from 'react';
import ClienteService from '../services/clienteServices';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ClientesList = () => {
    const [clientes, setClientes] = useState([]);

    const cargarClientes = async () => {
        try {
            const response = await ClienteService.obtenerTodos();
            if (response.ok) {
                setClientes(response.data);
            }
        } catch (error) {
            console.error("Error al cargar clientes:", error);
        }
    };

    useEffect(() => {
        cargarClientes();
    }, []);

    const generarPDFHistorial = (cliente) => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text(`Historial del Cliente: ${cliente.nombre}`, 14, 22);

        doc.setFontSize(12);
        doc.text(`Fecha de Reporte: ${new Date().toLocaleDateString()}`, 14, 30);

        const tableColumn = ["Concepto", "Valor"];
        const tableRows = [
            ["Saldo Anterior", `$${cliente.saldoAnterior.toFixed(2)}`],
            ["Monto Compras", `$${cliente.montoCompras.toFixed(2)}`],
            ["Pago Realizado", `$${cliente.pagoRealizado.toFixed(2)}`],
            [
                "Saldo Base", 
                `$${(cliente.saldoAnterior + cliente.montoCompras - cliente.pagoRealizado).toFixed(2)}`
            ],
            ["Es Moroso", cliente.esMoroso ? "SÍ" : "NO"],
            ["Interés Generado", `$${cliente.interes.toFixed(2)}`],
            ["Multa", `$${cliente.multa.toFixed(2)}`],
            ["Saldo Actual", `$${cliente.saldoActual.toFixed(2)}`],
            ["Pago Mínimo", `$${cliente.pagoMinimo.toFixed(2)}`],
            ["Pago No Intereses", `$${cliente.pagoNoIntereses.toFixed(2)}`]
        ];

        autoTable(doc, {
            startY: 40,
            head: [tableColumn],
            body: tableRows,
        });

        doc.save(`historial_${cliente.nombre}.pdf`);
    };

    return (
        <div className="card" style={{ marginTop: '20px' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
            }}>
                <h3>Listado de Clientes</h3>
                <button
                    onClick={cargarClientes}
                    style={{ width: 'auto', padding: '8px 15px' }}
                >
                    Actualizar Lista
                </button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Saldo Actual</th>
                            <th>Pago Mínimo</th>
                            <th>Moroso</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.length > 0 ? (
                            clientes.map((cliente) => (
                                <tr key={cliente.id}>
                                    <td>{cliente.nombre}</td>
                                    <td>${cliente.saldoActual.toFixed(2)}</td>
                                    <td>${cliente.pagoMinimo.toFixed(2)}</td>
                                    <td className={cliente.esMoroso ? "text-danger" : "text-success"}>
                                        {cliente.esMoroso ? "SÍ" : "NO"}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => generarPDFHistorial(cliente)}
                                            style={{
                                                width: 'auto',
                                                padding: '5px 10px',
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            Ver Historial (PDF)
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center' }}>
                                    No hay clientes registrados
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClientesList;
