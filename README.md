# TP Integrador JavaScript — Módulos 6 y 7

Aplicación backend desarrollada por Richard Salazar con Node.js, Express, PostgreSQL y Sequelize para gestionar usuarios y registrar pedidos relacionados.

## Alcance implementado

- Página principal HTML con CSS y ruta de estado en JSON.
- Registro de visitas a `/` y `/status` mediante archivos planos.
- Conexión a PostgreSQL mediante variables de entorno.
- CRUD completo de usuarios.
- Validación de peticiones con express-validator.
- Modelos Usuario y Pedido relacionados mediante una asociación 1:N.
- Consulta de un usuario con sus pedidos usando `include`.
- Creación de un usuario y su primer pedido dentro de una transacción.
- Simulación de error para comprobar rollback.
- Comparación de consultas SQL manuales con consultas ORM.

El CRUD completo de pedidos, las relaciones 1:1 y N:M, los filtros generales, la autenticación JWT y la subida de archivos no están implementados en esta versión. La parte específica del módulo 7 incluye una relación 1:N; los requisitos generales del proyecto completo contemplan funcionalidades adicionales.

## Requisitos y tecnologías

- Node.js 18 o superior y npm.
- PostgreSQL instalado y en ejecución.
- Express, Sequelize, pg, pg-hstore, dotenv y express-validator.
- Nodemon para desarrollo.
- Postman para probar las rutas; pgAdmin para comprobar los registros.

## Instalación

```bash
git clone https://github.com/KriganRM/tp-integrador-js.git
cd tp-integrador-js
npm install
```

Crear una base de datos PostgreSQL llamada `tp_integrador_js`. En pgAdmin se puede usar Create → Database o ejecutar lo siguiente desde otra base existente:

```sql
CREATE DATABASE tp_integrador_js;
```

Copiar `.env.example` como `.env` en la raíz. En PowerShell:

```powershell
Copy-Item .env.example .env
```

Completar el archivo con las credenciales locales:

```env
PORT=3000
DATABASE_URL=postgres://TU_USUARIO:TU_PASSWORD@localhost:5432/tp_integrador_js
```

Si el usuario o la contraseña contienen caracteres especiales de una URL, deben codificarse para usarlos en `DATABASE_URL`. El archivo `.env` está excluido de Git mediante `.gitignore`; `.env.example` contiene solamente valores de ejemplo.

Iniciar el servidor:

```bash
npm run dev
```

También se puede ejecutar sin Nodemon:

```bash
npm start
```

Al iniciar, `authenticate()` verifica la conexión y `sync()` crea las tablas que aún no existen. Se utiliza sin `force` ni `alter`: no borra tablas ni actualiza automáticamente la estructura de tablas existentes. La base de datos debe crearse antes de iniciar la aplicación.

Los registros de prueba no se cargan automáticamente; se crean con las peticiones descritas abajo.

## Organización

| Carpeta o archivo | Responsabilidad |
| --- | --- |
| `app.js` | Configura Express, registra rutas e inicia la aplicación. |
| `config/db.js` | Configura la instancia de Sequelize. |
| `models/Usuario.js`, `models/Pedido.js` | Definen campos y validaciones de los modelos. |
| `models/index.js` | Define las relaciones y exporta los modelos. |
| `routes/` | Define las direcciones y el orden de los middlewares. |
| `controllers/` | Llama a servicios y genera respuestas HTTP. |
| `services/` | Contiene consultas, transacciones y escritura de logs. |
| `middlewares/usuarioValidaciones.js` | Valida los datos de usuarios y los ID. |
| `middlewares/transaccionValidaciones.js` | Valida los datos de usuario y pedido. |
| `middlewares/manejarValidaciones.js` | Responde 400 cuando hay errores de entrada. |
| `middlewares/visitLogger.js` | Registra visitas a las rutas públicas configuradas. |
| `public/css/style.css` | Estilos de la página principal. |
| `logs/log.txt` | Historial de visitas. |
| `Capturas/` | Evidencias de las pruebas manuales. |

Las peticiones de escritura pasan por las reglas de validación y el middleware que recoge los errores antes de llegar al controlador. Si son válidas, el controlador llama al servicio y este consulta la base de datos mediante los modelos.

## Modelos y relación

`Usuario` contiene `id`, `nombre`, `email`, `createdAt` y `updatedAt`. El correo es único y debe tener un formato válido.

`Pedido` contiene `id`, `descripcion`, `total`, `usuarioId`, `createdAt` y `updatedAt`. El total se almacena como `DECIMAL(10,2)`; puede aparecer como texto en el JSON para conservar la precisión decimal.

Un usuario tiene muchos pedidos mediante `hasMany`; cada pedido pertenece a un usuario mediante `belongsTo`. La clave foránea es `usuarioId`. Los alias son `pedidos` y `usuario`.

La opción `onDelete: "RESTRICT"` impide eliminar usuarios con pedidos asociados. El controlador responde 409 ante ese conflicto, incluyendo el caso de PostgreSQL con código `23001`.

## Rutas

Dirección base: `http://localhost:3000`.

| Método | Ruta | Función |
| --- | --- | --- |
| GET | `/` | Página principal. |
| GET | `/status` | Estado del servidor Express. |
| POST | `/usuarios` | Crear un usuario. |
| GET | `/usuarios` | Listar usuarios con Sequelize. |
| GET | `/usuarios/sql` | Listar usuarios con SQL manual. |
| PUT | `/usuarios/:id` | Actualizar nombre y correo. |
| DELETE | `/usuarios/:id` | Eliminar un usuario sin pedidos. |
| GET | `/usuarios/:id/pedidos` | Consultar un usuario y sus pedidos. |
| POST | `/transacciones/usuario-con-pedido` | Crear un usuario nuevo y su primer pedido. |

Las rutas de datos responden con la estructura:

```json
{
  "status": "success",
  "message": "Descripción del resultado",
  "data": {}
}
```

En errores controlados, `status` vale `error` y `data` es `null`. Se utilizan 200 para consultas y modificaciones exitosas, 201 para creaciones, 400 para entrada inválida, 404 para usuarios inexistentes, 409 para conflictos y 500 para errores inesperados o la simulación de rollback. Los errores de JSON mal formado del parser de Express no tienen un middleware propio que unifique su formato.

## Pruebas con Postman

Para POST y PUT seleccionar Body → raw → JSON. Para GET y DELETE seleccionar Body → none. El servidor debe estar ejecutándose.

### Crear tres usuarios

Enviar cada objeto por separado a `POST /usuarios`:

```json
{"nombre":"Richard","email":"richard@example.com"}
```

```json
{"nombre":"Camila","email":"camila@example.com"}
```

```json
{"nombre":"Diego","email":"diego@example.com"}
```

Cada creación válida responde 201. Si el correo ya existe responde 409. Ejecutar `GET /usuarios` para obtener la lista y los ID reales.

### Actualizar un usuario

Enviar a `PUT /usuarios/ID_REAL`:

```json
{"nombre":"Richard Salazar","email":"richard@example.com"}
```

Se deben enviar ambos campos. Solo se permite modificar nombre y correo; el ID no cambia y Sequelize gestiona las fechas. Si se envían exactamente los mismos datos, puede no cambiar `updatedAt` porque no hay una modificación efectiva.

Para comprobar 404, repetir con un ID válido que no exista.

### Eliminar un usuario

Crear un usuario temporal con un correo nuevo y luego enviar `DELETE /usuarios/ID_TEMPORAL`. La respuesta esperada es 200. Repetir el DELETE debe responder 404. Esto permite conservar los tres usuarios de prueba.

### Transacción exitosa

Enviar a `POST /transacciones/usuario-con-pedido`:

```json
{
  "nombre":"Valentina",
  "email":"valentina@example.com",
  "descripcion":"Primera compra",
  "total":25000,
  "simularError":false
}
```

La respuesta esperada es 201 con el usuario y el pedido. El `usuarioId` del pedido coincide con el ID del nuevo usuario. Usar un correo nuevo en cada repetición exitosa.

`sequelize.transaction(callback)` administra la transacción. Ambas creaciones reciben la misma opción `transaction`. Si el callback termina correctamente se ejecuta COMMIT; si lanza un error se ejecuta ROLLBACK. El controlador registra el resultado en consola.

### Prueba de rollback

Enviar a la misma ruta:

```json
{
  "nombre":"Prueba Rollback",
  "email":"rollback@example.com",
  "descripcion":"Pedido que no debe guardarse",
  "total":10000,
  "simularError":true
}
```

Con datos válidos y un correo no registrado, el servicio provoca un error después de crear ambos registros dentro de la transacción. La respuesta 500 es intencional. Comprobar en pgAdmin, una consulta a la vez:

```sql
SELECT * FROM usuarios WHERE email = 'rollback@example.com';
```

```sql
SELECT * FROM pedidos WHERE descripcion = 'Pedido que no debe guardarse';
```

Ambas consultas deben devolver cero filas si esos datos no existían previamente. Los valores de secuencias autoincrementales pueden consumirse incluso con rollback, por lo que los saltos de ID son normales.

### Consultar relaciones y proteger pedidos

Ejecutar `GET /usuarios/ID_VALENTINA/pedidos`. Se obtiene el usuario con una lista `pedidos` mediante `include`.

Intentar `DELETE /usuarios/ID_VALENTINA` debe responder 409 porque tiene pedidos. Repetir el GET permite comprobar que ambos registros siguen presentes.

### Comparar SQL manual y ORM

Comparar `GET /usuarios` y `GET /usuarios/sql` sin modificar datos entre las consultas. Ambas rutas seleccionan los mismos campos y ordenan por ID ascendente; el contenido de `data` debe coincidir.

La primera utiliza `Usuario.findAll()`. La segunda usa un SELECT escrito manualmente mediante `sequelize.query()` y `QueryTypes.SELECT`.

### Validaciones con express-validator

Enviar a `POST /usuarios`:

```json
{"nombre":"Prueba","email":"correo-invalido"}
```

Debe responder 400 con un mensaje de correo inválido. También se rechazan campos vacíos, tipos incorrectos, longitudes superiores a las columnas, ID inválidos, total negativo o fuera del rango permitido y `simularError` que no sea booleano.

Se aplica `trim()` a los textos y se convierte el correo a minúsculas. El total debe ser un número JSON de hasta dos decimales; `simularError` debe ser `true` o `false` sin comillas. PUT sigue requiriendo nombre y correo.

Los controladores conservan el manejo de errores de base de datos. Las validaciones del modelo también se mantienen como una segunda capa.

## Decisiones técnicas y aprendizaje

Elegí PostgreSQL y Sequelize porque permiten trabajar con datos relacionados utilizando modelos de JavaScript. El paquete pg proporciona el controlador de PostgreSQL que utiliza Sequelize. Las credenciales se configuran en variables de entorno y no se incluyen en el repositorio.

Separé rutas, controladores y servicios para identificar la responsabilidad de cada archivo. Incorporé express-validator en middlewares para evitar repetir validaciones en los controladores.

Solo permití actualizar nombre y correo para evitar cambios accidentales en el identificador y las fechas. Validé tipos, contenido, formato del correo, longitudes y valores numéricos; también manejé usuarios inexistentes y correos duplicados.

El ORM simplificó operaciones como crear registros, buscar por ID y traer relaciones. La consulta SQL manual permitió comprobar que ambos enfoques consultan la misma información y entender qué consulta se ejecuta.

La transacción permitió comprender que crear un usuario y un pedido puede tratarse como una sola operación: ambos registros se confirman juntos o se deshacen si ocurre un error. La prueba de rollback se verificó consultando las dos tablas.

## Evidencias y entrega

La carpeta `Capturas` contiene evidencias de las rutas públicas, CRUD, validaciones, transacción exitosa, rollback, relaciones, consultas ORM y SQL y restricción de eliminación.

La entrega del módulo 7 requiere actualizar el repositorio GitHub y organizar las capturas en la subcarpeta de Google Drive `Parte 2 – Módulo 7`. La actualización de este README no sustituye esos pasos.
