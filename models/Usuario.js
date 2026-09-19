// Importa los tipos de datos de Sequelize.
import { DataTypes } from "sequelize";

// Importa la conexión configurada.
import sequelize from "../config/db.js";

// Define el modelo Usuario.
const Usuario = sequelize.define(
  "Usuario",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
  },
  {
    tableName: "usuarios",
    timestamps: true,
  }
);

export default Usuario;