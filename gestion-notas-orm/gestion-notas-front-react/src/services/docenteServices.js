const API_URL = 'http://localhost:3000/api';

// Obtener todos los docentes
export const getDocentes = async () => {
	try {
		const response = await fetch(`${API_URL}/docentes`);
		if (!response.ok) throw new Error('Error al obtener docentes');
		return await response.json();
	} catch (error) {
		console.error('Error en getDocentes:', error);
		throw error;
	}
};

// Obtener docente por id
export const getDocenteById = async (id) => {
	try {
		const response = await fetch(`${API_URL}/docentes/${id}`);
		if (!response.ok) throw new Error('Docente no encontrado');
		return await response.json();
	} catch (error) {
		console.error('Error en getDocenteById:', error);
		throw error;
	}
};

// Crear docente
export const createDocente = async (data) => {
	try {
		const response = await fetch(`${API_URL}/docentes`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		});
		if (!response.ok) {
			const err = await response.json();
			throw new Error(err.mensaje || 'Error al crear docente');
		}
		return await response.json();
	} catch (error) {
		console.error('Error en createDocente:', error);
		throw error;
	}
};

// Actualizar docente
export const updateDocente = async (id, data) => {
	try {
		const response = await fetch(`${API_URL}/docentes/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		});
		if (!response.ok) {
			const err = await response.json();
			throw new Error(err.mensaje || 'Error al actualizar docente');
		}
		return await response.json();
	} catch (error) {
		console.error('Error en updateDocente:', error);
		throw error;
	}
};

// Eliminar docente
export const deleteDocente = async (id) => {
	try {
		const response = await fetch(`${API_URL}/docentes/${id}`, { method: 'DELETE' });
		if (!response.ok) {
			const err = await response.json();
			throw new Error(err.mensaje || 'Error al eliminar docente');
		}
		return await response.json();
	} catch (error) {
		console.error('Error en deleteDocente:', error);
		throw error;
	}
};

const defaultExport = {
	getAll: getDocentes,
	getById: getDocenteById,
	create: createDocente,
	update: updateDocente,
	remove: deleteDocente,
};

export default defaultExport;