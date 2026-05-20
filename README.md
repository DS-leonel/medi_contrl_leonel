# MediControl

MediControl es una aplicación para la gestión y control de citas médicas.

## Características principales

- Gestión de citas médicas
- Registro de pacientes y médicos
- Autenticación y autorización de usuarios
- Alertas y notificaciones

## Integrantes

- [Neider Duvan Guindigua Machoa](https://github.com/Neid-09/)
- [Jamilton Jhony Rueda Legarda](https://github.com/jamilton-asda/)
- [Daniel Alejandro Macias Perez](https://github.com/MP-Daniel/)
- [Jose Leonel Enriquez Zambrano](https://github.com/DS-leonel/)
- [Jenkner Johan Arteaga Delgado](https://github.com/Jenkner305/)
- [David Mauricio Zambrano Guerrero](https://github.com/davidzambrano13/)

## Tecnologías usadas

- **Node.js**: entorno de ejecución de JavaScript para el backend.
- **NestJS**: framework principal de la aplicación.
- **TypeScript**: lenguaje usado para el desarrollo del proyecto.
- **MySQL** y **mysql2**: base de datos relacional y driver de conexión.
- **TypeORM**: ORM para entidades, repositorios y conexión con la base de datos.
- **JWT**, **Passport** y **passport-jwt**: autenticación y autorización basada en tokens.
- **bcrypt**: cifrado de contraseñas.
- **class-validator** y **class-transformer**: validación y transformación de DTOs.
- **Socket.IO** y **@nestjs/websockets**: comunicación en tiempo real mediante WebSockets.
- **Nodemailer**: envío de correos electrónicos.
- **Swagger** y **swagger-ui-express**: documentación interactiva de la API.

## Módulos

- **Auth**: gestiona el registro e inicio de sesión de usuarios, emitiendo credenciales JWT para acceder a los endpoints protegidos.
- **Users**: administra usuarios del sistema, consulta de perfil autenticado y asignación de roles con permisos restringidos para administradores.
- **Médicos**: permite registrar perfiles médicos, listar médicos disponibles y consultar información específica de médicos.
- **Pacientes**: gestiona perfiles de pacientes, consulta de perfil propio, estadísticas, actualización de datos y desactivación lógica de pacientes.
- **Citas**: controla la creación, consulta, actualización de estado, cancelación y eliminación de citas médicas según el rol del usuario.
- **Chat**: expone el gateway WebSocket base para comunicación en tiempo real bajo el namespace `/chat`.
- **Soporte**: administra tickets de soporte por REST y WebSocket, incluyendo creación, historial, mensajería en salas, notificaciones a administradores, cierre y reapertura de tickets.
- **Database**: configura la conexión global a MySQL mediante TypeORM, carga automática de entidades y parámetros definidos en variables de entorno.
- **Env**: carga el archivo `.env` y registra la configuración como recurso global de NestJS.
- **App JWT**: centraliza la configuración del módulo JWT usando `JWT_SECRET` y `JWT_EXPIRES_IN`.

## Requisitos del sistema

- Node.js 16+
- MySQL
- NestJS 8+

## Instalación

```bash
npm install
```

## Configuración

1. Configurar las variables de entorno según el entorno

### Ejemplo de archivo `.env`

```env
# ==== server configuration ====
PORT=8080

# ==== database configuration ====
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_NAME=db_medicontrol

# ==== JWT configuration ====
JWT_SECRET=this_is_a_secret_key_for_jwt_esta_es_una_clave_secreta_para_jwt
JWT_EXPIRES_IN=10h

# ==== nodemailer configuration ====
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587

# ==== email configuration (Crea y pega la clave de aplicación de gmail)====
MAIL_USER=tu.emaill@gmail.com
MAIL_PASS=advvvvadad
MAIL_FROM=noreply@miapp.com

# ==== cron configuration(Tiempo de recordatorio correos) ====
EMAIL_REMINDER_CRON=0 * * * *
```

## Ejecución

```bash
# Modo desarrollo
$ npm run start:dev

# Modo producción  
$ npm run start:prod
```
