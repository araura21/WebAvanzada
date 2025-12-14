import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Estudiante from "./estudiante.model.js";
import { Asignatura } from "./asignatura.model.js";

const Matricula = sequelize.define("Matricula", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    periodo: {
        type: DataTypes.STRING(32), // Ej: "2024-2025"
        allowNull: true,
    },

    estado: {
        type: DataTypes.ENUM("cursando", "aprobado", "reprobado"),
        defaultValue: "cursando",
    }

}, {
    tableName: "matriculas",
    timestamps: true,
});

// Relaciones
// Un estudiante tiene muchas matriculas
Estudiante.belongsToMany(Asignatura, { through: Matricula, foreignKey: "estudianteId" });
Asignatura.belongsToMany(Estudiante, { through: Matricula, foreignKey: "asignaturaId" });

Matricula.belongsTo(Estudiante, { foreignKey: "estudianteId" });
Matricula.belongsTo(Asignatura, { foreignKey: "asignaturaId" });
Estudiante.hasMany(Matricula, { foreignKey: "estudianteId" });
Asignatura.hasMany(Matricula, { foreignKey: "asignaturaId" });

export default Matricula;
