import { Producto } from "../models/producto.js";

//crear producto
export const crearProducto = async (req, res) => {
    try{
        const {nombre, precio, stock, categoria} = req.body;
        if(!nombre || !precio || !stock || !categoria){
            return res.status(400).json({mensaje: "Faltan datos requeridos"});
        }

        const nuevo = await Producto.create({nombre, precio, stock, categoria});
        res.status(201).json(nuevo);
    
    }catch (err){
        res.status(500).json({error: err.message});
    }
};

//obtener/listar todos los productos

export const listarProductos = async (_req, res) => {
    try{
        const productos = await Producto.find();
        res.json(productos);

    } catch (error){
        res.status(500).json({mensaje: "Error al listar los productos", error: error.message});
    }
};


//obtener por ID

export const obtenerProductosPorId = async (req, res) => {
    try{
        const producto = await Producto.findByPk(req.params.id);
        if(producto){
            return res.status(404).json({mensaje: "Producto no encontrado"});
        }

        res.json(producto);

    } catch (error){
        res.status(500).json({mensaje: "Error al buscar el producto", error: error.mensaje});
    }
};

//actualizar

export const actualizarProducto = async (req, res) => {
   const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, {new:true});
   res.json(producto)
};

//eliminar

export const eliminarProducto = async (req, res) => {
    try{
        const producto = await Producto.findByPk(req.params.id);
        if(!Producto)
            return res.status(404).json({mensaje: "Producto no encontrada para eliminar"});

        await producto.destroy();
        res.json({mensaje: "Producto eliminada correctamente"});

    } catch (error){
        res.status(500).json({mensaje: "Error al eliminar el producto", error: error.mensaje});
    }
};
