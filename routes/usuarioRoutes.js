import { Router } from "express";

// Importa el middleware que verifica el token JWT.
import { verificarToken } from "../middlewares/authMiddleware.js";

import {
  crearUsuario,
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario,
  obtenerUsuarioConPedidos,
  obtenerUsuariosSQL,
} from "../controllers/usuarioController.js";

// Importa los controladores del perfil.
import { crearPerfil, obtenerUsuarioConPerfil} from "../controllers/perfilController.js";

// Importa las validaciones del perfil.
import { validarPerfil } from "../middlewares/perfilValidaciones.js";

// Importa las validaciones de usuarios y del filtro de búsqueda.
import {validarUsuario, validarIdUsuario, validarFiltroUsuarios} from "../middlewares/usuarioValidaciones.js";

import { manejarValidaciones } from "../middlewares/manejarValidaciones.js";

// Importa los controladores de asociación y consulta de roles.
import {asignarRol, obtenerUsuarioConRoles} from "../controllers/rolController.js";

// Importa la validación del identificador del rol.
import { validarIdRol } from "../middlewares/rolValidaciones.js";

const router = Router();

// Primero valida los datos; después ejecuta el controlador.
router.post("/", validarUsuario, manejarValidaciones, crearUsuario);

// Valida el filtro antes de consultar los usuarios.
router.get("/", validarFiltroUsuarios, manejarValidaciones, obtenerUsuarios);

router.get("/sql", obtenerUsuariosSQL);

// Requiere un token válido para actualizar un usuario.
router.put("/:id", verificarToken, validarIdUsuario, validarUsuario, manejarValidaciones, actualizarUsuario);

// Requiere un token válido para eliminar un usuario.
router.delete("/:id", verificarToken, validarIdUsuario, manejarValidaciones, eliminarUsuario);

router.get("/:id/pedidos", validarIdUsuario, manejarValidaciones, obtenerUsuarioConPedidos);

// Crea el perfil de un usuario con un token válido.
router.post("/:id/perfil", verificarToken, validarIdUsuario, validarPerfil, manejarValidaciones, crearPerfil);

// Consulta un usuario con su perfil mediante un token válido.
router.get("/:id/perfil", verificarToken, validarIdUsuario, manejarValidaciones, obtenerUsuarioConPerfil);

// Asocia un rol existente a un usuario.
router.post("/:id/roles/:rolId", verificarToken, validarIdUsuario, validarIdRol, manejarValidaciones, asignarRol);

// Consulta un usuario junto con sus roles.
router.get("/:id/roles", verificarToken, validarIdUsuario, manejarValidaciones, obtenerUsuarioConRoles);

export default router;
