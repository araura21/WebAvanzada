import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import { Asignatura } from "./asignatura.model.js";

const Docente = sequelize.define("Docente", {
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
    type: DataTypes.STRING(64),
    allowNull: false,
  },

  apellidos: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },

  telefono: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  correo: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true,
  },

  especialidad: {
    type: DataTypes.STRING(32),
    allowNull: false,
  },

  foto: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },

  estado: {
    type: DataTypes.ENUM("activo", "inactivo"),
    defaultValue: "activo",
  },

  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "usuarios",
      key: "id",
    },
  },

}, {
  tableName: "docentes",
  timestamps: true,
});

//Relaciones
// Relaciones definidas en un archivo de carga o al final para evitar ciclos si fuera bidireccional
// En este caso Asignatura no dependía de Docente, así que está bien.
// Pero para mejor orden, dejaremos que Asignatura también tenga el foreign key


export default Docente;
