import ProductoModel from "../models/productoModel.js";
import { vistaProductos, vistaProductoIndividual, vistaEditarProducto} from "../views/productoView.js";

//controlador: mostrar lista de productos
export const listarProductos = (req, res) =>{
    //obtener los datos del modelo
    const productos = ProductoModel.obtenerTodos();
    //genera vista
    res.type('html').send(vistaProductos(productos));
}

//controlador: mostrar producto especifico
export const mostrarProductoIndividual = (req, res) =>{
const {id} = req.params; //obtiene el id desde la url
const producto = ProductoModel.obtenerPorId(Number(id)); //buscar el producto
//si no encuentra el producto, hacer una validacion
    if(!producto){
        res.status(404).send("Producto no encontrado");
        return;
    }
    res.type('html').send(vistaProductoIndividual(producto));
};

//controlador: agregar producto
export const agregarProducto = (req, res) =>{
    //datos del formulario
    const {nombre, precio, categoria} = req.body;
    //validacion basica de datos (no vacio, con mensajes, status400,)
    if(!nombre || !precio|| !categoria){
        return res.status(400).send("Faltan datos");
    }

    //guardar el producto
    ProductoModel.agregarProducto(nombre, parseFloat(precio), categoria);

    //volver al listado principal
    res.redirect('/productos');
}

//controlador: eliminar producto
export const eliminarProducto = (req, res) =>{
    const {id} = req.params; //para obtener el id de la url
    const eliminado = ProductoModel.eliminarPorId(Number(id)); //llamar al modelo para eliminar 
    if(!eliminado){
        return res.status(404).send("<h1>Producto no encontrado</h1>")
    }

    res.redirect("/productos");
}

//formulario de edicion
 //agregar producto
export const mostrarFormularioEditar = (req, res) => {
  const {id} = req.params;
  const producto = ProductoModel.obtenerPorId(Number(id));
  if (!producto) {
    res.status(404).send("Producto no encontrado");
    return;
  }
  res.type('html').send(vistaEditarProducto(producto));
};

//procesar cambios
export const actualizarProducto = (req, res) => {
  const {id} = req.params;
  const {nombre, precio, categoria} = req.body;

  ProductoModel.editarProducto(Number(id), nombre, parseFloat(precio), categoria);

  //volver al detalle del producto
  res.redirect(`/productos/${id}`);
};