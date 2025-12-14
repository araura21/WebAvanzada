import Usuario from "../models/auth.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// REGISTRO (crear usuario)
export const registrar = async (req, res) => {
  try {
    console.log("Body recibido:", req.body);
    
    const { usuario, password, rol } = req.body || {};

    // Validar que los campos requeridos estén presentes
    if (!usuario || !password || !rol) {
      return res.status(400).json({ 
        mensaje: "Usuario, contraseña y rol son requeridos",
        recibido: { usuario: !!usuario, password: !!password, rol: !!rol }
      });
    }

    // Validar que el rol sea válido
    const rolesValidos = ["admin", "docente", "estudiante"];
    if (!rolesValidos.includes(rol)) {
      return res.status(400).json({ 
        mensaje: "Rol inválido. Debe ser: admin, docente o estudiante"
      });
    }

    const existe = await Usuario.findOne({ where: { usuario } });

    if (existe) {
      return res.status(400).json({ mensaje: "El usuario ya existe" });
    }

    // encriptar password
    const hash = await bcrypt.hash(password, 10);

    const nuevo = await Usuario.create({
      usuario,
      password: hash,
      rol,
    });

    res.status(201).json({ mensaje: "Usuario creado", usuario: nuevo });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ 
      mensaje: "Error al registrar", 
      detalles: error.message,
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// LOGIN (genera token)
export const login = async (req, res) => {
  try {
    const { usuario, password } = req.body;

    const user = await Usuario.findOne({ where: { usuario } });

    if (!user) {
      return res.status(400).json({ mensaje: "Usuario o contraseña incorrectos" });
    }

    const valida = await bcrypt.compare(password, user.password);

    if (!valida) {
      return res.status(400).json({ mensaje: "Usuario o contraseña incorrectos" });
    }

    // generar token
    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      mensaje: "Login correcto",
      token,
      usuario: user.usuario,
      rol: user.rol,
    });

  } catch (error) {
    res.status(500).json({ mensaje: "Error en login", error });
  }
};
