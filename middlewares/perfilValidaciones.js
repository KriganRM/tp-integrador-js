// Importa body para validar los datos recibidos.
import { body } from "express-validator";

// Valida los datos para crear el perfil de un usuario.
export const validarPerfil = [
  body("telefono")
    .isString()
    .withMessage("El teléfono debe ser un texto")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("El teléfono es obligatorio")
    .bail()
    .isLength({ max: 20 })
    .withMessage("El teléfono admite hasta 20 caracteres"),

  body("direccion")
    .isString()
    .withMessage("La dirección debe ser un texto")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("La dirección es obligatoria")
    .bail()
    .isLength({ max: 200 })
    .withMessage("La dirección admite hasta 200 caracteres"),
];