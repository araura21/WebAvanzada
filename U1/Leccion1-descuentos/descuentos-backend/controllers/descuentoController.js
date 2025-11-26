import Descuento from "../models/descuentoModel.js";

// Crear una nuevo
export const crearDescuento = async (req, res) => {
    try {
        const { totalCompra, numeroEscogido } = req.body;

        if (!totalCompra || !numeroEscogido) {
            return res.status(400).json({
                mensaje: "Debe ingresar el total de la compra y el número escogido."
            });
        }

        const nuevoDescuento = await Descuento.create({
            totalCompra,
            numeroEscogido,
        });

        return res.status(201).json(nuevoDescuento);

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al crear descuento",
            error: error.message
        });
    }
};

// Listar todas los descuento
export const listarDescuentos = async (req, res) => {
    try {
        const descuentos = await Descuento.findAll();
        res.json(descuentos);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al listar descuentos",
            error: error.message
        });
    }
};

// Buscar promoción por ID
export const buscarDescuentoPorId = async (req, res) => {
    try {
        const descuento = await Descuento.findByPk(req.params.id);

        if (!descuento) {
            return res.status(404).json({ mensaje: "Descuento no encontrado" });
        }

        res.json(descuento);

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al buscar descuento",
            error: error.message
        });
    }
};

// Actualizar promoción
export const actualizarDescuento = async (req, res) => {
    try {
        const descuento = await Descuento.findByPk(req.params.id);

        if (!descuento) {
            return res.status(404).json({
                mensaje: "Descuento no encontrado"
            });
        }

        const { totalCompra, numeroEscogido } = req.body;

        await descuento.update({
            totalCompra,
            numeroEscogido,
        });

        res.json(descuento);

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar descuento",
            error: error.message
        });
    }
};

// Eliminar 
export const eliminarDescuento = async (req, res) => {
    try {
        const descuento = await Descuento.findByPk(req.params.id);

        if (!descuento) {
            return res.status(404).json({
                mensaje: "Descuento no encontrada"
            });
        }

        await descuento.destroy();

        res.json({ mensaje: "Descuento eliminada correctamente" });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar descuento",
            error: error.message
        });
    }
};

// Calcular descuento 
export const calcularDescuentoFinal = async (req, res) => {
    try {
        const descuento = await Descuento.findByPk(req.params.id);

        if (!descuento) {
            return res.status(404).json({
                mensaje: "Descuento no encontrada."
            });
        }

        const promocion = descuento.calcularDescuento();

        res.json({
            id: descuento.id,
            totalCompra: descuento.totalCompra,
            numeroEscogido: descuento.numeroEscogido,
            ...promocion
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al calcular el descuento",
            error: error.message
        });
    }
};

