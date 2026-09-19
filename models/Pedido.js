// Importa los tipos de datos de Sequelize.
import { DataTypes } from "sequelize";

// Importa la conexión configurada.
import sequelize from "../config/db.js";

// Define el modelo Pedido.
const Pedido = sequelize.define(
  "Pedido",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    descripcion: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },

    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "pedidos",
    timestamps: true,
  }
);

export default Pedido;