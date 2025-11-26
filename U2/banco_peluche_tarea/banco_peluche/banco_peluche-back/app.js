import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/databaseConection.js";
import clienteRoutes from "./routes/cliente.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Rutas base
app.use('/api/clientes', clienteRoutes);

const iniciarServidor = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // Crea tablas si no existen
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor Banco Bandido ejecutándose en el puerto ${PORT}`));
  } catch (error) {
    console.error(" Error al conectar con la base de datos:", error.message);
  }
};
iniciarServidor();