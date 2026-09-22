// Importa los modelos con sus relaciones configuradas.
import { Usuario, Perfil } from "../models/index.js";

// Crea un perfil para un usuario existente.
export const crearPerfil = async (usuarioId, telefono, direccion) => {
  const usuario = await Usuario.findByPk(usuarioId);

  if (!usuario) {
    return { error: "Usuario no encontrado" };
  }

  // Comprueba que el usuario todavía no tenga un perfil.
  const perfilExistente = await Perfil.findOne({
    where: { usuarioId },
  });

  if (perfilExistente) {
    return { error: "El usuario ya tiene un perfil" };
  }

  const perfil = await Perfil.create({
    telefono,
    direccion,
    usuarioId,
  });

  return { perfil };
};

// Consulta un usuario junto con su perfil.
export const obtenerUsuarioConPerfil = async (usuarioId) => {
  return await Usuario.findByPk(usuarioId, {
    attributes: ["id", "nombre", "email"],
    include: [
      {
        model: Perfil,
        as: "perfil",
        attributes: ["id", "telefono", "direccion", "usuarioId"],
      },
    ],
  });
};