import jwt from "jsonwebtoken";

export const verificarToken = (req, res, next) => {
  const header = req.headers["authorization"];

  if (!header) {
    return res.status(403).json({ mensaje: "Token requerido" });
  }

  const token = header.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) return res.status(401).json({ mensaje: "Token inválido" });

    req.usuario = user;
    next();
  });
};

export const esDocente = (req, res, next) => {
  if (req.usuario && req.usuario.rol === 'docente') {
    next();
  } else {
    res.status(403).json({ mensaje: "Acceso denegado: Se requiere rol Docente" });
  }
};

export const esAdmin = (req, res, next) => {
  if (req.usuario && req.usuario.rol === 'admin') {
    next();
  } else {
    res.status(403).json({ mensaje: "Acceso denegado: Se requiere rol Admin" });
  }
};
