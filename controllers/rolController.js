// Importa los servicios de roles con alias.
import {
  crearRol as crearRolService,
  asignarRol as asignarRolService,
  obtenerUsuarioConRoles as obtenerUsuarioConRolesService,
} from "../services/rolService.js";

// Controlador para crear un rol.
export const crearRol = async (req, res) => {
  try {
    const { nombre } = req.body ?? {};

    const rol = await crearRolService(nombre);

    return res.status(201).json({
      status: "success",
      message: "Rol creado correctamente",
      data: rol,
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        status: "error",
        message: "El nombre del rol ya está registrado",
        data: null,
      });
    }

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        status: "error",
        message: error.errors
          .map((detalle) => detalle.message)
          .join(", "),
        data: null,
      });
    }

    console.error("Error al crear rol:", error.message);

    return res.status(500).json({
      status: "error",
      message: "No se pudo crear el rol",
      data: null,
    });
  }
};

// Controlador para asociar un rol a un usuario.
export const asignarRol = async (req, res) => {
  try {
    const usuarioId = Number(req.params.id);
    const rolId = Number(req.params.rolId);

    const resultado = await asignarRolService(usuarioId, rolId);

    if (resultado.error) {
      return res.status(404).json({
        status: "error",
        message: resultado.error,
        data: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Rol asociado correctamente",
      data: resultado,
    });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(409).json({
        status: "error",
        message: "El usuario o el rol asociado ya no existe",
        data: null,
      });
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        status: "error",
        message: "El usuario ya tiene ese rol asociado",
        data: null,
      });
    }

    console.error("Error al asociar rol:", error.message);

    return res.status(500).json({
      status: "error",
      message: "No se pudo asociar el rol",
      data: null,
    });
  }
};

// Controlador para consultar un usuario con sus roles.
export const obtenerUsuarioConRoles = async (req, res) => {
  try {
    const usuarioId = Number(req.params.id);

    const usuario = await obtenerUsuarioConRolesService(usuarioId);

    if (!usuario) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado",
        data: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Usuario y roles obtenidos correctamente",
      data: usuario,
    });
  } catch (error) {
    console.error("Error al consultar usuario y roles:", error.message);

    return res.status(500).json({
      status: "error",
      message: "No se pudieron consultar el usuario y sus roles",
      data: null,
    });
  }
};