import { Usuario } from "../models/index.js";

// Registra un usuario con los datos recibidos.
export const registrarUsuario = async (nombre, email, password) => {
  const usuario = await Usuario.create({
    nombre,
    email,
    password,
  });

  // Devuelve los datos del usuario sin incluir la contraseña.
  return {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
  };
};


// Comprueba las credenciales para iniciar sesión.
export const iniciarSesion = async (email, password) => {
  const usuario = await Usuario.findOne({
    where: { email },
  });

  // Rechaza usuarios inexistentes o sin contraseña.
  if (!usuario || !usuario.password) {
    return null;
  }

  // Compara la contraseña recibida con la guardada.
  if (password !== usuario.password) {
    return null;
  }

  // Devuelve los datos del usuario sin la contraseña.
  return {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
  };
};