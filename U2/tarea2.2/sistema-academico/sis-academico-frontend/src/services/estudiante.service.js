import API_URL from "./api.service";

export const crearEstudiante = async (formData) => {
  const response = await fetch(`${API_URL}/estudiantes`, {
    method: "POST",
    body: formData,
  });
  return response.json();
};

export const obtenerEstudiantes = async () => {
  const response = await fetch(`${API_URL}/estudiantes`);
  return response.json();
};

export const buscarEstudiante = async (termino) => {
  const response = await fetch(`${API_URL}/estudiantes/buscar/${termino}`);
  return response.json();
};

export const actualizarEstudiante = async (id, data) => {
  const response = await fetch(`${API_URL}/estudiantes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const eliminarEstudiante = async (id) => {
  const response = await fetch(`${API_URL}/estudiantes/${id}`, {
    method: "DELETE",
  });
  return response.json();
};
