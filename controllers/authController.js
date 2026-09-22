import jwt from "jsonwebtoken";

import {
  registrarUsuario as registrarUsuarioService,
  iniciarSesion as iniciarSesionService,
} from "../services/authService.js";


// Controlador para registrar un usuario.
export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body ?? {};

    const usuario = await registrarUsuarioService(
      nombre,
      email,
      password
    );

    return res.status(201).json({
      status: "success",
      message: "Usuario registrado correctamente",
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
        message: error.errors
          .map((detalle) => detalle.message)
          .join(", "),
        data: null,
      });
    }

    console.error("Error al registrar usuario:", error.message);

    return res.status(500).json({
      status: "error",
      message: "No se pudo registrar el usuario",
      data: null,
    });
  }
};


// Controlador para iniciar sesión y generar un token.
export const iniciarSesion = async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    const usuario = await iniciarSesionService(email, password);

    if (!usuario) {
      return res.status(401).json({
        status: "error",
        message: "Correo o contraseña incorrectos",
        data: null,
      });
    }

    // Incluye el identificador del usuario en el token.
    const payload = {
      id: usuario.id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      status: "success",
      message: "Inicio de sesión exitoso",
      data: {
        usuario,
        token,
      },
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error.message);

    return res.status(500).json({
      status: "error",
      message: "No se pudo iniciar sesión",
      data: null,
    });
  }
};