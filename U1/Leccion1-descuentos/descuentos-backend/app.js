import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/database.js";

import descuentoRoutes from "./routes/descuentoRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (_req, res) => 
  res.send("Servidor de descuentos funcionando correctamente")
);

// Registrar rutas
app.use("/api/descuentos", descuentoRoutes);

const iniciarServidor = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // Crea tablas si no existen

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => 
      console.log(`Servidor ejecutándose en el puerto ${PORT}`)
    );

  } catch (error) {
    console.error("Error al conectar con la base de datos:", error.message);
  }
};

iniciarServidor();
