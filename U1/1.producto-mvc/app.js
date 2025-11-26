import express from 'express';
import { listarProductos, mostrarProductoIndividual, agregarProducto, eliminarProducto, actualizarProducto, mostrarFormularioEditar } from './controllers/productoController.js';

//inicializar express
const app = express();

//puerto del servidor
const PORT = 3000;

//Middleware para procesar formularios
app.use(express.urlencoded({ extended: true }));

//rutas principales del aplicativo
app.get("/", (req, res) => res.redirect("/productos")); //redirige a productos
app.get("/productos", listarProductos);
app.get("/productos/:id", mostrarProductoIndividual);

//rutas secundarias
//formulario para agregar producto nuevo
app.get("/nuevo", (req, res) => {
    res.send(`
        <h1>Agregar nuevo producto</h1>
        <form action="/productos" method="post">
        <label>Nombre: <input type="text" name="nombre"></input></label>
        <label>Precio: <input type="number" name="precio"></input></label>
        <label>Categoria: <input type="text" name="categoria"></input></label>

        <button type="submit">Guardar</button>

        </form>

        <a href="/productos"> <-Regresar </a>
        `);
});

//ruta para guardar datos del formulario
app.post("/productos", agregarProducto);

//ruta para eliminar producto
app.post("/productos/:id/eliminar", eliminarProducto);

app.get('/productos/:id/editar', mostrarFormularioEditar);

//ruta para editar producto
app.post("/productos/:id/editar", actualizarProducto);


//iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
});

