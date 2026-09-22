// Importa los modelos con sus relaciones configuradas.
import { Usuario, Rol } from "../models/index.js";

// Crea un rol.
export const crearRol = async (nombre) => {
    return await Rol.create({ nombre });
};

// Asocia un rol existente a un usuario.
export const asignarRol = async (usuarioId, rolId) => {
    const usuario = await Usuario.findByPk(usuarioId);

    if (!usuario) {
        return { error: "Usuario no encontrado" };
    }

    const rol = await Rol.findByPk(rolId);

    if (!rol) {
        return { error: "Rol no encontrado" };
    }

    // Asocia el rol al usuario mediante la tabla intermedia.
    await usuario.addRoles([rol]);

    return {
        usuarioId: usuario.id,
        rolId: rol.id,
    };
};

// Consulta un usuario junto con sus roles.
export const obtenerUsuarioConRoles = async (usuarioId) => {
    return await Usuario.findByPk(usuarioId, {
        attributes: ["id", "nombre", "email"],
        include: [
            {
                model: Rol,
                as: "roles",
                attributes: ["id", "nombre"],
                through: {
                    attributes: [],
                },
            },
        ],
    });
};