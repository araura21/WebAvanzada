import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Arboles = sequelize.define(
  'Arboles',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    tipoArbol: { type: DataTypes.STRING(20), allowNull: false },
    precioUnitario: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    cantidad: { type: DataTypes.INTEGER, allowNull: false },
    rebaja: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
    iva: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
    totalPagar: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    descuentoValor: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  },
  {
    tableName: 'arboles', timestamps:false
  }
);

