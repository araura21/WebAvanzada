import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import arbolRoute from './routes/arbolRoute.js';
import { dbConnect, sequelize } from './config/database.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/arboles', arbolRoute);

//Ruta base para evitar Cannot Get
app.get('/', (req, res) =>{
	res.send('API criadero de arboles funcionando');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Conectar a la base de datos y arrancar servidor
dbConnect()
	sequelize.sync({alter: true}).then(() => {
		console.log('Base de datos sincronizada');
	}).catch((err) => {
		console.error('Error al sincronizar la base de datos:', err.message);
	});




