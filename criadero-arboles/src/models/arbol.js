import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Arbol = sequelize.define(
    'Arbol',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        tipoArbol: { type: DataTypes.STRING(50), allowNull: false },
        precioUnitario: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        cantidad: { type: DataTypes.INTEGER, allowNull: false },
        rebaja: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
        iva: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
        totalPagar: { type: DataTypes.DECIMAL(12, 2), allowNull: false }
    },
    {
        tableName: 'arboles',
        timestamps: false
    }
);

