// Importa la conexión y los modelos relacionados.
import sequelize from "../config/db.js";
import { Usuario, Pedido } from "../models/index.js";

// Crea un usuario y su primer pedido en una misma transacción.
export const crearUsuarioConPedido = async (
  nombre,
  email,
  descripcion,
  total,
  simularError = false
) => {
  return await sequelize.transaction(async (transaccion) => {
    // Primera operación: crear el usuario.
    const usuario = await Usuario.create(
      { nombre, email },
      { transaction: transaccion }
    );

    // Segunda operación: crear un pedido para ese usuario.
    const pedido = await Pedido.create(
      {
        descripcion,
        total,
        usuarioId: usuario.id,
      },
      { transaction: transaccion }
    );

    // Permite comprobar que ambas operaciones se deshacen.
    if (simularError) {
      throw new Error("Error simulado para comprobar el rollback");
    }

    return { usuario, pedido };
  });
};