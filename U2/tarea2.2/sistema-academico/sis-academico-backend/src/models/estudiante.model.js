// src/models/estudiante.model.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Estudiante = sequelize.define("Estudiante", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  cedula: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true,
  },

  nombres: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  apellidos: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  correo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  telefono: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  
  foto: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
//curso de matematicas
  curso: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  estado: {
    type: DataTypes.ENUM("activo", "inactivo"),
    defaultValue: "activo",
  },
}, {
  tableName: "estudiantes",
  timestamps: true,
});

export default Estudiante;
