# MediControl

MediControl es una aplicación para la gestión y control de citas médicas.

## Características principales

- Gestión de citas médicas
- Registro de pacientes y médicos
- Autenticación y autorización de usuarios
- Alertas y notificaciones

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

## Ejecución

```bash
# Modo desarrollo
$ npm run start:dev

# Modo producción  
$ npm run start:prod
```
