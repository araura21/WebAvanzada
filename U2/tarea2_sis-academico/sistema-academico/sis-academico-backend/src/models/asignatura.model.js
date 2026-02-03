import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

export const Asignatura = sequelize.define("Asignatura", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  estado: {
    type: DataTypes.ENUM("activo", "inactivo"),
    defaultValue: "activo",
  }
}, {
  tableName: "asignaturas",
  timestamps: true,
});

export default Asignatura;