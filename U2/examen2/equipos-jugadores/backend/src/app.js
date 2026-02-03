import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/database.js";

import equipoRoutes from "./routes/equipo.routes.js";
import jugadorRoutes from "./routes/jugador.routes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/equipos", equipoRoutes);
app.use("/api/jugadores", jugadorRoutes);

// Sincronizar base de datos
const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log("Base de datos sincronizada");
  } catch (error) {
    console.error("Error al sincronizar la base de datos:", error);
  }
};

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await syncDatabase();
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
