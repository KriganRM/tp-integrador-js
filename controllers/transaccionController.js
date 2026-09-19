import {
  crearUsuarioConPedido as crearUsuarioConPedidoService,
} from "../services/transaccionService.js";

export const crearUsuarioConPedido = async (req, res) => {
  try {
    // Obtiene los datos enviados por el cliente.
    const {
      nombre,
      email,
      descripcion,
      total,
      simularError = false,
    } = req.body ?? {};

    // Ejecuta la transacción.
    const resultado = await crearUsuarioConPedidoService(
      nombre,
      email,
      descripcion,
      total,
      simularError
    );

    // El servicio retorna después de completar el COMMIT.
    console.log("COMMIT: usuario y pedido guardados correctamente");

    return res.status(201).json({
      status: "success",
      message: "Usuario y pedido creados correctamente",
      data: resultado,
    });
  } catch (error) {
    // Sequelize deshace la transacción si falla una operación.
    console.error("Error en la transacción:", error.message);

    if (error.message === "Error simulado para comprobar el rollback") {
      console.log("ROLLBACK: se deshicieron el usuario y el pedido");

      return res.status(500).json({
        status: "error",
        message: "Error simulado: se deshicieron el usuario y el pedido",
        data: null,
      });
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        status: "error",
        message: "El email ya está registrado",
        data: null,
      });
    }

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        status: "error",
        message: error.errors.map((detalle) => detalle.message).join(", "),
        data: null,
      });
    }

    return res.status(500).json({
      status: "error",
      message: "No se pudo completar la creación del usuario y su pedido",
      data: null,
    });
  }
};