// Importa los tipos de datos de Sequelize.
import { DataTypes } from "sequelize";

// Importa la conexión configurada.
import sequelize from "../config/db.js";

// Define los roles que pueden asociarse a los usuarios.
const Rol = sequelize.define(
  "Rol",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    tableName: "roles",
    timestamps: true,
  }
);

export default Rol;