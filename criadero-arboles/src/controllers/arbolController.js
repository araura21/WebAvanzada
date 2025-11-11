import {Arboles} from "../models/arbol.js";

const ARBOLES = {
  paltos: { precio: 1200, rebaja100a300: 0.10, rebajaMas300: 0.18,},
  limones: {precio: 1000, rebaja100a300: 0.125,rebajaMas300: 0.20,},
  chirimoyos: {precio: 980,rebaja100a300: 0.145,rebajaMas300: 0.19,},
};

//ajustable
const IVA = 0.15;


export const calcularRebajas = (tipoArbol, cantidad) => {

  const {precio, rebaja100a300, rebajaMas300 } = ARBOLES[tipoArbol];

  // Determinar rebaja base por rango
  let rebajaBase = 0;
  let rebajaAdicional = 0;
  if (cantidad > 100 && cantidad <= 300) {
    rebajaBase = rebaja100a300;
  } else if (cantidad > 300) {
    rebajaBase = rebajaMas300;
  } else if (cantidad > 100){
    rebajaAdicional = 0.15;
  }

  const rebajaTotal = rebajaBase + rebajaAdicional; 

  const subtotal = precio * cantidad;
  const descuentoValor = subtotal * rebajaTotal;
  const subtotalConDescuento = subtotal - descuentoValor;
  const iva = subtotalConDescuento * IVA;
  const totalPagar = subtotalConDescuento + iva;

  return {
    precio,
    rebajaTotal,
    subtotal: Number(subtotal.toFixed(2)),
    descuentoValor: Number(descuentoValor.toFixed(2)),
    subtotalConDescuento: Number(subtotalConDescuento.toFixed(2)),
    iva: Number(iva.toFixed(2)),
    totalPagar: Number(totalPagar.toFixed(2)),
  };
};

// Body: { tipoArbol: "paltos"|"limones"|"chirimoyos", cantidad: number }, funcion crear compra
export const calcularCompraArboles = async (req, res) => {
  try {
    const tipoArbol = req.body.tipoArbol;
    const cantidad = Number(req.body.cantidad);

    // Validaciones básicas
    if (!tipoArbol || !(tipoArbol in ARBOLES)) {
      return res.status(400).json({ mensaje: "Tipo de arbol inexistente" });
    }
    if (Number.isNaN(cantidad) || cantidad <= 0) {
      return res.status(400).json({ mensaje: "Cantidad debe ser un número mayor a 0." });
    }

    const { precio, rebajaTotal, subtotal, descuentoValor, iva, totalPagar } = calcularRebajas(tipoArbol, cantidad);

    // Crear compra
    const nuevo = await ArbolCompra.create({
      tipoArbol,
      precioUnitario: precio,
      cantidad,
      rebaja: rebajaTotal,
      iva,
      totalPagar,
      subtotal,
      descuentoValor,
    });
    return res.status(201).json(nuevo);

  } catch (error) {
    return res.status(500).json({ mensaje: "Error al calcular la compra de arboles", error: error.message });
  }
};

//Obtener todas las compras de arboles
export const listarComprasArboles = async (_req, res) => {
  try {
    const compras = await Arboles.findAll();
    res.json(compras);

  } catch (error) {
    return res.status(500).json({ mensaje: "Error al listar compras de árboles", error: error.message });
  }
};

//Obtener compra por id
export const obtenerCompraArbolPorId = async (req, res) => {
  try {
    const compra = await Arboles.findByPk(req.params.id);
    if (!compra){
      return res.status(404).json({ mensaje: "Compra no encontrada" });
    }
    res.json(compra);

  } catch (error) {
    return res.status(500).json({ mensaje: "Error al obtener la compra", error: error.message });
  }
};

// Eliminar arbol por id
export const eliminarCompraArbol = async (req, res) => {
  try {
    const compra = await Arboles.findByPk(req.params.id);
    if (!compra) 
      return res.status(404).json({ mensaje: "Compra no encontrada" });

    await compra.destroy();
    res.json({ mensaje: "Compra eliminada correctamente" });

  } catch (error) {
    return res.status(500).json({ mensaje: "Error al eliminar la compra", error: error.message });
  }
};

// Actualizar compra
export const actualizarCompraArbol = async (req, res) => {
  try {
    const compra = await ArbolCompra.findByPk(req.params.id);
    if (!compra) return res.status(404).json({ mensaje: "Compra no encontrada" });

    const tipoArbol = req.body.tipoArbol;
    const cantidad = req.body.cantidad;

    if (!tipoArbol || !(tipoArbol in ARBOLES)) {
      return res.status(400).json({ mensaje: "Tipo de arbol no existe" });
    }
    if (Number.isNaN(cantidad) || cantidad <= 0) {
      return res.status(400).json({ mensaje: "Cantidad debe ser un número mayor a 0." });
    }

    const { precio, rebajaTotal, subtotal, descuentoValor, iva, totalPagar } = calcularValores(
      tipoArbol,
      cantidad
    );

    await compra.update({
      tipoArbol,
      precioUnitario: precio,
      cantidad,
      rebaja: rebajaTotal,
      subtotal,
      descuentoValor,
      subtotalConDescuento,
      iva,
      totalPagar,
    });

    return res.json(compra);

  } catch (error) {
    return res.status(500).json({ mensaje: "Error al actualizar la compra", error: error.message });
  }
};