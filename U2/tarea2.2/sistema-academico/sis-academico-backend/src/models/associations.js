import Docente from "./docente.model.js";
import Usuario from "./auth.model.js";
import { Asignatura } from "./asignatura.model.js";
import Estudiante from "./estudiante.model.js";
import Matricula from "./matricula.model.js";
import Nota from "./nota.model.js";

export const setupAssociations = () => {
    // Docente (Usuario) - Asignatura (1:N)
    // Usamos Usuario en lugar de Docente porque la tabla docentes está vacía actualmente
    Usuario.hasMany(Asignatura, { foreignKey: "usuarioId", as: "asignaturas" });
    Asignatura.belongsTo(Usuario, { foreignKey: "usuarioId", as: "docente" });

    // Matricula Relaciones (M:N Estudiante-Asignatura)
    // Ya definidos en matricula.model.js pero se pueden reforzar aquí si es necesario

    // Nota Relaciones
    // Ya definidos en nota.model.js
};
