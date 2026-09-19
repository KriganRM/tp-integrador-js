import { validationResult } from "express-validator";

// Detiene la petición si hay errores; de lo contrario, continúa al controlador.
export const manejarValidaciones = (req, res, next) => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({
      status: "error",
      message: errores.array({ onlyFirstError: true })
        .map((error) => error.msg).join(", "),
      data: null,
    });
  }

  next();
};
