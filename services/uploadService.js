// Importa path para construir las rutas de los archivos.
import path from "path";

// Permite convertir la URL del archivo actual en una ruta.
import { fileURLToPath } from "url";

// Permite generar un identificador único para cada archivo.
import { randomUUID } from "crypto";

// Obtiene la ruta del archivo actual y la carpeta que lo contiene.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Guarda el archivo con un nombre único.
export const guardarArchivo = async (archivo) => {
  const extension = archivo.name.split(".").pop().toLowerCase();
  const nombreArchivo = `${randomUUID()}.${extension}`;

  // Sale de services y entra en la carpeta uploads.
  const rutaArchivo = path.join(__dirname, "..", "uploads", nombreArchivo);

  await archivo.mv(rutaArchivo);

  return {
    nombre: nombreArchivo,
    url: `/uploads/${nombreArchivo}`,
  };
};