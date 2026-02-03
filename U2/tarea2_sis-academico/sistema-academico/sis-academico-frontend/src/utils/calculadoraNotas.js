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
