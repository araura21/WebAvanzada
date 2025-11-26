import React, { useEffect, useState } from 'react';
import ClienteService from '../services/clienteServices.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

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
            ["Cédula", cliente.cedula || 'N/A'],
            ["Teléfono", cliente.telefono || 'N/A'],
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

    const exportarExcel = () => {
        const ws = XLSX.utils.json_to_sheet(clientes.map(cliente => ({
            Nombre: cliente.nombre,
            Cédula: cliente.cedula || 'N/A',
            Teléfono: cliente.telefono || 'N/A',
            "Saldo Anterior": cliente.saldoAnterior,
            "Monto Compras": cliente.montoCompras,
            "Pago Realizado": cliente.pagoRealizado,
            "Es Moroso": cliente.esMoroso ? "SÍ" : "NO",
            "Saldo Actual": cliente.saldoActual,
            "Pago Mínimo": cliente.pagoMinimo,
            "Pago No Intereses": cliente.pagoNoIntereses,
            "Interés": cliente.interes,
            "Multa": cliente.multa
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Clientes");
        XLSX.writeFile(wb, "clientes.xlsx");
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
                <div>
                    <button
                        onClick={exportarExcel}
                        style={{ width: 'auto', padding: '8px 15px', marginRight: '10px', backgroundColor: '#28a745', color: 'white' }}
                    >
                        Exportar Excel
                    </button>
                    <button
                        onClick={cargarClientes}
                        style={{ width: 'auto', padding: '8px 15px' }}
                    >
                        Actualizar Lista
                    </button>
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Cédula</th>
                            <th>Teléfono</th>
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
                                    <td>{cliente.cedula || 'N/A'}</td>
                                    <td>{cliente.telefono || 'N/A'}</td>
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
                                <td colSpan="7" style={{ textAlign: 'center' }}>
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
