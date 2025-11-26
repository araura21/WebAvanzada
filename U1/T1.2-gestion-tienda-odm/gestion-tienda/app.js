import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./src/config/mongo.js";
import productoRoutes from "./src/routes/productoRoutes.js";
import pedidoRoutes from "./src/routes/pedidoRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/productos", productoRoutes);
app.use("/api/pedidos", pedidoRoutes);

await connectDB();

const PORT = process.env.PORT || 3000;
app.listen(
    process.env.PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`)
);