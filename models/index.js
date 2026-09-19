// Importa los modelos.
import Usuario from "./Usuario.js";
import Pedido from "./Pedido.js";

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

// Exporta los modelos con sus relaciones configuradas.
export { Usuario, Pedido };