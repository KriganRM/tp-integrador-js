import { Router } from "express";
import {
  crearUsuario,
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario,
  obtenerUsuarioConPedidos,
  obtenerUsuariosSQL,
} from "../controllers/usuarioController.js";
import { validarUsuario, validarIdUsuario } from "../middlewares/usuarioValidaciones.js";
import { manejarValidaciones } from "../middlewares/manejarValidaciones.js";

const router = Router();

// Primero valida los datos; después ejecuta el controlador.
router.post("/", validarUsuario, manejarValidaciones, crearUsuario);
router.get("/", obtenerUsuarios);
router.get("/sql", obtenerUsuariosSQL);
router.put("/:id", validarIdUsuario, validarUsuario, manejarValidaciones, actualizarUsuario);
router.delete("/:id", validarIdUsuario, manejarValidaciones, eliminarUsuario);
router.get("/:id/pedidos", validarIdUsuario, manejarValidaciones, obtenerUsuarioConPedidos);

export default router;
