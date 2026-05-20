# Ejemplos de Prueba - Módulo Email

## 🧪 Testing con cURL

### 1. Enviar Email de Prueba

```bash
curl -X POST http://localhost:8080/email/test \
  -H "Content-Type: application/json" \
  -d '{
    "to": "tuEmail@gmail.com",
    "subject": "Email de prueba desde MediControl",
    "html": "<h1>Hola 👋</h1><p>Este es un email de prueba del módulo de notificaciones.</p>",
    "text": "Email de prueba"
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Correo enviado exitosamente a tuEmail@gmail.com"
}
```

---

### 2. Enviar Confirmación de Cita (ID 1)

```bash
curl -X POST http://localhost:8080/email/confirmacion \
  -H "Content-Type: application/json" \
  -d '{
    "citaId": 1
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Confirmación enviada para la cita ID: 1"
}
```

---

### 3. Enviar Recordatorio de Cita (ID 1)

```bash
curl -X POST http://localhost:8080/email/recordatorio \
  -H "Content-Type: application/json" \
  -d '{
    "citaId": 1
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Recordatorio enviado para la cita ID: 1"
}
```

---

## 📝 Testing con Postman/Insomnia

### Importar Colección

Copia y pega en Postman/Insomnia:

```json
{
  "info": {
    "name": "MediControl Email Module",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Email Test",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"to\": \"tuEmail@gmail.com\",\n  \"subject\": \"🧪 Test Email\",\n  \"html\": \"<h1>Hola</h1>\",\n  \"text\": \"Test\"\n}"
        },
        "url": {
          "raw": "http://localhost:8080/email/test",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["email", "test"]
        }
      }
    },
    {
      "name": "Enviar Confirmación",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"citaId\": 1\n}"
        },
        "url": {
          "raw": "http://localhost:8080/email/confirmacion",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["email", "confirmacion"]
        }
      }
    },
    {
      "name": "Enviar Recordatorio",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"citaId\": 1\n}"
        },
        "url": {
          "raw": "http://localhost:8080/email/recordatorio",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["email", "recordatorio"]
        }
      }
    }
  ]
}
```

---

## 🔄 Flujo de Testing Completo

### Paso 1: Verificar Variables de Entorno

```bash
# En .env, verificar que existan:
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=tuEmail@gmail.com
MAIL_PASS=tu_app_password_de_16_caracteres
MAIL_FROM="MediControl <noreply@medicontrol.com>"
```

### Paso 2: Iniciar la Aplicación

```bash
cd ~/ruta/al/proyecto
npm run start:dev
```

Deberías ver:
```
[NestFactory] Starting Nest application...
[InstanceLoader] EnvModule dependencies initialized
[InstanceLoader] ScheduleModule dependencies initialized
[InstanceLoader] EmailModule dependencies initialized
[Nest] 12345 - 05/20/2026, 10:30:00 AM LOG [NestFactory] Nest application successfully started +123ms
```

### Paso 3: Probar Endpoint de Email Genérico

```bash
curl -X POST http://localhost:8080/email/test \
  -H "Content-Type: application/json" \
  -d '{
    "to": "tuEmail@gmail.com",
    "subject": "Test desde MediControl",
    "html": "<h1>Prueba</h1>"
  }'
```

Verifica tu bandeja de entrada en 1-2 segundos.

### Paso 4: Crear una Cita (y recibir confirmación automática)

Primero, necesitas estar autenticado. Obtén un token JWT:

```bash
# Login como paciente
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "paciente@example.com",
    "password": "tuContraseña123"
  }'
```

Respuesta:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Luego, crear cita:

```bash
curl -X POST http://localhost:8080/citas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "medicoId": 1,
    "fecha": "2026-06-15",
    "hora": "10:30"
  }'
```

**Automáticamente:**
1. Se crea la cita
2. Se envía email de confirmación al paciente
3. Ves en consola:
   ```
   [EmailService] Confirmación de cita enviada a paciente@example.com para cita ID: 5
   ```

### Paso 5: Probar Envío Manual de Confirmación

```bash
curl -X POST http://localhost:8080/email/confirmacion \
  -H "Content-Type: application/json" \
  -d '{
    "citaId": 1
  }'
```

### Paso 6: Probar Recordatorio Manual

```bash
curl -X POST http://localhost:8080/email/recordatorio \
  -H "Content-Type: application/json" \
  -d '{
    "citaId": 1
  }'
```

### Paso 7: Verificar Cron Job (opcional)

El cron job se ejecuta automáticamente cada hora. Para forzar una ejecución manual (solo para debugging), modifica `email.service.ts` temporalmente:

```typescript
// Agregar en el constructor
ngOnInit() {
  this.verificarYEnviarRecordatorios(); // Fuerza ejecución
}
```

---

## 🎯 Casos de Prueba

### Test 1: Email Simple
- ✅ Enviar email de prueba a tu correo
- ✅ Verificar que llegue
- ✅ Verificar formato HTML

### Test 2: Confirmación de Cita
- ✅ Crear cita
- ✅ Verificar email de confirmación automático
- ✅ Verificar datos de cita en email

### Test 3: Recordatorio Automático
- ✅ Crear cita para mañana
- ✅ Esperar a que se ejecute cron (cada hora)
- ✅ Verificar que llegó el recordatorio

### Test 4: Validaciones
- ✅ Enviar email a dirección inválida → Error
- ✅ Enviar a cita que no existe → Error
- ✅ HTML vacío → Error

---

## 📊 Logs Esperados

Al ejecutar `npm run start:dev`, deberías ver:

```
[22:45:30] Starting Nest application...
[22:45:31] [EmailService] Nodemailer transporter inicializado correctamente
[22:45:32] Nest application successfully started
```

Al enviar email de prueba:

```
[22:46:00] [EmailService] Email enviado exitosamente: <CAEzJ=iBxZ+WQ...@mail.gmail.com>
```

Al crear cita:

```
[22:46:15] [EmailService] Confirmación de cita enviada a paciente@example.com para cita ID: 1
```

Al ejecutar cron job cada hora:

```
[23:00:00] [EmailService] Iniciando verificación de citas para recordatorios...
[23:00:00] [EmailService] Se encontraron 2 citas próximas para recordatorios.
[23:00:01] [EmailService] Recordatorio de cita enviado a paciente@example.com para cita ID: 1
[23:00:01] [EmailService] Verificación de recordatorios completada.
```

---

## ❌ Troubleshooting

### Problema: "MAIL_USER no configurado"

```
[EmailService] Error al enviar email: MAIL_USER must be configured
```

**Solución:**
1. Abre `.env`
2. Asegúrate que `MAIL_USER` tiene valor
3. Reinicia el servidor

### Problema: "Invalid login: 535-5.7.8 Username and Password not accepted"

```
[EmailService] Error al enviar email: Invalid login
```

**Solución:**
1. Verifica que usas **App Password** de Google (16 caracteres)
2. NO uses contraseña normal de Gmail
3. Genera nueva en: https://myaccount.google.com/apppasswords
4. Actualiza `MAIL_PASS` en `.env`

### Problema: "Cita no encontrada"

```
[EmailService] Error al enviar confirmación de cita: Cita no encontrada
```

**Solución:**
1. Verifica que el citaId existe en BD
2. Usa SQL: `SELECT * FROM citas WHERE id = 1;`
3. Prueba con un ID válido

### Problema: "Port 587 rejected"

Significa que el firewall bloquea puerto 587.

**Solución:**
1. Usa puerto 465 (SSL)
2. En `.env`: `MAIL_PORT=465`
3. En `email.service.ts`:
   ```typescript
   secure: mailPort === 465, // Se pone true automáticamente
   ```

---

## 📱 Testing en Dispositivos Móviles

Los templates son **100% responsivos**. Puedes:

1. Crear cita desde mobile
2. Recibir email en móvil
3. Ver perfecto en cualquier tamaño de pantalla

---

## 🚀 Próximos Pasos

### Enhancements Futuros (opcional)

```typescript
// 1. Agregar base de datos de auditoría
CREATE TABLE email_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  cita_id INT,
  tipo ENUM('confirmacion', 'recordatorio'),
  destinatario VARCHAR(255),
  estado ENUM('enviado', 'fallido'),
  fecha_envio TIMESTAMP,
  error_mensaje TEXT
);

// 2. Enviar a múltiples destinatarios (médico también)
await this.emailService.enviarConfirmacionCita(citaGuardada, [
  pacienteEmail,
  medicoEmail,
]);

// 3. SMS como backup si email falla
await this.smsService.enviarRecordatorio(telefono, mensaje);

// 4. UI en página para ver histórico de emails
GET /email/logs
```

---

## 📞 Soporte Rápido

| Pregunta | Respuesta |
|----------|-----------|
| ¿Dónde agrego un email más? | En el template |
| ¿Cómo cambio frecuencia cron? | Modifica `@Cron()` en `email.service.ts` |
| ¿Cómo uso otro proveedor SMTP? | Cambia configuración en `initializeTransporter()` |
| ¿Email no llega? | Verifica MAIL_PASS y MAIL_USER |
| ¿Quiero agregar más templates? | Crea nueva clase en carpeta `templates/` |

---

**Última actualización:** Mayo 2026
**Módulo versión:** 1.0.0
