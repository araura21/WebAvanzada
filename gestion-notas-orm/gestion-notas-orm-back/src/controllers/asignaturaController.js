import { Asignatura } from "../models/asignatura.js";
import { Docente } from "../models/docente.js";

//crear asignatura
export const crearAsignatura = async (req, res) => {
    try{
        const {nombre, codigo, creditos} = req.body;
        if(!nombre || !codigo || !creditos){
            return res.status(400).json({mensaje: "Faltan datos requeridos"});
        }

        const nuevo = await Asignatura.create({nombre, codigo, creditos});
        res.status(201).json(nuevo);
    
    }catch (err){
        res.status(500).json({error: err.message});
    }
};

//crear obtener todos las asignaturas

export const listarAsignaturas = async (req, res) => {
    try{
        const asignaturas = await Asignatura.findAll({include : [{ model: Docente }]});
        res.json(asignaturas);

    } catch (error){
        res.status(500).json({mensaje: "Error al listar las asignaturas", error: error.mensaje});
    }
};


//obtener por ID

export const buscarAsignaturaId = async (req, res) => {
    try{
        const asignatura = await Asignatura.findByPk(req.params.id, {
                    include: [{ model: Docente }]
                });
        if(!asignatura){
            return res.status(404).json({mensaje: "Asignatura no encontrada"});
        }

        res.json(asignatura);

    } catch (error){
        res.status(500).json({mensaje: "Error al buscar la asignatura", error: error.mensaje});
    }
};

//actualizar

export const actualizarAsignatura = async (req, res) => {
    try{
        const asignatura = await Asignatura.findByPk(req.params.id);
        if(!asignatura) return res.status(404).json({ mensaje: "Asignatura no encontrada para actualizar" });
        const { nombre, codigo, creditos, docenteId } = req.body;

        if (nombre == null && codigo == null && creditos == null && docenteId == null) {
            return res.status(400).json({ mensaje: "No hay campos válidos para actualizar" });
        }

        if (creditos != null && Number.isNaN(Number(creditos))) {
            return res.status(400).json({ mensaje: "El campo creditos debe ser numérico" });
        }

        // Si se envía docenteId, validar que exista dicho docente
        if (docenteId != null) {
            const docente = await Docente.findByPk(docenteId);
            if (!docente) return res.status(404).json({ mensaje: "Docente no encontrado" });
        }

        // Construir objeto con los campos a actualizar (evitar sobrescribir con undefined)
        const updates = {};
        if (nombre != null) updates.nombre = nombre;
        if (codigo != null) updates.codigo = codigo;
        if (creditos != null) updates.creditos = creditos;
        if (docenteId != null) updates.docenteId = docenteId;

        await asignatura.update(updates);
        return res.json(asignatura);

    } catch (err){
        console.error("actualizarAsignatura error:", err);
        if (err.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({ mensaje: "Código de asignatura ya existe" });
        }
        return res.status(500).json({ mensaje: "Error al actualizar la asignatura", error: err.message });
    }
};

//eliminar

export const eliminarAsignatura = async (req, res) => {
    try{
        const asignatura = await Asignatura.findByPk(req.params.id);
        if(!asignatura)
            return res.status(404).json({mensaje: "Asignatura no encontrada para eliminar"});

        await asignatura.destroy();
        res.json({mensaje: "Asignatura eliminada correctamente"});

    } catch (error){
        res.status(500).json({mensaje: "Error al eliminar la asignatura", error: error.mensaje});
    }
};



