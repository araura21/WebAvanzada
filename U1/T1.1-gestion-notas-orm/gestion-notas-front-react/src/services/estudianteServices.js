const API_URL = 'http://localhost:3000/api';

// obtener todos los estudiantes
export const getEstudiantes = async () => {
	try {
		const response = await fetch(`${API_URL}/estudiantes`);
		if (!response.ok) {
			throw new Error('Error al obtener estudiantes');
		}
		return await response.json();
	} catch (error) {
		console.error('Error en getEstudiantes:', error);
		throw error;
	}
};

// obtener un estudiante por id
export const getEstudianteById = async (id) => {
	try {
		const response = await fetch(`${API_URL}/estudiantes/${id}`);
		if (!response.ok) {
			throw new Error('Estudiante no encontrado');
		}
		return await response.json();
	} catch (error) {
		console.error('Error en getEstudianteById:', error);
		throw error;
	}
};

// crear un nuevo estudiante
export const createEstudiante = async (data) => {
	try {
		const response = await fetch(`${API_URL}/estudiantes`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		});
		if (!response.ok) {
			const err = await response.json();
			throw new Error(err.mensaje || 'Error al crear estudiante');
		}
		return await response.json();
	} catch (error) {
		console.error('Error en createEstudiante:', error);
		throw error;
	}
};

// actualizar estudiante
export const updateEstudiante = async (id, data) => {
	try {
		const response = await fetch(`${API_URL}/estudiantes/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		});
		if (!response.ok) {
			const err = await response.json();
			throw new Error(err.mensaje || 'Error al actualizar estudiante');
		}
		return await response.json();
	} catch (error) {
		console.error('Error en updateEstudiante:', error);
		throw error;
	}
};

// eliminar estudiante
export const deleteEstudiante = async (id) => {
	try {
		const response = await fetch(`${API_URL}/estudiantes/${id}`, {
			method: 'DELETE',
		});
		if (!response.ok) {
			const err = await response.json();
			throw new Error(err.mensaje || 'Error al eliminar estudiante');
		}
		return await response.json();
	} catch (error) {
		console.error('Error en deleteEstudiante:', error);
		throw error;
	}
};

const defaultExport = {
	getAll: getEstudiantes,
	getById: getEstudianteById,
	create: createEstudiante,
	update: updateEstudiante,
	remove: deleteEstudiante,
};

export default defaultExport;
