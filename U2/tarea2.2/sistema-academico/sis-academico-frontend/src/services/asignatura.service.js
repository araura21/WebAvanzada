import API_URL from "./api.service";

export const getAsignaturas = async () => {
    const response = await fetch(`${API_URL}/asignaturas`);
    if (!response.ok) throw new Error("Error al obtener asignaturas");
    return await response.json();
};
