// Importa los servicios de pedidos con alias.
import {
  crearPedido as crearPedidoService,
  obtenerPedidos as obtenerPedidosService,
  obtenerPedidoPorId as obtenerPedidoPorIdService,
  actualizarPedido as actualizarPedidoService,
  eliminarPedido as eliminarPedidoService,
} from "../services/pedidoService.js";

// Controlador para crear un pedido.
export const crearPedido = async (req, res) => {
  try {
    const { descripcion, total, usuarioId } = req.body ?? {};

    const pedido = await crearPedidoService(
      descripcion,
      total,
      usuarioId
    );

    if (!pedido) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado",
        data: null,
      });
    }

    return res.status(201).json({
      status: "success",
      message: "Pedido creado correctamente",
      data: pedido,
    });
  } catch (error) {
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

    console.error("Error al crear pedido:", error.message);

    return res.status(500).json({
      status: "error",
      message: "No se pudo crear el pedido",
      data: null,
    });
  }
};

// Controlador para listar pedidos.
export const obtenerPedidos = async (req, res) => {
  try {
    const pedidos = await obtenerPedidosService();

    return res.status(200).json({
      status: "success",
      message: "Pedidos obtenidos correctamente",
      data: pedidos,
    });
  } catch (error) {
    console.error("Error al obtener pedidos:", error.message);

    return res.status(500).json({
      status: "error",
      message: "No se pudieron obtener los pedidos",
      data: null,
    });
  }
};

// Controlador para consultar un pedido.
export const obtenerPedidoPorId = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const pedido = await obtenerPedidoPorIdService(id);

    if (!pedido) {
      return res.status(404).json({
        status: "error",
        message: "Pedido no encontrado",
        data: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Pedido obtenido correctamente",
      data: pedido,
    });
  } catch (error) {
    console.error("Error al consultar pedido:", error.message);

    return res.status(500).json({
      status: "error",
      message: "No se pudo consultar el pedido",
      data: null,
    });
  }
};

// Controlador para actualizar un pedido.
export const actualizarPedido = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { descripcion, total, usuarioId } = req.body ?? {};

    const resultado = await actualizarPedidoService(
      id,
      descripcion,
      total,
      usuarioId
    );

    if (resultado.error) {
      return res.status(404).json({
        status: "error",
        message: resultado.error,
        data: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Pedido actualizado correctamente",
      data: resultado.pedido,
    });
  } catch (error) {
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

    console.error("Error al actualizar pedido:", error.message);

    return res.status(500).json({
      status: "error",
      message: "No se pudo actualizar el pedido",
      data: null,
    });
  }
};

// Controlador para eliminar un pedido.
export const eliminarPedido = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const pedido = await eliminarPedidoService(id);

    if (!pedido) {
      return res.status(404).json({
        status: "error",
        message: "Pedido no encontrado",
        data: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Pedido eliminado correctamente",
      data: {
        id: pedido.id,
      },
    });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(409).json({
        status: "error",
        message: "No se puede eliminar el pedido porque tiene registros asociados",
        data: null,
      });
    }

    console.error("Error al eliminar pedido:", error.message);

    return res.status(500).json({
      status: "error",
      message: "No se pudo eliminar el pedido",
      data: null,
    });
  }
};