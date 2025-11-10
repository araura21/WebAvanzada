import { Arbol } from "../models/arbol.js";

// Tabla de referencia con precios y rebajas según el ejercicio
const CATALOGO_ARBOLES = {
    "Paltos": {
        precioUnitario: 1200,
        rebaja100a300: 10,
        rebajaMayor300: 18
    },
    "Limones": {
        precioUnitario: 1000,
        rebaja100a300: 12.5,
        rebajaMayor300: 20
    },
    "Chirimoyos": {
        precioUnitario: 980,
        rebaja100a300: 14.5,
        rebajaMayor300: 19
    }
};

/**
 * Calcular precio con descuentos e IVA según el ejercicio
 * 
 * Responsabilidades del controlador:
 * ✓ Recibir los datos ingresados por el usuario (tipo de árbol y cantidad)
 * ✓ Verificar en qué rango cae la cantidad (≤100, 100–300, >300, >1000)
 * ✓ Aplicar el porcentaje de rebaja según las condiciones
 * ✓ Calcular el subtotal, rebaja total, IVA y valor final
 * ✓ Validar que los valores ingresados sean correctos (no negativos, no vacíos)
 */
export const calcularPrecioArbol = async (req, res) => {
    try {
        const { tipoArbol, cantidad } = req.body;

        // ✓ Validar que los valores ingresados no sean vacíos
        if (!tipoArbol || cantidad === undefined || cantidad === null) {
            return res.status(400).json({ 
                mensaje: "Faltan datos requeridos: tipoArbol y cantidad" 
            });
        }

        // ✓ Validar que la cantidad sea un número válido y no negativo
        if (isNaN(cantidad) || cantidad <= 0) {
            return res.status(400).json({ 
                mensaje: "La cantidad debe ser un número mayor a 0" 
            });
        }

        // Verificar que el tipo de árbol exista en el catálogo
        if (!CATALOGO_ARBOLES[tipoArbol]) {
            return res.status(404).json({ 
                mensaje: `Tipo de árbol '${tipoArbol}' no encontrado. Disponibles: ${Object.keys(CATALOGO_ARBOLES).join(', ')}` 
            });
        }

        const cantidad_num = parseInt(cantidad);
        const arbolRef = CATALOGO_ARBOLES[tipoArbol];
        const precioUnitario = arbolRef.precioUnitario;

        // ✓ Calcular el subtotal sin descuentos
        const subtotal = precioUnitario * cantidad_num;

        // ✓ Verificar en qué rango cae la cantidad (≤100, 100–300, >300, >1000)
        let porcentajeRebaja = 0;
        let rangoDescripcion = "";
        
        if (cantidad_num <= 100) {
            porcentajeRebaja = 0; // Sin rebaja
            rangoDescripcion = "≤ 100 árboles (sin rebaja)";
        } else if (cantidad_num > 100 && cantidad_num <= 300) {
            porcentajeRebaja = arbolRef.rebaja100a300;
            rangoDescripcion = "100-300 árboles";
        } else if (cantidad_num > 300) {
            porcentajeRebaja = arbolRef.rebajaMayor300;
            rangoDescripcion = "> 300 árboles";
        }

        // ✓ Aplicar el porcentaje de rebaja según las condiciones
        const montoRebaja = subtotal * (porcentajeRebaja / 100);
        let subtotalConRebaja = subtotal - montoRebaja;

        // ✓ Aplicar descuento adicional del 15% si cantidad > 1000
        let descuentoAdicional = 0;
        if (cantidad_num > 1000) {
            descuentoAdicional = subtotalConRebaja * 0.15;
            subtotalConRebaja = subtotalConRebaja - descuentoAdicional;
        }

        // ✓ Calcular IVA del 15% sobre subtotal con rebaja(s)
        const IVA_RATE = 0.15;
        const montoIVA = subtotalConRebaja * IVA_RATE;
        
        // ✓ Calcular valor final (totalPagar)
        const totalPagar = subtotalConRebaja + montoIVA;

        // Guardar la compra en la BD con los atributos del modelo
        const compra = await Arbol.create({
            tipoArbol,
            precioUnitario,
            cantidad: cantidad_num,
            rebaja: parseFloat(montoRebaja.toFixed(2)),
            iva: parseFloat(montoIVA.toFixed(2)),
            totalPagar: parseFloat(totalPagar.toFixed(2))
        });

        // Respuesta con detalles del cálculo
        const respuesta = {
            id: compra.id,
            tipoArbol,
            cantidad: cantidad_num,
            rango: rangoDescripcion,
            precioUnitario: precioUnitario.toFixed(2),
            subtotal: subtotal.toFixed(2),
            porcentajeRebaja: porcentajeRebaja.toFixed(2) + '%',
            montoRebaja: montoRebaja.toFixed(2),
            descuentoAdicional15: descuentoAdicional > 0 ? descuentoAdicional.toFixed(2) : "0.00",
            subtotalConDescuento: subtotalConRebaja.toFixed(2),
            porcentajeIVA: "15.00%",
            montoIVA: montoIVA.toFixed(2),
            totalPagar: totalPagar.toFixed(2)
        };

        res.status(201).json(respuesta);

    } catch (error) {
        res.status(500).json({ 
            mensaje: "Error al calcular el precio", 
            error: error.message 
        });
    }
};

/**
 * Listar todas las compras realizadas
 */
export const listarArboles = async (req, res) => {
    try {
        const compras = await Arbol.findAll();
        res.json(compras);
    } catch (error) {
        res.status(500).json({ 
            mensaje: "Error al listar compras", 
            error: error.message 
        });
    }
};

/**
 * Buscar compra por ID
 */
export const buscarArbolId = async (req, res) => {
    try {
        const compra = await Arbol.findByPk(req.params.id);
        if (!compra) {
            return res.status(404).json({ 
                mensaje: "Compra no encontrada" 
            });
        }
        res.json(compra);
    } catch (error) {
        res.status(500).json({ 
            mensaje: "Error al buscar compra", 
            error: error.message 
        });
    }
};

/**
 * Eliminar compra por ID
 */
export const eliminarArbol = async (req, res) => {
    try {
        const compra = await Arbol.findByPk(req.params.id);
        if (!compra) {
            return res.status(404).json({ 
                mensaje: "Compra no encontrada para eliminar" 
            });
        }
        await compra.destroy();
        res.json({ 
            mensaje: "Compra eliminada correctamente" 
        });
    } catch (error) {
        res.status(500).json({ 
            mensaje: "Error al eliminar compra", 
            error: error.message 
        });
    }
};

