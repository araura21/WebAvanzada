import Usuario from "../models/auth.model.js";
import Estudiante from "../models/estudiante.model.js";
import Docente from "../models/docente.model.js";
import sequelize from "../config/database.js";
import bcrypt from "bcrypt";

// Crear Usuario + Estudiante (Atomic)
export const createUsuarioEstudiante = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const {
            // Datos Usuario
            usuario, password,
            // Datos Estudiante
            cedula, nombres, apellidos, correo, telefono, curso, paralelo
        } = req.body;

        // 1. Validar existencia previa (Usuario o Cédula/Correo)
        const existeUser = await Usuario.findOne({ where: { usuario } });
        if (existeUser) {
            await t.rollback();
            return res.status(400).json({ message: "El usuario ya existe" });
        }

        // 2. Crear Usuario
        const hash = await bcrypt.hash(password, 10);
        const nuevoUsuario = await Usuario.create({
            usuario,
            password: hash,
            rol: 'estudiante'
        }, { transaction: t });

        // 3. Crear Estudiante vinculado

        const nuevoEstudiante = await Estudiante.create({
            cedula,
            nombres,
            apellidos,
            correo,
            telefono,
            curso,
            usuarioId: nuevoUsuario.id,
            foto: req.file ? req.file.path : null,
            estado: 'activo'
        }, { transaction: t });

        await t.commit();
        res.status(201).json({ message: "Estudiante y Usuario creados exitosamente", estudiante: nuevoEstudiante });

    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({ message: "Error al crear estudiante", error: error.message });
    }
};

// Crear Usuario + Docente (Atomic)
export const createUsuarioDocente = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const {
            // Datos Usuario
            usuario, password,
            // Datos Docente
            cedula, nombres, apellidos, correo, telefono, especialidad
        } = req.body;

        // 1. Validar existencia
        const existeUser = await Usuario.findOne({ where: { usuario } });
        if (existeUser) {
            await t.rollback();
            return res.status(400).json({ message: "El usuario ya existe" });
        }

        // 2. Crear Usuario
        const hash = await bcrypt.hash(password, 10);
        const nuevoUsuario = await Usuario.create({
            usuario,
            password: hash,
            rol: 'docente'
        }, { transaction: t });

        // 3. Crear Docente vinculado
        const nuevoDocente = await Docente.create({
            cedula,
            nombres,
            apellidos,
            correo,
            telefono,
            especialidad,
            usuarioId: nuevoUsuario.id,
            foto: req.file ? req.file.path : null,
            estado: 'activo'
        }, { transaction: t });

        await t.commit();
        res.status(201).json({ message: "Docente y Usuario creados exitosamente", docente: nuevoDocente });

    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({ message: "Error al crear docente", error: error.message });
    }
};
