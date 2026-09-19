// Importa la función del servicio con un alias.
import {
  crearUsuario as crearUsuarioService,
  obtenerUsuarios as obtenerUsuariosService,
  actualizarUsuario as actualizarUsuarioService,
  eliminarUsuario as eliminarUsuarioService,
  obtenerUsuarioConPedidos as obtenerUsuarioConPedidosService,
  obtenerUsuariosSQL as obtenerUsuariosSQLService,
} from "../services/usuarioService.js";

// Controlador para crear un usuario.
export const crearUsuario = async (req, res) => {
  try {
    // Obtiene los datos enviados por el cliente.
    const { nombre, email } = req.body ?? {};

    // Llama al servicio para guardar el usuario.
    const usuario = await crearUsuarioService(
      nombre,
      email
    );

    // Responde con el usuario creado.
    return res.status(201).json({
      status: "success",
      message: "Usuario creado correctamente",
      data: usuario,
    });
  } catch (error) {
    // Maneja un correo que ya está registrado.
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        status: "error",
        message: "El email ya está registrado",
        data: null,
      });
    }

    // Maneja errores de validación del modelo.
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        status: "error",
        message: error.errors.map((detalle) => detalle.message).join(", "),
        data: null,
      });
    }

    // Registra errores inesperados en la consola.
    console.error("Error al crear usuario:", error.message);

    return res.status(500).json({
      status: "error",
      message: "No se pudo crear el usuario",
      data: null,
    });
  }
};

// Controlador para listar usuarios.
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await obtenerUsuariosService();

    return res.status(200).json({
      status: "success",
      message: "Usuarios obtenidos correctamente",
      data: usuarios,
    });
  } catch (error) {
    console.error("Error al obtener usuarios:", error.message);

    return res.status(500).json({
      status: "error",
      message: "No se pudieron obtener los usuarios",
      data: null,
    });
  }
};

// Controlador para actualizar un usuario.
export const actualizarUsuario = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nombre, email } = req.body ?? {};

    const usuario = await actualizarUsuarioService(
      id,
      nombre,
      email
    );

    // Comprueba si el usuario existe.
    if (!usuario) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado",
        data: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Usuario actualizado correctamente",
      data: usuario,
    });
  } catch (error) {
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

    console.error("Error al actualizar usuario:", error.message);

    return res.status(500).json({
      status: "error",
      message: "No se pudo actualizar el usuario",
      data: null,
    });
  }
};

// Controlador para eliminar un usuario.
export const eliminarUsuario = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const usuario = await eliminarUsuarioService(id);

    // Comprueba si el usuario existe.
    if (!usuario) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado",
        data: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Usuario eliminado correctamente",
      data: {
        id: usuario.id,
      },
    });
  } catch (error) {
    // Reconoce errores de clave foránea y restricciones RESTRICT.
    if (
      error.name === "SequelizeForeignKeyConstraintError" ||
      error.parent?.code === "23001"
    ) {
      return res.status(409).json({
        status: "error",
        message: "No se puede eliminar el usuario porque tiene pedidos asociados",
        data: null,
      });
    }

    console.error("Error al eliminar usuario:", error.message);

    return res.status(500).json({
      status: "error",
      message: "No se pudo eliminar el usuario",
      data: null,
    });
  }
};

// Consulta un usuario con sus pedidos.
export const obtenerUsuarioConPedidos = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const usuario = await obtenerUsuarioConPedidosService(id);

    if (!usuario) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado",
        data: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Usuario y pedidos obtenidos correctamente",
      data: usuario,
    });
  } catch (error) {
    console.error("Error al consultar usuario y pedidos:", error.message);

    return res.status(500).json({
      status: "error",
      message: "No se pudieron consultar el usuario y sus pedidos",
      data: null,
    });
  }
};

// Consulta usuarios utilizando SQL manual.
export const obtenerUsuariosSQL = async (req, res) => {
  try {
    const usuarios = await obtenerUsuariosSQLService();

    return res.status(200).json({
      status: "success",
      message: "Usuarios obtenidos mediante SQL manual",
      data: usuarios,
    });
  } catch (error) {
    console.error("Error al consultar usuarios con SQL:", error.message);

    return res.status(500).json({
      status: "error",
      message: "No se pudieron obtener los usuarios",
      data: null,
    });
  }
};