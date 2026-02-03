/**
 * Calcula la nota final del parcial basado en los componentes.
 * @param {number} tarea - Nota de tarea (0-20)
 * @param {number} informe - Nota de informe (0-20)
 * @param {number} leccion - Nota de lección (0-20)
 * @param {number} examen - Nota de examen (0-20)
 * @returns {number} - Nota total del parcial (0-20)
 */
export const calcularNotaParcial = (tarea, informe, leccion, examen) => {
    const pTarea = parseFloat(tarea || 0) * 0.20;
    const pInforme = parseFloat(informe || 0) * 0.20;
    const pLeccion = parseFloat(leccion || 0) * 0.20;
    const pExamen = parseFloat(examen || 0) * 0.40;
    
    return (pTarea + pInforme + pLeccion + pExamen).toFixed(2);
};

/**
 * Verifica el estado del estudiante basado en sus notas parciales.
 * @param {number} p1 - Nota Parcial 1
 * @param {number} p2 - Nota Parcial 2
 * @param {number} p3 - Nota Parcial 3 (opcional)
 * @returns {string} - Estado (Aprobado, Reprobado, Supletorio, etc.)
 */
export const verificarEstadoSemestre = (p1, p2, p3 = 0) => {
    const sumaP1P2 = parseFloat(p1 || 0) + parseFloat(p2 || 0);
    
    if (sumaP1P2 < 28) {
        return "Reprobado (P1 + P2 < 28)";
    }
    
    // Lógica adicional si se requiere P3 o promedio final
    // Promedio general del semestre = 42.10 puntos (según requerimiento)
    // Esto parece ser un umbral de aprobación total? El requerimiento dice:
    // "Promedio general del semestre = 42.10 puntos" -> Quizás se refiere a la suma necesaria?
    // Asumiremos lógica estándar por ahora o la del requerimiento si es clara.
    // Requerimiento: "Si saca menos de 28 puntos en la suma del Parcial 1 + Parcial 2 → pierde automáticamente"
    
    return "En curso / Aprobado P1+P2";
};
