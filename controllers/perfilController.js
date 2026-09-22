// Importa los servicios del perfil con alias.
import {
  crearPerfil as crearPerfilService,
  obtenerUsuarioConPerfil as obtenerUsuarioConPerfilService,
} from "../services/perfilService.js";

// Controlador para crear el perfil de un usuario.
export const crearPerfil = async (req, res) => {
  try {
    const usuarioId = Number(req.params.id);
    const { telefono, direccion } = req.body ?? {};

    const resultado = await crearPerfilService(
      usuarioId,
      telefono,
      direccion
    );

    if (resultado.error === "Usuario no encontrado") {
      return res.status(404).json({
        status: "error",
        message: resultado.error,
        data: null,
      });
    }

    if (resultado.error === "El usuario ya tiene un perfil") {
      return res.status(409).json({
        status: "error",
        message: resultado.error,
        data: null,
      });
    }

    return res.status(201).json({
      status: "success",
      message: "Perfil creado correctamente",
      data: resultado.perfil,
    });
  } catch (error) {
    // Maneja intentos de crear un segundo perfil para el mismo usuario.
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        status: "error",
        message: "El usuario ya tiene un perfil",
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

    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(409).json({
        status: "error",
        message: "El usuario asociado ya no existe",
        data: null,
      });
    }

    console.error("Error al crear perfil:", error.message);

    return res.status(500).json({
      status: "error",
      message: "No se pudo crear el perfil",
      data: null,
    });
  }
};

// Controlador para consultar un usuario con su perfil.
export const obtenerUsuarioConPerfil = async (req, res) => {
  try {
    const usuarioId = Number(req.params.id);

    const usuario = await obtenerUsuarioConPerfilService(usuarioId);

    if (!usuario) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado",
        data: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Usuario y perfil obtenidos correctamente",
      data: usuario,
    });
  } catch (error) {
    console.error("Error al consultar usuario y perfil:", error.message);

    return res.status(500).json({
      status: "error",
      message: "No se pudieron consultar el usuario y su perfil",
      data: null,
    });
  }
};