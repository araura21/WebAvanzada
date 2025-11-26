import React, { useState } from 'react';
import ClienteService from '../services/clienteServices.js';
import Validaciones from './Validaciones.js';

const ClientesForm = ({ onClienteGuardado }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        cedula: '',
        telefono: '',
        saldoAnterior: '',
        montoCompras: '',
        pagoRealizado: ''
    });

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
                alert('Cliente calculado y guardado con éxito');
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
            <h3>Registro de Cliente</h3>
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
                    />
                </div>
                <div className="form-group">
                    <label>Saldo Anterior</label>
                    <input
                        type="number"
                        name="saldoAnterior"
                        value={formData.saldoAnterior}
                        onChange={handleChange}
                        required
                        step="0.01"
                    />
                </div>
                <div className="form-group">
                    <label>Monto de Compras</label>
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
                    <label>Pago Realizado</label>
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
