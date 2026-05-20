# 🚀 Guía de Inicio Rápido - Módulo Email

## ⚡ 5 Minutos para Empezar

### 1️⃣ Verificar Instalación (30 segundos)

```bash
# Verificar que las dependencias están instaladas
npm list nodemailer @nestjs/schedule

# Salida esperada:
# └─ nodemailer@6.x.x
# └─ @nestjs/schedule@4.x.x
```

### 2️⃣ Configurar Variables de Entorno (1 minuto)

Abre `.env` y verifica:

```env
PORT=8080
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=tu_correo@gmail.com        ← TU EMAIL DE GMAIL
MAIL_PASS=tu_app_password_16_chars   ← APP PASSWORD (no contraseña normal)
MAIL_FROM="MediControl <noreply@medicontrol.com>"
```

**Importante:** Si no tienes App Password:
1. Abre https://myaccount.google.com/apppasswords
2. Genera uno nuevo (te da 16 caracteres)
3. Pégalo en `MAIL_PASS`

### 3️⃣ Iniciar el Servidor (2 minutos)

```bash
npm run start:dev
```

**Deberías ver:**
```
[22:30:45] Starting Nest application...
[Nest] 12345 - 05/20/2026, 10:30:45 PM LOG [EmailService] Nodemailer transporter inicializado correctamente
[Nest] 12345 - 05/20/2026, 10:30:46 PM LOG [NestFactory] Nest application successfully started +123ms
```

### 4️⃣ Probar Endpoint (1 minuto 30 segundos)

```bash
curl -X POST http://localhost:8080/email/test \
  -H "Content-Type: application/json" \
  -d '{
    "to": "tuEmail@gmail.com",
    "subject": "Test MediControl 🧪",
    "html": "<h1>¡Funciona! 🎉</h1>"
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Correo enviado exitosamente a tuEmail@gmail.com"
}
```

✅ **Revisa tu bandeja de entrada en 1-2 segundos**

---

## 📋 Rutas HTTP Disponibles

### 1. Enviar Email Genérico

```
POST /email/test
Content-Type: application/json

{
  "to": "destinatario@example.com",
  "subject": "Asunto del email",
  "html": "<h1>HTML aquí</h1>",
  "text": "Texto plano (opcional)",
  "from": "remitente@example.com (opcional)"
}
```

**Ejemplo Real:**
```bash
curl -X POST http://localhost:8080/email/test \
  -H "Content-Type: application/json" \
  -d '{
    "to": "paciente@gmail.com",
    "subject": "Confirmación MediControl",
    "html": "<h1>Hola 👋</h1><p>Tu cita fue confirmada</p>"
  }'
```

---

### 2. Enviar Confirmación de Cita

```
POST /email/confirmacion
Content-Type: application/json

{
  "citaId": 1
}
```

**Ejemplo Real:**
```bash
curl -X POST http://localhost:8080/email/confirmacion \
  -H "Content-Type: application/json" \
  -d '{"citaId": 1}'
```

**Qué hace:**
- Busca la cita con ID 1
- Carga datos de paciente y médico
- Genera template HTML
- Envía email al paciente

---

### 3. Enviar Recordatorio de Cita

```
POST /email/recordatorio
Content-Type: application/json

{
  "citaId": 1
}
```

**Ejemplo Real:**
```bash
curl -X POST http://localhost:8080/email/recordatorio \
  -H "Content-Type: application/json" \
  -d '{"citaId": 1}'
```

**Qué hace:**
- Busca la cita con ID 1
- Calcula horas restantes
- Genera template de recordatorio
- Envía email al paciente

---

## 🔄 Flujo Automático Completo

### Paso 1: Paciente Crea Cita

```bash
# Login primero (si es necesario)
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "paciente@example.com",
    "password": "contraseña123"
  }'

# Respuesta:
# {
#   "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
# }
```

### Paso 2: Crear Cita con Token

```bash
curl -X POST http://localhost:8080/citas \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "medicoId": 1,
    "fecha": "2026-06-20",
    "hora": "15:30"
  }'

# Respuesta:
# {
#   "id": 42,
#   "fecha": "2026-06-20",
#   "hora": "15:30",
#   "estado": "PROGRAMADA",
#   ...
# }
```

### Paso 3: Email Se Envía Automáticamente ✅

**En los logs ves:**
```
[EmailService] Confirmación de cita enviada a paciente@example.com para cita ID: 42
```

**Paciente recibe email profesional con:**
- ✅ Nombre del médico
- ✅ Especialidad
- ✅ Fecha completa (ej: "Jueves, 20 de junio de 2026")
- ✅ Hora exacta
- ✅ Instrucciones importantes
- ✅ Botón para ver detalles
- ✅ Diseño bonito responsive

### Paso 4: Cada Hora Se Buscan Recordatorios

El cron job se ejecuta automáticamente cada hora:
```
[EmailService] Iniciando verificación de citas para recordatorios...
[EmailService] Se encontraron 3 citas próximas para recordatorios.
[EmailService] Recordatorio de cita enviado a paciente@example.com para cita ID: 42
[EmailService] Verificación de recordatorios completada.
```

---

## 📊 Estado de Cron Job

El cron job `EVERY_HOUR` verifica:

| Aspecto | Detalle |
|--------|---------|
| Frecuencia | Cada 60 minutos |
| Horarios activos | 24/7 |
| Rango de búsqueda | Próximas 24 horas |
| Filtro de estado | Solo PROGRAMADA |
| Duplicados | Evitados con Set interno |
| Logs | Registra todas operaciones |

**Ejemplo:**
```
Hora: 10:00 → Busca citas de hoy 10:00 a mañana 10:00
Hora: 11:00 → Busca citas de hoy 11:00 a mañana 11:00
...
```

---

## 🎨 Personalización Rápida

### Cambiar Diseño del Email

**Archivo:** `src/modules/mensajeria/email/templates/confirmacion-cita.template.ts`

```typescript
// Busca esta línea y modifica color:
style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"

// Cambia a:
style="background: linear-gradient(135deg, #00BCD4 0%, #0097A7 100%);"  // Azul
```

### Cambiar Remitente

**Archivo:** `.env`

```env
# Cambiar de:
MAIL_FROM="MediControl <noreply@medicontrol.com>"

# A:
MAIL_FROM="Tu Clínica <info@tuelinca.com>"
```

### Agregar Teléfono en Email

**Archivo:** `src/modules/mensajeria/email/templates/confirmacion-cita.template.ts`

```typescript
// Agregar después de especialidad:
const telefono = cita.medico?.telefono || '555-0000';

// Y en HTML:
<p>Teléfono: ${telefono}</p>
```

---

## 🧪 Tests Rápidos

### Test 1: Conexión SMTP

```bash
curl -X POST http://localhost:8080/email/test \
  -H "Content-Type: application/json" \
  -d '{
    "to": "tuEmail@gmail.com",
    "subject": "Test de conexión",
    "html": "<p>Si recibes esto, SMTP funciona ✅</p>"
  }'
```

**Resultado esperado:**
- ✅ HTTP 200
- ✅ Email recibido en 1-2 segundos
- ✅ Log en consola

### Test 2: Validación de Datos

```bash
curl -X POST http://localhost:8080/email/test \
  -H "Content-Type: application/json" \
  -d '{
    "to": "emailInvalido",
    "subject": "Test",
    "html": "<p>Esto debería fallar</p>"
  }'
```

**Resultado esperado:**
- ✅ HTTP 400 (Bad Request)
- ✅ Error de validación

### Test 3: Cita No Existe

```bash
curl -X POST http://localhost:8080/email/confirmacion \
  -H "Content-Type: application/json" \
  -d '{"citaId": 99999}'
```

**Resultado esperado:**
- ✅ HTTP 200 pero con error en response
- ✅ Log mostrando "Cita no encontrada"

---

## 📱 Usar en Postman/Insomnia

### Crear ambiente

```json
{
  "name": "MediControl Local",
  "values": [
    {
      "key": "base_url",
      "value": "http://localhost:8080",
      "enabled": true
    },
    {
      "key": "token",
      "value": "",
      "enabled": true
    }
  ]
}
```

### Request 1: Login

```
POST {{base_url}}/auth/login
{
  "email": "paciente@example.com",
  "password": "pass123"
}

Tests:
pm.environment.set("token", pm.response.json().access_token);
```

### Request 2: Crear Cita

```
POST {{base_url}}/citas
Authorization: Bearer {{token}}
{
  "medicoId": 1,
  "fecha": "2026-06-25",
  "hora": "09:00"
}
```

### Request 3: Enviar Email Test

```
POST {{base_url}}/email/test
{
  "to": "tuEmail@gmail.com",
  "subject": "Test desde Postman",
  "html": "<h1>¡Hola desde Postman!</h1>"
}
```

---

## 🔧 Comandos Útiles

```bash
# Compilar proyecto
npm run build

# Iniciar en desarrollo
npm run start:dev

# Iniciar en producción (después de build)
npm run start:prod

# Ver logs en tiempo real
npm run start:dev | grep EmailService

# Limpiar build
rm -r dist
```

---

## 🆘 Problemas Comunes y Soluciones

### ❌ "MAIL_USER must be configured"

```
Error: MAIL_USER must be configured
```

**Solución:**
1. Abre `.env`
2. Agrega: `MAIL_USER=tuEmail@gmail.com`
3. Reinicia servidor

---

### ❌ "Invalid login: 535-5.7.8"

```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```

**Solución:**
1. Usa **App Password** de Google (no contraseña normal)
2. Genera en: https://myaccount.google.com/apppasswords
3. Debe tener 16 caracteres
4. Actualiza `MAIL_PASS` en `.env`

---

### ❌ "Cita no encontrada"

```
Error: Cita no encontrada para enviar confirmación
```

**Solución:**
1. Verifica que la cita existe en BD
2. Usa SQL: `SELECT * FROM citas WHERE id = 1;`
3. Prueba con un ID válido

---

### ❌ "Port 587 rejected"

```
Error: connect ECONNREFUSED 127.0.0.1:587
```

**Solución:**
1. Cambia puerto en `.env`: `MAIL_PORT=465`
2. Gmail actualizará secure a true automáticamente

---

### ❌ "Module not found: EmailModule"

```
Error: Cannot find module 'EmailModule'
```

**Solución:**
1. Verifica que `app.module.ts` importa `EmailModule`
2. Verifica que archivo existe en: `src/modules/mensajeria/email/email.module.ts`
3. Ejecuta: `npm run build` para validar

---

## 📈 Verificar que Todo Funciona

```bash
# 1. Compilación
npm run build
✅ BUILD SUCCESS

# 2. Iniciar
npm run start:dev
✅ [EmailService] Nodemailer transporter inicializado correctamente

# 3. Test simple
curl http://localhost:8080/email/test -d '{"to":"test@gmail.com"...}'
✅ {"success":true,"message":"Correo enviado..."}

# 4. Email recibido
📧 Revisa tu bandeja
✅ Email llega en 1-2 segundos

# 5. Cron job (espera hasta siguiente hora)
✅ [EmailService] Iniciando verificación de citas para recordatorios...
```

---

## 🎯 Próximos Pasos

### Después de verificar que funciona:

1. **Personaliza templates**
   - Agrega logo de tu clínica
   - Cambia colores a tu marca

2. **Configura para producción**
   - Usa App Password segura
   - Configura dominio propio

3. **Agrega auditoría**
   - Tabla email_logs en BD
   - Registra todos los envíos

4. **Escala**
   - Envía a múltiples destinatarios
   - SMS como backup
   - Notificaciones push

---

## 📞 Resumen de Rutas

| Ruta | Método | Función |
|------|--------|---------|
| `/email/test` | POST | Enviar email genérico (testing) |
| `/email/confirmacion` | POST | Enviar confirmación de cita manual |
| `/email/recordatorio` | POST | Enviar recordatorio de cita manual |

---

## ✅ Checklist Final

- [ ] Variables .env configuradas
- [ ] Dependencias instaladas
- [ ] Servidor iniciado sin errores
- [ ] Email de prueba enviado y recibido
- [ ] Cita creada con email automático
- [ ] Recordatorio manual probado
- [ ] Logs muestran operaciones correctas

---

**🚀 ¡Listo para usar!**

Cualquier duda, revisa:
- `MODULO_EMAIL_DOCUMENTACION.md` - Documentación completa
- `EJEMPLOS_PRUEBA_EMAIL.md` - Ejemplos detallados
- `RESUMEN_IMPLEMENTACION.md` - Resumen técnico
