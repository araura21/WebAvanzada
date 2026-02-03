import { DataTypes } from 'sequelize';
import sequelize from '../config/databaseConection.js';

const Cliente = sequelize.define('Cliente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cedula: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false
  },
  saldoAnterior: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  montoCompras: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  pagoRealizado: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  esMoroso: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  saldoActual: {
    type: DataTypes.FLOAT
  },
  pagoMinimo: {
    type: DataTypes.FLOAT
  },
  pagoNoIntereses: {
    type: DataTypes.FLOAT
  },
  interes: {
    type: DataTypes.FLOAT
  },
  multa: {
    type: DataTypes.FLOAT
  }
}, {
  tableName: 'clientes',
  timestamps: true
});

export default Cliente;
