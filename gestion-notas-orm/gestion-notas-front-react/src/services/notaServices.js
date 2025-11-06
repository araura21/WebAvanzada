const API_URL = 'http://localhost:3000/api';

// obtener todas las notas
export const getNotas = async () => {
	try {
		const response = await fetch(`${API_URL}/notas`);
		if (!response.ok) {
			throw new Error('Error al obtener notas');
		}
		return await response.json();
	} catch (error) {
		console.error('Error en getNotas:', error);
		throw error;
	}
};

// obtener una nota por id
export const getNotaById = async (id) => {
	try {
		const response = await fetch(`${API_URL}/notas/${id}`);
		if (!response.ok) {
			throw new Error('Nota no encontrada');
		}
		return await response.json();
	} catch (error) {
		console.error('Error en getNotaById:', error);
		throw error;
	}
};

// crear una nueva nota
export const createNota = async (data) => {
	try {
		const response = await fetch(`${API_URL}/notas`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		});
		if (!response.ok) {
			const err = await response.json();
			throw new Error(err.mensaje || err.error || 'Error al crear nota');
		}
		return await response.json();
	} catch (error) {
		console.error('Error en createNota:', error);
		throw error;
	}
};

// actualizar nota
export const updateNota = async (id, data) => {
	try {
		const response = await fetch(`${API_URL}/notas/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		});
		if (!response.ok) {
			const err = await response.json();
			throw new Error(err.mensaje || err.error || 'Error al actualizar nota');
		}
		return await response.json();
	} catch (error) {
		console.error('Error en updateNota:', error);
		throw error;
	}
};

// eliminar nota
export const deleteNota = async (id) => {
	try {
		const response = await fetch(`${API_URL}/notas/${id}`, {
			method: 'DELETE',
		});
		if (!response.ok) {
			const err = await response.json();
			throw new Error(err.mensaje || err.error || 'Error al eliminar nota');
		}
		return await response.json();
	} catch (error) {
		console.error('Error en deleteNota:', error);
		throw error;
	}
};

const defaultExport = {
	getAll: getNotas,
	getById: getNotaById,
	create: createNota,
	update: updateNota,
	remove: deleteNota,
};

export default defaultExport;
