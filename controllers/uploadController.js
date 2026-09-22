// Importa el servicio encargado de guardar el archivo.
import { guardarArchivo } from "../services/uploadService.js";

// Controlador para subir un archivo.
export const subirArchivo = async (req, res) => {
  try {
    const archivo = req.files.archivo;

    const resultado = await guardarArchivo(archivo);

    return res.status(201).json({
      status: "success",
      message: "Archivo subido correctamente",
      data: resultado,
    });
  } catch (error) {
    console.error("Error al subir archivo:", error.message);

    return res.status(500).json({
      status: "error",
      message: "No se pudo guardar el archivo",
      data: null,
    });
  }
};