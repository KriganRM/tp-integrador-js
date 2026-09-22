// Importa las funciones para validar campos, parámetros y consultas.
import { body, param, query } from "express-validator";

// Se reutiliza para crear y actualizar usuarios, y en la transacción.
// bail() detiene la cadena del campo cuando falla una regla.
export const validarUsuario = [
  body("nombre")
    .isString().withMessage("El nombre debe ser un texto").bail()
    .trim()
    .notEmpty().withMessage("El nombre es obligatorio").bail()
    .isLength({ max: 100 }).withMessage("El nombre admite hasta 100 caracteres"),

  body("email")
    .isString().withMessage("El email debe ser un texto").bail()
    .trim()
    .notEmpty().withMessage("El email es obligatorio").bail()
    .isLength({ max: 150 }).withMessage("El email admite hasta 150 caracteres").bail()
    .isEmail().withMessage("El email debe tener un formato válido")
    .customSanitizer((email) => email.toLowerCase()),
];


// El ID se almacena como INTEGER en PostgreSQL.
export const validarIdUsuario = [
  param("id")
    .isInt({ min: 1, max: 2147483647 })
    .withMessage("El ID debe ser un entero entre 1 y 2147483647"),
];


// Valida el filtro opcional de búsqueda por nombre.
export const validarFiltroUsuarios = [
  query("nombre")
    .optional()
    .isString()
    .withMessage("El nombre de búsqueda debe ser un texto")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("El nombre de búsqueda no puede estar vacío")
    .bail()
    .isLength({ max: 100 })
    .withMessage("El nombre de búsqueda admite hasta 100 caracteres"),
];