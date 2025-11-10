import { Pedido } from "../models/pedido.js";
import { Producto } from "../models/producto.js";

//crear producto
export const crearPedido = async (req, res) => {
    try {
        const { cliente, productoId, cantidad } = req.body;

        // Validar que los campos requeridos estén presentes
        if (!cliente || !productoId || !cantidad) {
            return res.status(400).json({ mensaje: "Faltan datos requeridos" });
        }

        // Buscar el producto para obtener su precio
        const producto = await Producto.findById(productoId);
        if (!producto) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        // Calcular el total
        const total = producto.precio * cantidad;

        // Crear el pedido con el total calculado
        const nuevo = await Pedido.create({
            cliente,
            productoId,
            cantidad,
            total
        });

        res.status(201).json(nuevo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//obtener/listar todos los productos

export const listarPedidos = async (_req, res) => {
    try{
        const pedidos = await Pedido.find();
        res.json(pedidos);

    } catch (error){
        res.status(500).json({mensaje: "Error al listar los pedidos", error: error.message});
    }
};


//obtener por ID

export const obtenerPedidosPorId = async (req, res) => {
    try{
        const pedido = await Pedido.findByPk(req.params.id);
        if(pedido){
            return res.status(404).json({mensaje: "Pedido no encontrado"});
        }

        res.json(pedido);

    } catch (error){
        res.status(500).json({mensaje: "Error al buscar el pedido", error: error.mensaje});
    }
};

//actualizar

export const actualizarPedido = async (req, res) => {
   const pedido = await Pedido.findByIdAndUpdate(req.params.id, req.body, {new:true});
   res.json(pedido)
};

//eliminar

export const eliminarPedido = async (req, res) => {
    try{
        const pedido = await Pedido.findByPk(req.params.id);
        if(!Pedido)
            return res.status(404).json({mensaje: "Pedido no encontrada para eliminar"});

        await pedido.destroy();
        res.json({mensaje: "Pedido eliminado correctamente"});

    } catch (error){
        res.status(500).json({mensaje: "Error al eliminar el pedido", error: error.mensaje});
    }
};
