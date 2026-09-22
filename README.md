# TP Integrador JavaScript — Módulos 6, 7 y 8

**Autor:** Richard Salazar.

Aplicación backend con Node.js, Express, PostgreSQL y Sequelize para gestionar usuarios, pedidos, perfiles y roles. Incluye autenticación JWT, subida de archivos, validaciones y pruebas con Postman.

## Instalación

Requisitos: Node.js 18 o superior, npm y PostgreSQL.

```bash
git clone https://github.com/KriganRM/tp-integrador-js.git
cd tp-integrador-js
npm install
```

Crear la base de datos desde pgAdmin:

```sql
CREATE DATABASE tp_integrador_js;
```

Copiar `.env.example` como `.env` y completar los valores locales:

```env
PORT=3000
DATABASE_URL=postgres://TU_USUARIO:TU_PASSWORD@localhost:5432/tp_integrador_js
JWT_SECRET=TU_SECRETO_ALEATORIO
```

Para generar el secreto:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

No subir `.env` ni `node_modules` a GitHub. Mantener solo valores de ejemplo en `.env.example`. Si las credenciales contienen caracteres especiales, codificarlos para utilizarlos en la URL.

Asegurar que existan `logs` y `uploads` en la raíz. En PowerShell:

```powershell
New-Item -ItemType Directory -Force -Path logs, uploads
```

Si se reutiliza la base del módulo 7, agregar la columna de contraseña:

```sql
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS password VARCHAR(100);
```

Iniciar desde la raíz del proyecto:

```bash
npm run dev
```

También se puede usar `npm start`. `sequelize.authenticate()` verifica la conexión y `sequelize.sync()` crea las tablas faltantes, sin borrar datos ni modificar automáticamente tablas existentes. Los datos de prueba no se cargan automáticamente.

## Organización y funcionalidades

- `routes/`: endpoints y orden de los middlewares.
- `controllers/`: respuestas HTTP y manejo de errores.
- `services/`: consultas, transacciones y guardado de archivos.
- `middlewares/`: validaciones, JWT y registro de visitas.
- `models/`: modelos y relaciones; `config/db.js`: conexión a PostgreSQL.
- `public/`, `logs/`, `uploads/` y `Capturas/`: estilos, registros, archivos y evidencias.

Se implementaron CRUD de usuarios y pedidos, búsqueda por nombre, consulta SQL manual y ORM, y creación de usuario con pedido en una transacción con COMMIT o ROLLBACK.

| Relación | Implementación |
| --- | --- |
| Usuario–Perfil, 1:1 | `hasOne`/`belongsTo`, con `usuarioId` único. |
| Usuario–Pedido, 1:N | `hasMany`/`belongsTo`; se impide borrar usuarios con pedidos. |
| Usuario–Rol, N:M | `belongsToMany` mediante `usuarios_roles`. |

El perfil se elimina junto con su usuario mediante CASCADE. Los roles permiten demostrar asociaciones múltiples; no asignan permisos a las rutas.

## Endpoints

Dirección base: `http://localhost:3000`. **JWT** indica que requiere Bearer Token.

| Método | Ruta | JWT | Función |
| --- | --- | --- | --- |
| GET | `/` | No | Página principal. |
| GET | `/status` | No | Estado del servidor. |
| POST | `/registro` | No | Registrar usuario con contraseña. |
| POST | `/login` | No | Obtener token. |
| POST | `/usuarios` | No | Crear usuario sin contraseña. |
| GET | `/usuarios` | No | Listar; filtro opcional `?nombre=prueba`. |
| GET | `/usuarios/sql` | No | Consultar mediante SQL manual. |
| PUT | `/usuarios/:id` | Sí | Actualizar nombre y correo. |
| DELETE | `/usuarios/:id` | Sí | Eliminar usuario sin pedidos. |
| GET | `/usuarios/:id/pedidos` | No | Consultar usuario y pedidos. |
| POST | `/transacciones/usuario-con-pedido` | No | Crear usuario y pedido en una transacción. |
| POST | `/pedidos` | Sí | Crear pedido. |
| GET | `/pedidos` | Sí | Listar pedidos. |
| GET | `/pedidos/:id` | Sí | Consultar pedido. |
| PUT | `/pedidos/:id` | Sí | Actualizar pedido. |
| DELETE | `/pedidos/:id` | Sí | Eliminar pedido. |
| POST | `/usuarios/:id/perfil` | Sí | Crear perfil único. |
| GET | `/usuarios/:id/perfil` | Sí | Consultar usuario y perfil. |
| POST | `/roles` | Sí | Crear rol. |
| POST | `/usuarios/:id/roles/:rolId` | Sí | Asociar rol existente. |
| GET | `/usuarios/:id/roles` | Sí | Consultar usuario y roles. |
| POST | `/upload` | Sí | Subir archivo. |
| GET | `/uploads/:nombreArchivo` | No | Acceder al archivo subido. |

Las respuestas controladas usan `status`, `message` y `data`. Códigos: **200** éxito, **201** creación, **400** datos inválidos, **401** autenticación fallida, **404** no encontrado, **409** conflicto, **413** archivo demasiado grande y **500** error inesperado o rollback simulado.

## Autenticación y ejemplos de uso

En Postman, seleccionar **Body → raw → JSON** para enviar datos. Registrar mediante POST `/registro`:

```json
{"nombre":"Prueba Registro","email":"registro8@example.com","password":"Prueba123"}
```

Iniciar sesión mediante POST `/login`:

```json
{"email":"registro8@example.com","password":"Prueba123"}
```

Copiar `data.token` en **Authorization → Bearer Token** de las peticiones protegidas. El token se conserva en Postman durante las pruebas; no se guarda en la base de datos. Dura una hora y se verifica su firma HS256 y vencimiento. Si vence, iniciar sesión nuevamente. Usuarios sin contraseña no pueden iniciar sesión.

Se protegieron las modificaciones de usuarios, pedidos, perfiles, roles y la subida para exigir autenticación antes de esas operaciones.

Ejemplos adicionales (usar los ID reales de la base):

| Operación | Body JSON |
| --- | --- |
| POST `/usuarios` o PUT `/usuarios/:id` | `{"nombre":"Richard","email":"richard@example.com"}` |
| POST `/pedidos` o PUT `/pedidos/:id` | `{"descripcion":"Pedido de prueba","total":25000,"usuarioId":9}` |
| POST `/usuarios/:id/perfil` | `{"telefono":"+56912345678","direccion":"Dirección de prueba 123"}` |
| POST `/roles` | `{"nombre":"cliente"}` |
| POST `/transacciones/usuario-con-pedido` | `{"nombre":"Valentina","email":"valentina@example.com","descripcion":"Primera compra","total":25000,"simularError":false}` |

GET, DELETE y la asociación de roles se envían con **Body → none**. PUT exige todos los campos mostrados. En la transacción, usar un correo nuevo; `simularError: true` provoca un error 500 intencional y revierte la creación de ambos registros. GET `/usuarios` y `/usuarios/sql` permiten comparar ORM y SQL sin filtros ni cambios entre consultas.

## Subida de archivos

Enviar POST `/upload` con token. En **Body → form-data**, agregar `archivo` de tipo **File** y seleccionar un JPG, JPEG o PNG de menos de 2 MB (2.097.152 bytes). Postman configura automáticamente Content-Type.

Se utiliza `express-fileupload`, se valida la extensión con `split(".").pop().toLowerCase()` y se limita el tamaño. El servicio guarda en `uploads/` con un nombre generado por `randomUUID()`. La respuesta 201 entrega `nombre` y `url`; abrir `http://localhost:3000` más esa URL para ver el archivo.

## Validaciones y decisiones

Separé rutas, controladores y servicios para identificar la responsabilidad de cada archivo. Utilicé `express-validator` antes de insertar o modificar datos: campos obligatorios, tipos, longitudes, formato del correo e identificadores positivos. También validé el total de pedidos y la existencia del usuario relacionado. Se controlan correos, perfiles y nombres de roles duplicados.

El nombre admite 100 caracteres, el correo 150 y la contraseña de registro entre 6 y 100. Los pedidos admiten descripción de 200 caracteres y total entre 0 y 99999999.99, con hasta dos decimales. El filtro por nombre utiliza `Op.iLike` sin distinguir mayúsculas.

Para el módulo 8 agregué `password` conservando los usuarios anteriores, excluí la contraseña de la respuesta de actualización e incorporé respuestas JSON para rutas inexistentes y JSON mal formado. Las nuevas relaciones se consultan con `include`; los roles se asocian mediante `addRoles([rol])`.

**Alcance de práctica:** se usan contraseñas ficticias almacenadas como texto. JWT comprueba autenticación, sin permisos por usuario o rol. La subida revisa la extensión, no el contenido real; los archivos son públicos y no están vinculados a registros. No se implementaron las opciones extra de Swagger ni asociación de archivos con usuarios.

## Evidencias y aprendizaje

Las capturas de los módulos anteriores están en `Capturas/`. Las 31 del módulo 8 están en `Capturas/Capturas modulo 8/`: registro, login, rutas protegidas, tokens inválidos y vencidos, subida y errores, CRUD de pedidos, filtros y relaciones 1:1 y N:M. Las pruebas se realizaron manualmente con Postman y el navegador.

En estos tres módulos aprendí a pasar de un servidor con rutas y archivos a una API conectada a PostgreSQL. Practiqué consultas con Sequelize y SQL, transacciones, validaciones, autenticación JWT y relaciones entre modelos. Probar respuestas exitosas y errores me ayudó a comprobar el comportamiento de la aplicación.

La entrega incluye el repositorio GitHub actualizado y las evidencias nuevas en la subcarpeta de Drive **Parte 3 – Módulo 8**.
