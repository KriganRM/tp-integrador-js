// Importa los modelos.
import Usuario from "./Usuario.js";
import Pedido from "./Pedido.js";
import Perfil from "./Perfil.js";
import Rol from "./Rol.js";

// Un usuario puede tener muchos pedidos.
Usuario.hasMany(Pedido, {
  foreignKey: "usuarioId",
  as: "pedidos",
  onDelete: "RESTRICT",
});

// Cada pedido pertenece a un usuario.
Pedido.belongsTo(Usuario, {
  foreignKey: "usuarioId",
  as: "usuario",
  onDelete: "RESTRICT",
});

// Un usuario puede tener un único perfil.
Usuario.hasOne(Perfil, {
  foreignKey: "usuarioId",
  as: "perfil",
  onDelete: "CASCADE",
});

// Cada perfil pertenece a un usuario.
Perfil.belongsTo(Usuario, {
  foreignKey: "usuarioId",
  as: "usuario",
  onDelete: "CASCADE",
});

// Un usuario puede tener varios roles.
Usuario.belongsToMany(Rol, {
  through: "usuarios_roles",
  foreignKey: "usuarioId",
  otherKey: "rolId",
  as: "roles",
});

// Un rol puede pertenecer a varios usuarios.
Rol.belongsToMany(Usuario, {
  through: "usuarios_roles",
  foreignKey: "rolId",
  otherKey: "usuarioId",
  as: "usuarios",
});

// Exporta los modelos con sus relaciones configuradas.
export { Usuario, Pedido, Perfil, Rol };