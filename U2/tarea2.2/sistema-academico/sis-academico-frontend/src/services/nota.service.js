import API_URL from "./api.service";

export const getNotas = async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_URL}/notas?${query}`);
    if (!response.ok) throw new Error("Error al obtener notas");
    return await response.json();
};

export const getNotaById = async (id) => {
    const response = await fetch(`${API_URL}/notas/${id}`);
    if (!response.ok) throw new Error("Error al obtener la nota");
    return await response.json();
};

export const createNota = async (nota) => {
    const response = await fetch(`${API_URL}/notas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nota),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al crear nota");
    }
    return await response.json();
};

export const updateNota = async (id, nota) => {
    const response = await fetch(`${API_URL}/notas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nota),
    });
    if (!response.ok) throw new Error("Error al actualizar nota");
    return await response.json();
};

export const deleteNota = async (id) => {
    const response = await fetch(`${API_URL}/notas/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Error al eliminar nota");
    return await response.json();
};
