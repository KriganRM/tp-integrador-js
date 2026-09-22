import jwt from "jsonwebtoken";

// Comprueba el token recibido en el encabezado Authorization.
export const verificarToken = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      message: "Debes enviar un token con el formato Bearer",
      data: null,
    });
  }

  // Separa el encabezado y obtiene el token.
  const token = authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "El token es obligatorio",
      data: null,
    });
  }

  try {
    // Verifica la firma y el vencimiento del token.
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    // Guarda los datos del token en la petición.
    req.usuario = decoded;
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message:
        error.name === "TokenExpiredError"
          ? "El token ha vencido"
          : "El token no es válido",
      data: null,
    });
  }

  next();
};