import express from "express";
import cors from "cors";
import sequelize from "./src/config/database.js";
import estudianteRoutes from "./src/routes/estudiante.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import docenteRoutes from "./src/routes/docente.routes.js";
import notaRoutes from "./src/routes/nota.routes.js";
import asignaturaRoutes from "./src/routes/asignatura.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import matriculaRoutes from "./src/routes/matricula.routes.js";
import { setupAssociations } from "./src/models/associations.js";

// Init associations
setupAssociations();

const app = express();

// Configurar CORS correctamente
app.use(cors({
  origin: ["http://localhost:3001", "http://localhost:3000", "http://127.0.0.1:3001"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/estudiantes", estudianteRoutes);
app.use("/api/docentes", docenteRoutes);
app.use("/api/notas", notaRoutes);
app.use("/api/asignaturas", asignaturaRoutes);
app.use("/api/matriculas", matriculaRoutes);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexion establecida con MySQL");

    await sequelize.sync({ alter: true });
    console.log("Modelos sincronizados (alter mode)");

    app.listen(3000, () => {
      console.log("Servidor ejecutandose en http://localhost:3000");
    });

  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
  }
})();
