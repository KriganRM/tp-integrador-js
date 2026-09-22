// Importa las funciones para validar el cuerpo y los parámetros.
import { body, param } from "express-validator";

// Valida los datos para crear o actualizar un pedido.
export const validarPedido = [
  body("descripcion")
    .isString()
    .withMessage("La descripción debe ser un texto")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("La descripción es obligatoria")
    .bail()
    .isLength({ max: 200 })
    .withMessage("La descripción admite hasta 200 caracteres"),

  body("total")
    .custom((total) => typeof total === "number" && Number.isFinite(total))
    .withMessage("El total debe ser un número válido")
    .bail()
    .custom((total) => total >= 0 && total <= 99999999.99)
    .withMessage("El total debe estar entre 0 y 99999999.99")
    .bail()
    .custom(
      (total) =>
        Math.abs(total * 100 - Math.round(total * 100)) < 0.00001
    )
    .withMessage("El total admite hasta dos decimales"),

  body("usuarioId")
    .isInt({ min: 1, max: 2147483647 })
    .withMessage("El usuarioId debe ser un entero positivo válido")
    .toInt(),
];

// Valida el identificador del pedido recibido en la ruta.
export const validarIdPedido = [
  param("id")
    .isInt({ min: 1, max: 2147483647 })
    .withMessage("El ID debe ser un entero entre 1 y 2147483647"),
];