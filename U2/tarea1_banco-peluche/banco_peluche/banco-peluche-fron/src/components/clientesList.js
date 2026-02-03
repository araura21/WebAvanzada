import React, { useEffect, useState } from 'react';
import ClienteService from '../services/clienteServices.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const ClientesList = ({ onSeleccionarCliente }) => {
    const [clientes, setClientes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = clientes.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(clientes.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const generarPDFEstadoCuenta = (cliente) => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text(`Estado de Cuenta: ${cliente.nombre}`, 14, 22);

        doc.setFontSize(12);
        doc.text(`Fecha de Corte: ${new Date(cliente.createdAt).toLocaleDateString()}`, 14, 30);
        doc.text(`Cédula: ${cliente.cedula || 'N/A'}`, 14, 36);

        const tableColumn = ["Concepto", "Valor"];
        const tableRows = [
            ["Saldo Anterior", `$${cliente.saldoAnterior.toFixed(2)}`],
            ["Compras del Período", `$${cliente.montoCompras.toFixed(2)}`],
            ["Pagos Realizados", `-$${cliente.pagoRealizado.toFixed(2)}`],
            ["----------------", "----------------"],
            ["Saldo Actual", `$${cliente.saldoActual.toFixed(2)}`],
            ["Pago Mínimo", `$${cliente.pagoMinimo.toFixed(2)}`],
            ["Pago para no generar intereses", `$${cliente.pagoNoIntereses.toFixed(2)}`],
            ["Interés Generado", `$${cliente.interes.toFixed(2)}`],
            ["Multa", `$${cliente.multa.toFixed(2)}`],
            ["Estado", cliente.esMoroso ? "MOROSO" : "AL DÍA"]
        ];

        autoTable(doc, {
            startY: 45,
            head: [tableColumn],
            body: tableRows,
        });

        doc.save(`estado_cuenta_${cliente.nombre}_${new Date().getTime()}.pdf`);
    };

    const generarPDFHistorialCompleto = (cliente) => {
        const doc = new jsPDF();
        const historial = clientes.filter(c => c.cedula === cliente.cedula).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        doc.setFontSize(18);
        doc.text(`Historial Completo: ${cliente.nombre}`, 14, 22);
        doc.setFontSize(12);
        doc.text(`Cédula: ${cliente.cedula || 'N/A'}`, 14, 30);

        const tableColumn = ["Fecha", "Saldo Ant.", "Compras", "Pagos", "Saldo Act.", "Estado"];
        const tableRows = historial.map(reg => [
            new Date(reg.createdAt).toLocaleDateString(),
            `$${reg.saldoAnterior.toFixed(2)}`,
            `$${reg.montoCompras.toFixed(2)}`,
            `$${reg.pagoRealizado.toFixed(2)}`,
            `$${reg.saldoActual.toFixed(2)}`,
            reg.esMoroso ? "Moroso" : "Al día"
        ]);

        autoTable(doc, {
            startY: 40,
            head: [tableColumn],
            body: tableRows,
        });

        doc.save(`historial_completo_${cliente.nombre}.pdf`);
    };

    const handleNuevoPago = (cliente) => {
        // Encontrar el último registro de este cliente (asumiendo que 'clientes' viene ordenado DESC por fecha o lo ordenamos)
        // El backend devuelve ordenado por createdAt DESC, así que el primero que encontremos con esa cédula es el último.
        const ultimoRegistro = clientes.find(c => c.cedula === cliente.cedula);
        if (ultimoRegistro) {
            onSeleccionarCliente(ultimoRegistro);
        }
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
            "Multa": cliente.multa,
            "Fecha Registro": new Date(cliente.createdAt).toLocaleDateString()
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
                            <th>Saldo Actual</th>
                            <th>Pago Mínimo</th>
                            <th>Moroso</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((cliente) => (
                                <tr key={cliente.id}>
                                    <td>{cliente.nombre}</td>
                                    <td>{cliente.cedula || 'N/A'}</td>
                                    <td>${cliente.saldoActual.toFixed(2)}</td>
                                    <td>${cliente.pagoMinimo.toFixed(2)}</td>
                                    <td className={cliente.esMoroso ? "text-danger" : "text-success"}>
                                        {cliente.esMoroso ? "SÍ" : "NO"}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
                                            <button
                                                onClick={() => handleNuevoPago(cliente)}
                                                style={{ padding: '5px', fontSize: '0.8rem', backgroundColor: '#007bff', color: 'white' }}
                                            >
                                                Nuevo Pago
                                            </button>
                                            <button
                                                onClick={() => generarPDFEstadoCuenta(cliente)}
                                                style={{ padding: '5px', fontSize: '0.8rem' }}
                                            >
                                                Estado Cuenta (PDF)
                                            </button>
                                            <button
                                                onClick={() => generarPDFHistorialCompleto(cliente)}
                                                style={{ padding: '5px', fontSize: '0.8rem', backgroundColor: '#6c757d', color: 'white' }}
                                            >
                                                Historial (PDF)
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center' }}>
                                    No hay clientes registrados
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '10px' }}>
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        style={{ width: 'auto', padding: '5px 10px' }}
                    >
                        Anterior
                    </button>
                    <span style={{ alignSelf: 'center' }}>
                        Página {currentPage} de {totalPages}
                    </span>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        style={{ width: 'auto', padding: '5px 10px' }}
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
};

export default ClientesList;
