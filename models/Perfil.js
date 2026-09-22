// Importa los tipos de datos de Sequelize.
import { DataTypes } from "sequelize";

// Importa la conexión configurada.
import sequelize from "../config/db.js";

// Define el perfil asociado a un usuario.
const Perfil = sequelize.define(
  "Perfil",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    telefono: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    direccion: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "perfiles",
    timestamps: true,
  }
);

export default Perfil;