import React, { useState, useEffect } from 'react';
import ClienteService from '../services/clienteServices.js';
import Validaciones from './Validaciones.js';

const ClientesForm = ({ onClienteGuardado, selectedClient, onCancel }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        cedula: '',
        telefono: '',
        saldoAnterior: '',
        montoCompras: '',
        pagoRealizado: ''
    });

    useEffect(() => {
        if (selectedClient) {
            setFormData({
                nombre: selectedClient.nombre,
                cedula: selectedClient.cedula,
                telefono: selectedClient.telefono,
                saldoAnterior: selectedClient.saldoActual,
                montoCompras: '',
                pagoRealizado: ''
            });
        } else {
            setFormData({
                nombre: '',
                cedula: '',
                telefono: '',
                saldoAnterior: '',
                montoCompras: '',
                pagoRealizado: ''
            });
        }
    }, [selectedClient]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!Validaciones.validarCedula(formData.cedula)) {
            alert('Cédula inválida');
            return;
        }
        if (!Validaciones.validarTelefono(formData.telefono)) {
            alert('Teléfono inválido (debe tener 10 dígitos)');
            return;
        }
        if (!Validaciones.validarNoNegativo(Number(formData.saldoAnterior)) ||
            !Validaciones.validarNoNegativo(Number(formData.montoCompras)) ||
            !Validaciones.validarNoNegativo(Number(formData.pagoRealizado))) {
            alert('Los valores monetarios no pueden ser negativos');
            return;
        }

        try {
            const data = {
                nombre: formData.nombre,
                cedula: formData.cedula,
                telefono: formData.telefono,
                saldoAnterior: Number(formData.saldoAnterior),
                montoCompras: Number(formData.montoCompras),
                pagoRealizado: Number(formData.pagoRealizado)
            };

            const response = await ClienteService.calcular(data);
            if (response.ok) {
                alert('Transacción guardada con éxito');
                setFormData({ nombre: '', cedula: '', telefono: '', saldoAnterior: '', montoCompras: '', pagoRealizado: '' });
                if (onClienteGuardado) onClienteGuardado();
            } else {
                alert('Error: ' + response.msg);
            }
        } catch (error) {
            alert('Error al procesar la solicitud');
        }
    };

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>{selectedClient ? `Nuevo Pago: ${selectedClient.nombre}` : 'Registro de Cliente'}</h3>
                {selectedClient && (
                    <button onClick={onCancel} style={{ backgroundColor: '#dc3545', width: 'auto', padding: '5px 10px' }}>
                        Cancelar / Nuevo Cliente
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre del Cliente</label>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        className="form-control"
                        disabled={!!selectedClient}
                        placeholder="Ingrese el nombre del cliente"

                    />
                </div>
                <div className="form-group">
                    <label>Cédula</label>
                    <input
                        type="text"
                        name="cedula"
                        value={formData.cedula}
                        onChange={handleChange}
                        required
                        className="form-control"
                        disabled={!!selectedClient}
                        placeholder="Ingrese la cédula del cliente"
                        maxLength={10}
                    />
                </div>
                <div className="form-group">
                    <label>Teléfono</label>
                    <input
                        type="text"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        required
                        className="form-control"
                        disabled={!!selectedClient}
                        placeholder="Ingrese el teléfono del cliente"
                        maxLength={10}
                    />
                </div>
                <div className="form-group">
                    <label>Saldo Anterior {selectedClient && '(Automático del último corte)'}</label>
                    <input
                        type="number"
                        name="saldoAnterior"
                        value={formData.saldoAnterior}
                        onChange={handleChange}
                        required
                        step="0.01"
                        disabled={!!selectedClient}
                    />
                </div>
                <div className="form-group">
                    <label>Monto de Compras (Nuevo)</label>
                    <input
                        type="number"
                        name="montoCompras"
                        value={formData.montoCompras}
                        onChange={handleChange}
                        required
                        step="0.01"
                    />
                </div>
                <div className="form-group">
                    <label>Pago Realizado (Nuevo)</label>
                    <input
                        type="number"
                        name="pagoRealizado"
                        value={formData.pagoRealizado}
                        onChange={handleChange}
                        required
                        step="0.01"
                    />
                </div>
                <button type="submit">Calcular y Guardar</button>
            </form>
        </div>
    );
};

export default ClientesForm;
