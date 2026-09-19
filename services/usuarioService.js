// Importa el modelo Usuario y Pedido.
import { Usuario, Pedido } from "../models/index.js";

import sequelize from "../config/db.js";
import { QueryTypes } from "sequelize";

// Guarda un nuevo usuario en la base de datos.
export const crearUsuario = async (nombre, email) => {
  const usuario = await Usuario.create({
    nombre,
    email,
  });

  return usuario;
};

// Obtiene los usuarios ordenados por ID.
export const obtenerUsuarios = async () => {
  return await Usuario.findAll({
    attributes: ["id", "nombre", "email", "createdAt", "updatedAt"],
    order: [["id", "ASC"]],
  });
};

// Busca un usuario por ID y actualiza sus datos.
export const actualizarUsuario = async (id, nombre, email) => {
  const usuario = await Usuario.findByPk(id);

  // Si no existe, devuelve null.
  if (!usuario) {
    return null;
  }

  // Actualiza solamente nombre y email.
  await usuario.update({ nombre, email });

  return usuario;
};

// Busca un usuario y lo elimina si existe.
export const eliminarUsuario = async (id) => {
  const usuario = await Usuario.findByPk(id);

  if (!usuario) {
    return null;
  }

  await usuario.destroy();

  return usuario;
};

// Obtiene un usuario junto con sus pedidos.
export const obtenerUsuarioConPedidos = async (id) => {
  return await Usuario.findByPk(id, {
    attributes: ["id", "nombre", "email"],
    include: [
      {
        model: Pedido,
        as: "pedidos",
        attributes: ["id", "descripcion", "total", "usuarioId"],
      },
    ],
  });
};

// Obtiene los usuarios mediante SQL escrito manualmente.
export const obtenerUsuariosSQL = async () => {
  return await sequelize.query(
    `SELECT id, nombre, email, "createdAt", "updatedAt"
     FROM usuarios
     ORDER BY id ASC`,
    {
      type: QueryTypes.SELECT,
    }
  );
};