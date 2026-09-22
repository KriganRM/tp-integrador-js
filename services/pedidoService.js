// Importa los modelos con sus relaciones configuradas.
import { Pedido, Usuario } from "../models/index.js";

// Crea un pedido para un usuario existente.
export const crearPedido = async (descripcion, total, usuarioId) => {
  const usuario = await Usuario.findByPk(usuarioId);

  if (!usuario) {
    return null;
  }

  return await Pedido.create({
    descripcion,
    total,
    usuarioId,
  });
};

// Obtiene los pedidos ordenados por ID.
export const obtenerPedidos = async () => {
  return await Pedido.findAll({
    order: [["id", "ASC"]],
  });
};

// Obtiene un pedido por su identificador.
export const obtenerPedidoPorId = async (id) => {
  return await Pedido.findByPk(id);
};

// Actualiza los datos de un pedido.
export const actualizarPedido = async (
  id,
  descripcion,
  total,
  usuarioId
) => {
  const pedido = await Pedido.findByPk(id);

  if (!pedido) {
    return { error: "Pedido no encontrado" };
  }

  const usuario = await Usuario.findByPk(usuarioId);

  if (!usuario) {
    return { error: "Usuario no encontrado" };
  }

  await pedido.update({
    descripcion,
    total,
    usuarioId,
  });

  return { pedido };
};

// Elimina un pedido si existe.
export const eliminarPedido = async (id) => {
  const pedido = await Pedido.findByPk(id);

  if (!pedido) {
    return null;
  }

  await pedido.destroy();

  return pedido;
};