import Docente from "./docente.model.js";
import Usuario from "./auth.model.js";
import { Asignatura } from "./asignatura.model.js";
import Estudiante from "./estudiante.model.js";
import Matricula from "./matricula.model.js";
import Nota from "./nota.model.js";

export const setupAssociations = () => {
    // Docente (Usuario) - Asignatura (1:N)
    Usuario.hasMany(Asignatura, { foreignKey: "usuarioId", as: "asignaturas" });
    Asignatura.belongsTo(Usuario, { foreignKey: "usuarioId", as: "docente" });

    // Usuario - Estudiante (1:1)
    Usuario.hasOne(Estudiante, { foreignKey: "usuarioId", as: "estudianteProfile" });
    Estudiante.belongsTo(Usuario, { foreignKey: "usuarioId", as: "usuario" });

    // Usuario - Docente (1:1)
    Usuario.hasOne(Docente, { foreignKey: "usuarioId", as: "docenteProfile" });
    Docente.belongsTo(Usuario, { foreignKey: "usuarioId", as: "usuario" });

    // Matricula Relaciones (M:N Estudiante-Asignatura)
    // Ya definidos en matricula.model.js pero se pueden reforzar aquí si es necesario

    // Nota Relaciones
    // Ya definidos en nota.model.js
};
