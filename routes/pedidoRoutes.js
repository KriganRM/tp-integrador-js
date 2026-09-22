// Importa Router para definir las rutas.
import { Router } from "express";

// Importa los controladores de pedidos.
import {
  crearPedido,
  obtenerPedidos,
  obtenerPedidoPorId,
  actualizarPedido,
  eliminarPedido,
} from "../controllers/pedidoController.js";

// Importa las validaciones de pedidos.
import {
  validarPedido,
  validarIdPedido,
} from "../middlewares/pedidoValidaciones.js";

// Importa el middleware que responde ante datos inválidos.
import { manejarValidaciones } from "../middlewares/manejarValidaciones.js";

// Importa el middleware que verifica el token JWT.
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = Router();

// Exige un token válido para todas las rutas de pedidos.
router.use(verificarToken);

router.post("/", validarPedido, manejarValidaciones, crearPedido);

router.get("/", obtenerPedidos);

router.get("/:id", validarIdPedido, manejarValidaciones, obtenerPedidoPorId);

router.put("/:id", validarIdPedido, validarPedido, manejarValidaciones, actualizarPedido);

router.delete("/:id", validarIdPedido, manejarValidaciones, eliminarPedido);

export default router;