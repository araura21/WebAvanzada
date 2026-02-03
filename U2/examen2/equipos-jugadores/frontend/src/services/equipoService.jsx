import axios from "axios";

const API_URL = "http://localhost:3000/api/equipos";

export const getEquipos = () => axios.get(API_URL);
export const createEquipo = (equipo) => axios.post(API_URL, equipo);
export const updateEquipo = (id, equipo) =>
  axios.put(`${API_URL}/${id}`, equipo);
export const deleteEquipo = (id) =>
  axios.delete(`${API_URL}/${id}`);
