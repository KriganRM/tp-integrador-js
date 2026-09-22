import { body } from "express-validator";
import { validarUsuario } from "./usuarioValidaciones.js";

// Valida los datos para registrar un usuario.
export const validarRegistro = [
  // Reutiliza las validaciones de nombre y correo.
  ...validarUsuario,

  body("password")
    .isString()
    .withMessage("La contraseña debe ser un texto")
    .bail()
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .bail()
    .isLength({ min: 6, max: 100 })
    .withMessage("La contraseña debe tener entre 6 y 100 caracteres"),
];

// Valida el correo y la contraseña para iniciar sesión.
export const validarLogin = [
  body("email")
    .isString()
    .withMessage("El email debe ser un texto")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("El email es obligatorio")
    .bail()
    .isEmail()
    .withMessage("El email debe tener un formato válido")
    .bail()
    .customSanitizer((email) => email.toLowerCase()),

  body("password")
    .isString()
    .withMessage("La contraseña debe ser un texto")
    .bail()
    .notEmpty()
    .withMessage("La contraseña es obligatoria"),
];