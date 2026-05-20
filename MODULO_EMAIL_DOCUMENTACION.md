# Módulo de Email y Notificaciones - MediControl

## 📋 Descripción General

Este módulo proporciona funcionalidad completa de **envío de emails automáticos y notificaciones** para el sistema MediControl. Incluye:

✅ Envío automático de confirmación cuando se crea una cita
✅ Recordatorios automáticos de citas próximas (cada hora)
✅ Templates HTML profesionales y responsivos
✅ Integración con Nodemailer y Gmail SMTP
✅ Cron jobs automáticos con @nestjs/schedule
✅ Tipado completo con TypeScript
✅ Manejo de errores robusto

---

## 📁 Estructura de Carpetas

```
src/modules/mensajeria/email/
├── email.module.ts                 # Módulo principal
├── email.service.ts                # Lógica de emails y cron jobs
├── email.controller.ts             # Endpoints de testing
├── dto/
│   └── send-email.dto.ts          # DTO para validación
└── templates/
    ├── confirmacion-cita.template.ts    # Template de confirmación
    └── recordatorio-cita.template.ts    # Template de recordatorio
```

---

## 🚀 Instalación y Configuración

### 1️⃣ Dependencias Instaladas

```bash
npm install nodemailer @nestjs/schedule
npm install -D @types/nodemailer
```

### 2️⃣ Variables de Entorno (.env)

El archivo `.env` ya contiene las variables necesarias:

```env
# ========== MAIL CONFIGURATION ==========
MAIL_HOST=smtp.gmail.com              # SMTP server
MAIL_PORT=587                         # Puerto TLS
MAIL_USER=tu_correo@gmail.com        # Tu email de Gmail
MAIL_PASS=tu_app_password            # App Password de Gmail (no contraseña normal)
MAIL_FROM="MediControl <noreply@medicontrol.com>"  # Remitente
```

#### ⚠️ Importante - Configurar Gmail

1. Habilitar **2FA** en tu cuenta Google
2. Generar **App Password** en: https://myaccount.google.com/apppasswords
3. Copiar la contraseña de 16 caracteres en `MAIL_PASS`

### 3️⃣ Integración en app.module.ts ✅

Ya está hecho. El módulo importa:

```typescript
import { ScheduleModule } from '@nestjs/schedule';
import { EmailModule } from './modules/mensajeria/email/email.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),  // ← Activa cron jobs
    // ... otros módulos ...
    EmailModule,               // ← Módulo de emails
  ],
})
export class AppModule {}
```

### 4️⃣ Integración en citas.service.ts ✅

Cuando se crea una cita, automáticamente se envía un email:

```typescript
// Al crear una cita, se ejecuta:
await this.emailService.enviarConfirmacionCita(citaGuardada);
```

---

## 📧 Endpoints de Testing

### 1. Enviar Correo Genérico

**POST** `/email/test`

```json
{
  "to": "paciente@example.com",
  "subject": "Asunto del correo",
  "html": "<h1>Hola</h1><p>Este es un correo de prueba</p>",
  "text": "Texto plano opcional"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Correo enviado exitosamente a paciente@example.com"
}
```

### 2. Enviar Confirmación de Cita

**POST** `/email/confirmacion`

```json
{
  "citaId": 1
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Confirmación enviada para la cita ID: 1"
}
```

### 3. Enviar Recordatorio de Cita

**POST** `/email/recordatorio`

```json
{
  "citaId": 1
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Recordatorio enviado para la cita ID: 1"
}
```

---

## ⏰ Cron Jobs Automáticos

### Verificador de Recordatorios

```typescript
@Cron(CronExpression.EVERY_HOUR)
async verificarYEnviarRecordatorios(): Promise<void>
```

**Frecuencia:** Cada hora (60 minutos)

**Lógica:**
1. Busca citas programadas en las próximas 24 horas
2. Envía recordatorios automáticos
3. Evita duplicados usando un Set interno
4. Registra logs de ejecución

**Ejemplo de salida en logs:**
```
[EmailService] Iniciando verificación de citas para recordatorios...
[EmailService] Se encontraron 3 citas próximas para recordatorios.
[EmailService] Recordatorio de cita enviado a paciente1@example.com para cita ID: 1
[EmailService] Verificación de recordatorios completada.
```

---

## 🏗️ Arquitectura del Módulo

### EmailService

**Responsabilidades:**
- Configurar transporte de Nodemailer
- Enviar emails genéricos
- Generar y enviar confirmaciones de citas
- Generar y enviar recordatorios de citas
- Ejecutar cron job cada hora
- Evitar duplicados de recordatorios

**Métodos Principales:**

```typescript
// Enviar email genérico
async enviarCorreo(sendEmailDto: SendEmailDto): Promise<void>

// Enviar confirmación al crear cita
async enviarConfirmacionCita(cita: Cita): Promise<void>

// Enviar recordatorio de cita próxima
async enviarRecordatorioCita(cita: Cita): Promise<void>

// CRON: Verificar y enviar recordatorios cada hora
@Cron(CronExpression.EVERY_HOUR)
async verificarYEnviarRecordatorios(): Promise<void>

// Limpiar registro de citas (testing)
limpiarCitasEnviadas(): void

// Obtener cantidad de recordatorios enviados (debugging)
obtenerCitasEnviadas(): number
```

### EmailController

Endpoints para testing y debugging:
- `POST /email/test` - Enviar email de prueba
- `POST /email/confirmacion` - Enviar confirmación manualmente
- `POST /email/recordatorio` - Enviar recordatorio manualmente

### Templates HTML

#### Confirmación de Cita
- Diseño gradiente morado
- Información del médico, fecha y hora
- Instrucciones importantes (llegar 10 min antes, documentos, etc.)
- Botón para ver detalles
- Responsive mobile

#### Recordatorio de Cita
- Diseño gradiente rosa/rojo
- Información del médico, fecha y hora
- Preparativos (documento, tarjeta de salud)
- Info de cambios/cancelaciones
- Botón para ver detalles
- Responsive mobile

---

## 🔄 Flujo Completo de Ejemplo

### Escenario: Crear una Cita

1. **Paciente crea cita** vía `POST /citas`
   ```json
   {
     "medicoId": 5,
     "fecha": "2026-05-25",
     "hora": "10:30"
   }
   ```

2. **CitasService valida y guarda** la cita en DB

3. **CitasService llama automáticamente** a:
   ```typescript
   await this.emailService.enviarConfirmacionCita(citaGuardada);
   ```

4. **EmailService genera email** con template HTML personalizado

5. **Nodemailer envía via Gmail SMTP** al email del paciente

6. **Paciente recibe email** en su bandeja de entrada

### Escenario: Recordatorio Automático (cada hora)

1. **Cron job se ejecuta** automáticamente cada hora
2. **Busca citas en próximas 24 horas** con estado PROGRAMADA
3. **Para cada cita no enviada:**
   - Genera email de recordatorio
   - Envía via Nodemailer
   - Marca como enviada en memoria
4. **Logs registran** operación completa

---

## ⚙️ Configuración Avanzada

### Cambiar Frecuencia del Cron Job

En `email.service.ts`:

```typescript
// Cambiar de EVERY_HOUR a:
@Cron(CronExpression.EVERY_30_MINUTES)  // Cada 30 minutos
@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)  // Medianoche
@Cron('0 0 9 * * *')  // 9:00 AM diariamente
```

### Usar Otro Proveedor de Email

Cambiar `email.service.ts` - método `initializeTransporter()`:

```typescript
// Para Gmail
this.transporter = nodemailer.createTransport({
  host: mailHost,
  port: mailPort,
  secure: mailPort === 465,
  auth: { user: mailUser, pass: mailPass },
});

// Para SendGrid
this.transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY,
  },
});
```

### Personalizar Templates

En `confirmacion-cita.template.ts` o `recordatorio-cita.template.ts`:

```typescript
static generate(cita: Cita): string {
  // Modificar HTML a tu gusto
  return `<html>...</html>`;
}
```

---

## 🐛 Debugging y Troubleshooting

### Ver Logs en Consola

```bash
npm run start:dev
```

Busca logs como:
```
[EmailService] Nodemailer transporter inicializado correctamente
[EmailService] Email enviado exitosamente: <messageId>
```

### Limpiar Registro de Recordatorios Enviados

Para testing, limpiar memoria:

```typescript
// En email.service.ts
limpiarCitasEnviadas(): void {
  this.citasEnviadas.clear();
}
```

### Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `MAIL_USER no configurado` | Variable .env vacía | Llenar MAIL_USER |
| `Error: Invalid login` | App Password incorredo | Verificar contraseña de 16 caracteres |
| `Port 587 rejected` | Firewall bloqueando | Usar puerto 465 (SSL) |
| `Cita no encontrada` | ID de cita inválido | Verificar que la cita existe |

---

## 📝 DTOs

### SendEmailDto

```typescript
export class SendEmailDto {
  @IsEmail()
  @IsNotEmpty()
  to: string;              // Email del destinatario

  @IsString()
  @IsNotEmpty()
  subject: string;         // Asunto del email

  @IsString()
  @IsNotEmpty()
  html: string;            // Contenido HTML

  @IsEmail()
  @IsOptional()
  from?: string;           // Remitente (opcional)

  @IsString()
  @IsOptional()
  text?: string;           // Texto plano (opcional)
}
```

---

## ✅ Testing en Postman/Insomnia

### 1. Enviar Email de Prueba

```
POST http://localhost:8080/email/test

Body (JSON):
{
  "to": "tuEmail@gmail.com",
  "subject": "🧪 Email de Prueba - MediControl",
  "html": "<h1>Hola desde MediControl</h1><p>Este es un email de prueba del nuevo módulo.</p>"
}
```

### 2. Enviar Confirmación para Cita Existente

```
POST http://localhost:8080/email/confirmacion

Body (JSON):
{
  "citaId": 1
}
```

### 3. Crear Cita (automáticamente envía confirmación)

```
POST http://localhost:8080/citas

Body (JSON):
{
  "medicoId": 1,
  "fecha": "2026-05-28",
  "hora": "14:00"
}
```

---

## 📊 Base de Datos

### Relaciones Utilizadas

```
Cita
├── paciente (ManyToOne → Paciente)
│   └── usuario (OneToOne → User)
└── medico (ManyToOne → Médico)
    └── usuario (OneToOne → User)
```

### Campos Cita Necesarios

```typescript
- id: number
- fecha: Date
- hora: Time
- estado: CitaStatus ('PROGRAMADA', 'COMPLETADA', 'CANCELADA')
- paciente: Paciente
- medico: Medico
```

---

## 🎯 Casos de Uso

### 1. Sistema Completo de Notificaciones
- ✅ Confirmación inmediata al crear cita
- ✅ Recordatorio 24h antes
- ✅ Reducción de no-shows

### 2. Comunicación Profesional
- ✅ Templates branded
- ✅ Información clara y ordenada
- ✅ Diseño responsivo

### 3. Automatización
- ✅ Sin intervención manual
- ✅ Cron jobs fiables
- ✅ Evita duplicados

---

## 📦 Dependencias Utilizadas

| Dependencia | Versión | Uso |
|-------------|---------|-----|
| `nodemailer` | ^6.x.x | Envío de emails |
| `@nestjs/schedule` | ^4.x.x | Cron jobs |
| `@types/nodemailer` | ^6.x.x | Tipos TypeScript |
| `@nestjs/config` | (ya existe) | ConfigService |
| `@nestjs/typeorm` | (ya existe) | Repositorios |

---

## 🔐 Seguridad

✅ **Contraseñas en .env** - No hardcodeadas
✅ **Validación de DTOs** - class-validator
✅ **Tipado estricto** - TypeScript
✅ **Manejo de errores** - Try/catch en todos los métodos
✅ **Logs** - Rastreo de operaciones

---

## 📞 Soporte

Si hay problemas:

1. Verifica que el `.env` tiene valores correctos
2. Revisa los logs en consola
3. Asegúrate que la cita existe en BD
4. Verifica conectividad SMTP (puerto 587 o 465)
5. Compila con `npm run build`

---

## 🎓 Ejemplos Completos

### Crear cita y recibir email automático

```bash
# 1. Iniciar app
npm run start:dev

# 2. Crear cita (automáticamente envía confirmación)
curl -X POST http://localhost:8080/citas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_JWT" \
  -d '{
    "medicoId": 1,
    "fecha": "2026-05-28",
    "hora": "15:30"
  }'

# 3. Paciente recibe email en bandeja (en 1-2 segundos)

# 4. Cada hora, cron job busca recordatorios próximos y los envía
```

---

## 📄 Documentación Oficial

- [Nodemailer Docs](https://nodemailer.com/)
- [NestJS Schedule Docs](https://docs.nestjs.com/techniques/task-scheduling)
- [NestJS Config Docs](https://docs.nestjs.com/techniques/configuration)

---

**Última actualización:** Mayo 2026
**Versión del módulo:** 1.0.0
**Compatibilidad:** NestJS 10+, TypeScript 5+
