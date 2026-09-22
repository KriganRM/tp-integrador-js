// Importa Router y el controlador de roles.
import { Router } from "express";
import { crearRol } from "../controllers/rolController.js";

// Importa los middlewares de autenticación y validación.
import { verificarToken } from "../middlewares/authMiddleware.js";
import { validarRol } from "../middlewares/rolValidaciones.js";
import { manejarValidaciones } from "../middlewares/manejarValidaciones.js";

const router = Router();

// Crea un rol después de verificar el token y los datos.
router.post(
  "/",
  verificarToken,
  validarRol,
  manejarValidaciones,
  crearRol
);

export default router;