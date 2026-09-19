// Importa Express para crear el servidor web.
import express from "express";

// Importa Dotenv para utilizar las variables del archivo .env.
import dotenv from "dotenv";

// Importa las rutas públicas.
import mainRoutes from "./routes/mainRoutes.js";

// Importa las rutas de usuarios.
import usuarioRoutes from "./routes/usuarioRoutes.js";

// Importa la ruta de usuario con pedidos.
import transaccionRoutes from "./routes/transaccionRoutes.js";

// Importa la instancia de Sequelize.
import sequelize from "./config/db.js";

// Registra los modelos y sus relaciones en Sequelize.
import "./models/index.js";

// Carga las variables de entorno.
dotenv.config();

// Crea la aplicación de Express.
const app = express();

// Permite leer los datos enviados en formato JSON.
app.use(express.json());

// Permite servir los archivos estáticos almacenados en public.
app.use(express.static("public"));

// Conecta las rutas públicas con la aplicación.
app.use("/", mainRoutes);

// Conecta las rutas de usuarios con la aplicación.
app.use("/usuarios", usuarioRoutes);

// Conecta la ruta de usuario con pedidos a la aplicación.
app.use("/transacciones", transaccionRoutes);

// Obtiene el puerto desde .env o utiliza 3000 si no está definido.
const PORT = process.env.PORT || 3000;

try {
  // Comprueba la conexión con la base de datos.
  await sequelize.authenticate();
  console.log("Conexión a PostgreSQL exitosa");

  // Crea las tablas de los modelos registrados si no existen.
  await sequelize.sync();
  console.log("Tablas sincronizadas correctamente");

  // Inicia el servidor.
  app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
  });
} catch (error) {
  console.error("Error al iniciar la aplicación:", error.message);
}