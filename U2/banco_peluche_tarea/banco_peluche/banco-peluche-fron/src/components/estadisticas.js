import React, { useEffect, useState } from 'react';
import ClienteService from '../services/clienteServices';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Estadisticas = () => {
    const [stats, setStats] = useState({
        totalClientes: 0,
        morosos: 0,
        gananciaIntereses: 0
    });

    const cargarEstadisticas = async () => {
        try {
            const response = await ClienteService.obtenerEstadisticas();
            if (response.ok) {
                setStats(response.data);
            }
        } catch (error) {
            console.error("Error al cargar estadísticas:", error);
        }
    };

    useEffect(() => {
        cargarEstadisticas();
    }, []);

    const descargarReportePDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.setTextColor(40);
        doc.text("Reporte General de Estadísticas", 14, 22);

        doc.setFontSize(12);
        doc.text(`Banco Peluche - Fecha: ${new Date().toLocaleDateString()}`, 14, 30);

        const data = [
            ["Total de Clientes", stats.totalClientes],
            ["Clientes Morosos", stats.morosos],
            ["Clientes No Morosos", stats.totalClientes - stats.morosos],
            ["Ganancia por Intereses (Morosos)", `$${Number(stats.gananciaIntereses).toFixed(2)}`]
        ];

        autoTable(doc, {
            startY: 40,
            head: [["Métrica", "Valor"]],
            body: data,
        });

        doc.save("reporte_estadisticas.pdf");
    };

    const noMorosos = stats.totalClientes - stats.morosos;

    const chartData = {
        labels: ['Clientes Morosos', 'Clientes No Morosos'],
        datasets: [
            {
                data: [stats.morosos, noMorosos],
                backgroundColor: ['#2677a5ff', '#5a8fb4ff'],
                borderColor: ['#ffffffff', '#ffffffff'],
                borderWidth: 2,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: { size: 14 },
                    padding: 15,
                }
            }
        }
    };

    return (
        <div className="card" style={{ marginTop: '20px', backgroundColor: '#eff6ff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>Estadísticas Generales</h3>
                <button onClick={descargarReportePDF} style={{ width: 'auto', backgroundColor: 'var(--primary-color)' }}>
                    Descargar Reporte (PDF)
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr', gap: '20px', alignItems: 'start' }}>
                {/* Lado Izquierdo - Métricas en horizontal */}
                <div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '20px' }}>
                        {/* Total Clientes */}
                        <div style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                            <h4 style={{ marginTop: 0, marginBottom: '10px', fontSize: '0.9rem', color: 'var(--text-color)' }}>Total Clientes</h4>
                            <p style={{ fontSize: '2.2rem', fontWeight: 'bold', margin: '10px 0', color: 'var(--primary-color)' }}>{stats.totalClientes}</p>
                        </div>

                        {/* Clientes Morosos */}
                        <div style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                            <h4 style={{ marginTop: 0, marginBottom: '10px', fontSize: '0.9rem', color: 'var(--text-color)' }}>Clientes Morosos</h4>
                            <p style={{ fontSize: '2.2rem', fontWeight: 'bold', margin: '10px 0', color: 'var(--danger-color)' }}>{stats.morosos}</p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-color)', margin: '5px 0 0 0' }}>
                                {stats.totalClientes > 0 ? ((stats.morosos / stats.totalClientes) * 100).toFixed(1) : 0}%
                            </p>
                        </div>

                        {/* Clientes NO Morosos */}
                        <div style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '8px', textAlign: 'center'}}>
                            <h4 style={{ marginTop: 0, marginBottom: '10px', fontSize: '0.9rem', color: 'var(--text-color)' }}>Clientes NO Morosos</h4>
                            <p style={{ fontSize: '2.2rem', fontWeight: 'bold', margin: '10px 0', color: 'var(--success-color)' }}>{noMorosos}</p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-color)', margin: '5px 0 0 0' }}>
                                {stats.totalClientes > 0 ? ((noMorosos / stats.totalClientes) * 100).toFixed(1) : 0}%
                            </p>
                        </div>

                    </div>
                    {/* Lado Derecho - Morosos y Ganancias */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    
                        <div style={{ background: 'var(--card-bg)', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                            <h4 style={{ marginTop: 0 }}>Ganancia Intereses</h4>
                            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0', color: 'var(--success-color)' }}>${Number(stats.gananciaIntereses).toFixed(2)}</p>
                        </div>
                    </div>

                </div>

                {/* Lado Derecho - Gráfico de Pastel */}
                <div style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '8px' }}>
                    <h4 style={{ marginTop: 0, marginBottom: '20px', textAlign: 'center' }}>Distribución de Clientes</h4>
                    <div style={{ height: '280px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Pie data={chartData} options={chartOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Estadisticas;
