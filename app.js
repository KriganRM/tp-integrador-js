// Importa Express para crear el servidor web.
import express from "express";

// Importa Dotenv para utilizar las variables del archivo .env.
import dotenv from "dotenv";

// Importa las rutas públicas.
import mainRoutes from "./routes/mainRoutes.js";

// Carga las variables de entorno.
dotenv.config();

// Crea la aplicación de Express.
const app = express();

// Permite servir los archivos estáticos almacenados en public.
app.use(express.static("public"));

// Conecta las rutas públicas con la aplicación.
app.use("/", mainRoutes);

// Obtiene el puerto desde .env o utiliza 3000 si no está definido.
const PORT = process.env.PORT || 3000;

// Inicia el servidor.
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});