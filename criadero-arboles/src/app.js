import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import arbolRoute from './routes/arbolRoute.js';
import { dbConnect } from './config/database.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/arboles', arbolRoute);

const PORT = process.env.PORT || 3000;

// Conectar a la base de datos y arrancar servidor
dbConnect()
	.then(() => {
		app.listen(PORT, () => console.log(`Servidor iniciado en http://localhost:${PORT}`));
	})
	.catch((err) => {
		console.error('No se pudo iniciar el servidor:', err.message);
	});

export default app;


