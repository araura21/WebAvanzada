import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import {Asignatura} from "./asignatura.model.js";

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

  especialidad:{
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

}, {
  tableName: "docentes",
  timestamps: true,
});

//Relaciones
Docente.hasMany(Asignatura, {foreignKey: "docenteId", as: "asignaturas"});
Asignatura.belongsTo(Docente, {foreignKey: "docenteId", as: "docente"});

export default Docente;
