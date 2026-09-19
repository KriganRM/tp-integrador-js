import { body } from "express-validator";
import { validarUsuario } from "./usuarioValidaciones.js";

export const validarUsuarioConPedido = [
  ...validarUsuario,

  body("descripcion")
    .isString().withMessage("La descripción debe ser un texto").bail()
    .trim()
    .notEmpty().withMessage("La descripción es obligatoria").bail()
    .isLength({ max: 200 }).withMessage("La descripción admite hasta 200 caracteres"),

  // No convierte cadenas a números: el cliente debe enviar un número JSON.
  body("total")
    .custom((total) => typeof total === "number" && Number.isFinite(total))
    .withMessage("El total debe ser un número válido").bail()
    .custom((total) => total >= 0 && total <= 99999999.99)
    .withMessage("El total debe estar entre 0 y 99999999.99").bail()
    .custom((total) => Math.abs(total * 100 - Math.round(total * 100)) < 0.00001)
    .withMessage("El total admite hasta dos decimales"),

  // Si se omite, el controlador mantiene el valor false por defecto.
  body("simularError")
    .optional()
    .custom((valor) => typeof valor === "boolean")
    .withMessage("simularError debe ser true o false, sin comillas"),
];
