import axios from "axios";

const API_URL = "http://localhost:3000/api/jugadores";

export const getJugadoresByEquipo = (equipoId) =>
  axios.get(`${API_URL}/equipo/${equipoId}`);

export const createJugador = (jugador) =>
  axios.post(API_URL, jugador);

export const updateJugador = (id, jugador) =>
  axios.put(`${API_URL}/${id}`, jugador);

export const deleteJugador = (id) =>
  axios.delete(`${API_URL}/${id}`);
