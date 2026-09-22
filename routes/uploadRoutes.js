// Importa Router para definir las rutas.
import { Router } from "express";

// Importa el controlador de subida.
import { subirArchivo } from "../controllers/uploadController.js";

// Importa los middlewares de recepción y validación del archivo.
import {
  recibirArchivo,
  validarArchivo,
} from "../middlewares/uploadMiddleware.js";

// Importa el middleware que verifica el token JWT.
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = Router();

// Verifica el token y valida el archivo antes de guardarlo.
router.post("/upload", verificarToken, recibirArchivo, validarArchivo, subirArchivo);

export default router;