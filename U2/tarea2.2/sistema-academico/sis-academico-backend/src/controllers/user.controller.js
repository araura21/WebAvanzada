import Usuario from "../models/auth.model.js";
import bcrypt from "bcrypt";
import Estudiante from "../models/estudiante.model.js";
import Docente from "../models/docente.model.js";

// Listar usuarios
export const getUsers = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuarios", error });
    }
};

// Crear usuario (Admin)
export const createUser = async (req, res) => {
    try {
        const { usuario, password, rol, linkEntity } = req.body;

        // Validar duplicados
        const existe = await Usuario.findOne({ where: { usuario } });
        if (existe) return res.status(400).json({ message: "El usuario ya existe" });

        const hash = await bcrypt.hash(password, 10);

        const nuevoUsuario = await Usuario.create({
            usuario,
            password: hash,
            rol
        });

        // Opcional: Auto-crear entidad si no existe
        if (linkEntity) {
            // Lógica futura para crear Estudiante/Docente automáticamente
            // Por ahora, confiamos en que el usuario debe coincidir con correo/cedula
        }

        res.status(201).json({ message: "Usuario creado", usuario: nuevoUsuario });
    } catch (error) {
        res.status(500).json({ message: "Error al crear usuario", error });
    }
};

// Eliminar usuario
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await Usuario.update({ estado: false }, { where: { id } });
        res.json({ message: "Usuario desactivado" });
    } catch (e) {
        res.status(500).json({ message: "Error al eliminar usuario" });
    }
};

export const reactivateUser = async (req, res) => {
    try {
        const { id } = req.params;
        await Usuario.update({ estado: true }, { where: { id } });
        res.json({ message: "Usuario reactivado exitosamente" });
    } catch (e) {
        res.status(500).json({ message: "Error al reactivar usuario" });
    }
};
