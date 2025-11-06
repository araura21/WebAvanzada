const API_URL = 'http://localhost:3000/api';

// Obtener todas las asignaturas
export const getAsignaturas = async () => {
	try {
		const response = await fetch(`${API_URL}/asignaturas`);
		if (!response.ok) {
			throw new Error('Error al obtener asignaturas');
		}
		return await response.json();
	} catch (error) {
		console.error('Error en getAsignaturas:', error);
		throw error;
	}
};

// Obtener una asignatura por ID
export const getAsignaturaById = async (id) => {
	try {
		const response = await fetch(`${API_URL}/asignaturas/${id}`);
		if (!response.ok) {
			throw new Error('Asignatura no encontrada');
		}
		return await response.json();
	} catch (error) {
		console.error('Error en getAsignaturaById:', error);
		throw error;
	}
};

// Crear una nueva asignatura
export const createAsignatura = async (data) => {
	try {
		const response = await fetch(`${API_URL}/asignaturas`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		});
		if (!response.ok) {
			const err = await response.json();
			throw new Error(err.mensaje || 'Error al crear asignatura');
		}
		return await response.json();
	} catch (error) {
		console.error('Error en createAsignatura:', error);
		throw error;
	}
};

// Actualizar asignatura
export const updateAsignatura = async (id, data) => {
	try {
		const response = await fetch(`${API_URL}/asignaturas/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		});
		if (!response.ok) {
			const err = await response.json();
			throw new Error(err.mensaje || 'Error al actualizar asignatura');
		}
		return await response.json();
	} catch (error) {
		console.error('Error en updateAsignatura:', error);
		throw error;
	}
};

// Eliminar asignatura
export const deleteAsignatura = async (id) => {
	try {
		const response = await fetch(`${API_URL}/asignaturas/${id}`, {
			method: 'DELETE',
		});
		if (!response.ok) {
			const err = await response.json();
			throw new Error(err.mensaje || 'Error al eliminar asignatura');
		}
		return await response.json();
	} catch (error) {
		console.error('Error en deleteAsignatura:', error);
		throw error;
	}
};

const defaultExport = {
	getAll: getAsignaturas,
	getById: getAsignaturaById,
	create: createAsignatura,
	update: updateAsignatura,
	remove: deleteAsignatura,
};

export default defaultExport;