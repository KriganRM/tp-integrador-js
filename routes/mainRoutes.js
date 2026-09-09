// Importa Router para crear rutas separadas de la aplicación principal.
import { Router } from "express";

// Importa las funciones del controlador.
import {
  mostrarInicio,
  mostrarEstado,
} from "../controllers/mainController.js";

// Importa el middleware que registra las visitas.
import { registrarVisita } from "../middlewares/visitLogger.js";

// Crea una instancia del enrutador.
const router = Router();

// Ruta pública que responde con contenido HTML.
router.get("/", registrarVisita, mostrarInicio);

// Ruta pública que responde en formato JSON.
router.get("/status", registrarVisita, mostrarEstado);

// Exporta el enrutador para utilizarlo en app.js.
export default router;