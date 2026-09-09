// Muestra el contenido HTML de la ruta principal.
export const mostrarInicio = (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>TP Integrador JavaScript</title>
        <link rel="stylesheet" href="/css/style.css">
      </head>

      <body>
        <main>
          <h1>TP Integrador JavaScript</h1>
          <p>Servidor desarrollado con Node.js y Express.</p>
        </main>
      </body>
    </html>
  `);
};

// Muestra el estado del servidor en formato JSON.
export const mostrarEstado = (req, res) => {
  res.json({
    status: "success",
    message: "El servidor está funcionando correctamente",
    data: {
      service: "Gestión de usuarios",
    },
  });
};