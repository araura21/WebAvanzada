import express from "express";
import sequelize from "./config/database.js";
import estudianteRoutes from "./routes/estudiante.routes.js";
const app = express();
app.use(express.json());

app.use("/api/estudiantes", estudianteRoutes);

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
