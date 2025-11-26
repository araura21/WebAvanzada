import axios from 'axios';

const API_URL = 'http://localhost:3000/api/clientes';

const ClienteService = {
    calcular: async (data) => {
        try {
            const response = await axios.post(`${API_URL}/calcular`, data);
            return response.data;
        } catch (error) {
            console.error("Error en calcular:", error);
            throw error;
        }
    },

    obtenerTodos: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error("Error en obtenerTodos:", error);
            throw error;
        }
    },

    obtenerEstadisticas: async () => {
        try {
            const response = await axios.get(`${API_URL}/estadisticas`);
            return response.data;
        } catch (error) {
            console.error("Error en obtenerEstadisticas:", error);
            throw error;
        }
    },

    obtenerPorId: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error en obtenerPorId:", error);
            throw error;
        }
    }
};

export default ClienteService;

