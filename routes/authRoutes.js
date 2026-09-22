import { Router } from "express";
import {
  registrarUsuario,
  iniciarSesion,
} from "../controllers/authController.js";
import {
  validarRegistro,
  validarLogin,
} from "../middlewares/authValidaciones.js";
import { manejarValidaciones } from "../middlewares/manejarValidaciones.js";

const router = Router();

// Valida los datos antes de registrar al usuario.
router.post(
  "/registro",
  validarRegistro,
  manejarValidaciones,
  registrarUsuario
);

// Valida las credenciales antes de iniciar sesión.
router.post(
  "/login",
  validarLogin,
  manejarValidaciones,
  iniciarSesion
);

export default router;