const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para permitir JSON y CORS
app.use(express.json());
app.use(cors());

let pedidos = [];

// 200 OK
app.get('/pedidos', (req, res) => {
	res.status(200).json({
		status: 200,
		mensaje: 'Lista de pedidos obtenida correctamente',
		pedidos
	});
});

// 201 Creado
app.post('/pedidos', (req, res) => {
	const pedido = req.body;
	pedidos.push(pedido);
	res.status(201).json({
		status: 201,
		mensaje: 'Pedido creado exitosamente',
		pedido
	});
});

// 204 No hay contenido
app.delete('/pedidos', (req, res) => {
	pedidos = [];
	// 204 No Content: no debe enviar body
	res.status(204).send();
});


// 301 Movido permanentemente (redirección real)
app.get('/antigua', (req, res) => {
	res.redirect(301, '/nueva');
});

// Ruta nueva para redirección
app.get('/nueva', (req, res) => {
	res.status(200).json({
		status: 200,
		mensaje: 'Recurso movido correctamente a /nueva'
	});
});

// 302 Encontrado (redirección temporal real)
app.get('/temporal', (req, res) => {
	res.redirect(302, '/temporal-nuevo');
});

// Ruta temporal nueva
app.get('/temporal-nuevo', (req, res) => {
	res.status(200).json({
		status: 200,
		mensaje: 'Recurso temporalmente disponible aquí'
	});
});

// 304 No modificado (simulación con If-Modified-Since)
app.get('/sin-cambios', (req, res) => {
	// Simulamos una fecha de última modificación
	const ultimaModificacion = new Date('2024-01-01T00:00:00Z');
	const ifModifiedSince = req.headers['if-modified-since'];
	if (ifModifiedSince && new Date(ifModifiedSince) >= ultimaModificacion) {
		// No modificado
		return res.status(304).send();
	}
	res.set('Last-Modified', ultimaModificacion.toUTCString());
	res.status(200).json({
		status: 200,
		mensaje: 'El recurso ha sido modificado',
		ultimaModificacion
	});
});


// 400 Mala petición (validación de campos obligatorios)
app.post('/pedidos/validar', (req, res) => {
	const { producto, cantidad } = req.body;
	if (!producto || typeof producto !== 'string' || !cantidad || typeof cantidad !== 'number') {
		return res.status(400).json({
			status: 400,
			mensaje: 'Datos inválidos: se requiere producto (string) y cantidad (number)'
		});
	}
	res.status(200).json({
		status: 200,
		mensaje: 'Pedido válido'
	});
});

// 401 Sin autorización (requiere header Authorization)
app.get('/privado', (req, res) => {
	const auth = req.headers['authorization'];
	if (!auth || auth !== 'Bearer token123') {
		return res.status(401).json({
			status: 401,
			mensaje: 'No autorizado para acceder a este recurso'
		});
	}
	res.status(200).json({
		status: 200,
		mensaje: 'Acceso autorizado'
	});
});

//  para 404 Not Found 
app.use((req, res, next) => {
	res.status(404).json({
		status: 404,
		mensaje: 'El recurso solicitado no existe'
	});
});



// 500 Error interno del servidor (simulación de error real)
app.get('/error', (req, res, next) => {
	// Simulamos un error lanzando una excepción
	next(new Error('Error interno del servidor de prueba'));
});

// 502 Bad Gateway (simulación: error al conectar con un servicio externo)
app.get('/puerta-enlace', async (req, res) => {
	// Simulamos un fallo de conexión a un servicio externo
	const servicioDisponible = false;
	if (!servicioDisponible) {
		return res.status(502).json({
			status: 502,
			mensaje: 'Puerta de enlace incorrecta: no se pudo conectar con el servicio externo'
		});
	}
	res.status(200).json({
		status: 200,
		mensaje: 'Servicio externo disponible'
	});
});

// 503 Servicio no disponible 
app.get('/no-disponible', (req, res) => {
	const enMantenimiento = true;
	if (enMantenimiento) {
		return res.status(503).json({
			status: 503,
			mensaje: 'Servicio no disponible temporalmente por mantenimiento'
		});
	}
	res.status(200).json({
		status: 200,
		mensaje: 'Servicio disponible'
	});
});

// Middleware de manejo de errores (500)
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({
		status: 500,
		mensaje: 'Error interno del servidor',
		error: err.message
	});
});

app.listen(PORT, () => {
	console.log(`Servidor Soft&Hard API escuchando en http://localhost:${PORT}`);
});
