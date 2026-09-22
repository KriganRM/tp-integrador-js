// Responde cuando ninguna ruta coincide con la petición.
export const rutaNoEncontrada = (req, res) => {
  return res.status(404).json({
    status: "error",
    message: "Ruta no encontrada",
    data: null,
  });
};

// Maneja errores del servidor y del formato JSON recibido.
export const manejarErrores = (error, req, res, next) => {
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({
      status: "error",
      message: "El JSON enviado no tiene un formato válido",
      data: null,
    });
  }

  if (res.headersSent) {
    return next(error);
  }

  console.error("Error en la aplicación:", error.message);

  return res.status(500).json({
    status: "error",
    message: "Ocurrió un error en el servidor",
    data: null,
  });
};