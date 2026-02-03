import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Estudiante from "./estudiante.model.js";
import Docente from "./docente.model.js";
import { Asignatura } from "./asignatura.model.js";

import { calcularNotaParcial } from "../utils/calculoNotas.js";

const Nota = sequelize.define("Nota", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  
  // Identifica a qué parcial pertenece esta nota
  parcial: {
    type: DataTypes.ENUM("P1", "P2", "P3"),
    allowNull: false,
    comment: "P1: Parcial 1, P2: Parcial 2, P3: Parcial 3"
  },

  // Los 4 componentes requeridos (sobre 20 puntos cada uno)
  nota_tarea: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0, max: 20 }
  },
  
  nota_informe: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0, max: 20 }
  },
  
  nota_leccion: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0, max: 20 }
  },
  
  nota_examen: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0, max: 20 }
  },

  // Total calculado del parcial (sobre 20)
  // Tarea(20%) + Informe(20%) + Lección(20%) + Examen(40%)
  total_parcial: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true, // Se calculará automáticamente
  },

  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  fecha_evaluacion: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  },

  estado: {
    type: DataTypes.ENUM("activo", "inactivo"),
    defaultValue: "activo",
  }

}, {
  tableName: "notas",
  timestamps: true,
  hooks: {
    // Hook para calcular el total automáticamente antes de guardar
    beforeSave: (nota) => {
      nota.total_parcial = calcularNotaParcial(
        nota.nota_tarea,
        nota.nota_informe,
        nota.nota_leccion,
        nota.nota_examen
      );
    }
  }
});

// Relaciones
Nota.belongsTo(Estudiante, { foreignKey: "estudianteId", onDelete: "CASCADE" });
Estudiante.hasMany(Nota, { foreignKey: "estudianteId" });

Nota.belongsTo(Asignatura, { foreignKey: "asignaturaId", onDelete: "CASCADE" });
Asignatura.hasMany(Nota, { foreignKey: "asignaturaId" });

Nota.belongsTo(Docente, { foreignKey: "docenteId", onDelete: "SET NULL" });
Docente.hasMany(Nota, { foreignKey: "docenteId" });

export default Nota;
