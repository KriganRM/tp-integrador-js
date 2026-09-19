import { Router } from "express";
import { crearUsuarioConPedido } from "../controllers/transaccionController.js";
import { validarUsuarioConPedido } from "../middlewares/transaccionValidaciones.js";
import { manejarValidaciones } from "../middlewares/manejarValidaciones.js";

const router = Router();

router.post(
  "/usuario-con-pedido",
  validarUsuarioConPedido,
  manejarValidaciones,
  crearUsuarioConPedido
);

export default router;
