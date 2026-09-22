import fileUpload from "express-fileupload";


// Recibe un archivo de hasta 2 MB por petición.
export const recibirArchivo = fileUpload({
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 1,
  },
  abortOnLimit: true,

  // Responde cuando el archivo supera el tamaño permitido.
  limitHandler: (req, res) => {
    return res.status(413).json({
      status: "error",
      message: "El archivo no puede superar los 2 MB",
      data: null,
    });
  },
});


// Valida que se reciba un archivo con una extensión permitida.
export const validarArchivo = (req, res, next) => {
  const archivo = req.files?.archivo;

  if (!archivo || Array.isArray(archivo)) {
    return res.status(400).json({
      status: "error",
      message: "Debes enviar una imagen en el campo archivo",
      data: null,
    });
  }

  // Obtiene la extensión en minúsculas.
  const nombre = archivo.name;
  const extension = nombre.split(".").pop().toLowerCase();

  const extensionesValidas = ["png", "jpg", "jpeg"];

  if (!extensionesValidas.includes(extension)) {
    return res.status(400).json({
      status: "error",
      message: "Solo se permiten imágenes JPG o PNG",
      data: null,
    });
  }

  next();
};