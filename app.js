// Importa Express para crear el servidor web.
import express from "express";

// Importa Dotenv para utilizar las variables del archivo .env.
import dotenv from "dotenv";

// Importa path para construir rutas de archivos y carpetas.
import path from "path";

// Permite convertir la URL del archivo actual en una ruta.
import { fileURLToPath } from "url";

// Importa las rutas de autenticación.
import authRoutes from "./routes/authRoutes.js";

// Importa las rutas públicas.
import mainRoutes from "./routes/mainRoutes.js";

// Importa las rutas de usuarios.
import usuarioRoutes from "./routes/usuarioRoutes.js";

// Importa las rutas de pedidos.
import pedidoRoutes from "./routes/pedidoRoutes.js";

// Importa la ruta de usuario con pedidos.
import transaccionRoutes from "./routes/transaccionRoutes.js";

// Importa las rutas de subida de archivos.
import uploadRoutes from "./routes/uploadRoutes.js";

// Importa las rutas de roles.
import rolRoutes from "./routes/rolRoutes.js";

// Importa los middlewares para rutas inexistentes y errores.
import {rutaNoEncontrada, manejarErrores} from "./middlewares/errorMiddleware.js";

// Importa la instancia de Sequelize.
import sequelize from "./config/db.js";

// Registra los modelos y sus relaciones en Sequelize.
import "./models/index.js";

// Carga las variables de entorno.
dotenv.config();

// Obtiene la ruta del archivo actual y su carpeta.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crea la aplicación de Express.
const app = express();

// Permite leer los datos enviados en formato JSON.
app.use(express.json());

// Permite servir los archivos estáticos almacenados en public.
app.use(express.static("public"));

// Permite acceder a los archivos subidos mediante su URL.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Conecta las rutas de autenticación.
app.use("/", authRoutes);

// Conecta las rutas públicas con la aplicación.
app.use("/", mainRoutes);

// Conecta las rutas de usuarios con la aplicación.
app.use("/usuarios", usuarioRoutes);

// Conecta las rutas de pedidos.
app.use("/pedidos", pedidoRoutes);

// Conecta la ruta de usuario con pedidos a la aplicación.
app.use("/transacciones", transaccionRoutes);

// Conecta la ruta de subida de archivos.
app.use("/", uploadRoutes);

// Conecta las rutas de roles.
app.use("/roles", rolRoutes);

// Maneja las peticiones que no coinciden con ninguna ruta.
app.use(rutaNoEncontrada);

// Centraliza los errores que llegan a Express.
app.use(manejarErrores);

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