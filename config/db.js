// Carga las variables del archivo .env.
import "dotenv/config";

// Importa Sequelize.
import { Sequelize } from "sequelize";

// Configura la conexión usando la URL del archivo .env.
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
});

// Exporta la instancia para utilizarla en otros archivos.
export default sequelize;