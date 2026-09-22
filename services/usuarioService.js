// Importa el modelo Usuario y Pedido.
import { Usuario, Pedido } from "../models/index.js";

import sequelize from "../config/db.js";
// Importa el tipo de consulta SQL y los operadores de Sequelize.
import { QueryTypes, Op } from "sequelize";

// Guarda un nuevo usuario en la base de datos.
export const crearUsuario = async (nombre, email) => {
  const usuario = await Usuario.create({
    nombre,
    email,
  });

  return usuario;
};

// Obtiene los usuarios y permite filtrar por parte del nombre.
export const obtenerUsuarios = async (nombre) => {
  const filtros = {};

  if (nombre) {
    filtros.nombre = {
      [Op.iLike]: `%${nombre}%`,
    };
  }

  return await Usuario.findAll({
    attributes: ["id", "nombre", "email", "createdAt", "updatedAt"],
    where: filtros,
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

  // Devuelve los datos actualizados sin incluir la contraseña.
  return {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    createdAt: usuario.createdAt,
    updatedAt: usuario.updatedAt,
  };
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