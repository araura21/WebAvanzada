import express from "express";
import cors from "cors";
import sequelize from "./src/config/database.js";
import estudianteRoutes from "./src/routes/estudiante.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import { crearUsuarioAdmin, crearUsuariosPrueba } from "./src/seeders/usuario.seeder.js";

const app = express();

// Configurar CORS correctamente
app.use(cors({
  origin: ["http://localhost:3001", "http://localhost:3000", "http://127.0.0.1:3001"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/auth", authRoutes);

app.use("/api/estudiantes", estudianteRoutes);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexion establecida con MySQL");

    await sequelize.sync({ alter: true });
    console.log("Modelos sincronizados (alter mode)");

    // Crear usuarios de prueba
    await crearUsuarioAdmin();
    await crearUsuariosPrueba();

    app.listen(3000, () => {
      console.log("Servidor ejecutandose en http://localhost:3000");
    });

  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
  }
})();
