// Importa las funciones para validar campos y parámetros.
import { body, param } from "express-validator";

// Valida el nombre al crear un rol.
export const validarRol = [
  body("nombre")
    .isString()
    .withMessage("El nombre del rol debe ser un texto")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("El nombre del rol es obligatorio")
    .bail()
    .isLength({ max: 50 })
    .withMessage("El nombre del rol admite hasta 50 caracteres"),
];

// Valida el identificador del rol que se asociará al usuario.
export const validarIdRol = [
  param("rolId")
    .isInt({ min: 1, max: 2147483647 })
    .withMessage("El ID del rol debe ser un entero entre 1 y 2147483647"),
];