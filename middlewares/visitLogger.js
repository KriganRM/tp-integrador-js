// Importa el servicio encargado de escribir en el archivo log.txt.
import { guardarRegistro } from "../services/logServices.js";

// Registra la fecha, hora y ruta de cada acceso.
export const registrarVisita = (req, res, next) => {
  const fechaHora = new Date().toLocaleString("es-CL");
  const registro = `${fechaHora} | ${req.method} | ${req.originalUrl}\n`;

  guardarRegistro(registro, (error) => {
    if (error) {
      console.error("Error al registrar la visita:", error.message);
    }
    // Continúa hacia el controlador correspondiente.
    next();
  });
};