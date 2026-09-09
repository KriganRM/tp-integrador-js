// Importa el módulo fs para trabajar con archivos.
import fs from "fs";

// Agrega un nuevo registro al archivo log.txt.
export const guardarRegistro = (registro, callback) => {
  fs.appendFile("./logs/log.txt", registro, "utf8", callback);
};