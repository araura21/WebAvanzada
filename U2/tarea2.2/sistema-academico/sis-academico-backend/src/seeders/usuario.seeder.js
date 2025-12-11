import bcrypt from "bcrypt";
import Usuario from "../models/auth.model.js";

export const crearUsuarioAdmin = async () => {
  try {
    // Verificar si ya existe el usuario admin
    const adminExistente = await Usuario.findOne({
      where: { usuario: "admin" }
    });

    if (adminExistente) {
      console.log("✓ Usuario admin ya existe");
      return;
    }

    // Hash de la contraseña admin123
    const passwordHash = await bcrypt.hash("admin123", 10);

    // Crear el usuario admin
    await Usuario.create({
      usuario: "admin",
      password: passwordHash,
      rol: "admin",
      estado: true
    });

    console.log("✓ Usuario admin creado exitosamente");
    console.log("  Usuario: admin");
    console.log("  Contraseña: admin123");
  } catch (error) {
    console.error("Error al crear usuario admin:", error);
  }
};

export const crearUsuariosPrueba = async () => {
  try {
    const usuarios = [
      { usuario: "docente", password: "docente123", rol: "docente" },
      { usuario: "estudiante", password: "estudiante123", rol: "estudiante" }
    ];

    for (const user of usuarios) {
      const existe = await Usuario.findOne({
        where: { usuario: user.usuario }
      });

      if (!existe) {
        const passwordHash = await bcrypt.hash(user.password, 10);
        await Usuario.create({
          usuario: user.usuario,
          password: passwordHash,
          rol: user.rol,
          estado: true
        });
        console.log(`✓ Usuario ${user.usuario} creado`);
      }
    }
  } catch (error) {
    console.error("Error al crear usuarios de prueba:", error);
  }
};
