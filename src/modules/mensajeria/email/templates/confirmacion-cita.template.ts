import { Cita } from 'src/modules/citas/entities/cita.entity';

export class ConfirmacionCitaTemplate {
  static generate(cita: Cita): string {
    // Construir nombres a partir de las propiedades de Usuario
    const nombrePaciente = cita.paciente?.usuario
      ? `${cita.paciente.usuario.primerNombre} ${cita.paciente.usuario.primerApellido}`.trim()
      : 'Estimado/a Paciente';

    const nombreMedico = cita.medico?.usuario
      ? `${cita.medico.usuario.primerNombre} ${cita.medico.usuario.primerApellido}`.trim()
      : 'Médico';

    const especialidad = cita.medico?.especialidad || 'Medicina General';
    const fecha = new Date(`${cita.fecha}T00:00:00`).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const hora = cita.hora;

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmación de Cita Médica</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5;">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">MediControl</h1>
                    <p style="color: #e0e0e0; margin: 5px 0 0 0; font-size: 14px;">Sistema de Gestión Médica</p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">¡Cita Confirmada!</h2>
                    
                    <p style="color: #666666; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
                      Hola <strong>${nombrePaciente}</strong>,
                    </p>

                    <p style="color: #666666; margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">
                      Nos complace confirmar que tu cita médica ha sido programada exitosamente. Por favor, guarda estos detalles para tu referencia.
                    </p>

                    <!-- Details Box -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="background-color: #f9f9f9; border-left: 4px solid #667eea; padding: 20px; border-radius: 4px;">
                          <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="padding-bottom: 15px;">
                                <p style="color: #999999; margin: 0; font-size: 12px; font-weight: 600; text-transform: uppercase;">Médico</p>
                                <p style="color: #333333; margin: 5px 0 0 0; font-size: 16px; font-weight: 600;">${nombreMedico}</p>
                                <p style="color: #666666; margin: 3px 0 0 0; font-size: 14px;">${especialidad}</p>
                              </td>
                            </tr>
                            <tr>
                              <td style="border-top: 1px solid #e0e0e0; padding: 15px 0;">
                                <p style="color: #999999; margin: 0; font-size: 12px; font-weight: 600; text-transform: uppercase;">Fecha</p>
                                <p style="color: #333333; margin: 5px 0 0 0; font-size: 16px; font-weight: 600;">${fecha}</p>
                              </td>
                            </tr>
                            <tr>
                              <td style="border-top: 1px solid #e0e0e0; padding: 15px 0;">
                                <p style="color: #999999; margin: 0; font-size: 12px; font-weight: 600; text-transform: uppercase;">Hora</p>
                                <p style="color: #333333; margin: 5px 0 0 0; font-size: 16px; font-weight: 600;">${hora}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Important Notes -->
                    <div style="margin-top: 30px; padding: 20px; background-color: #fff3cd; border-radius: 4px; border-left: 4px solid #ffc107;">
                      <p style="color: #856404; margin: 0; font-size: 14px; font-weight: 600;">⚠️ Importante</p>
                      <ul style="color: #856404; margin: 10px 0 0 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
                        <li>Por favor, llega 10 minutos antes de la cita.</li>
                        <li>Si necesitas cancelar o reprogramar, notifica con al menos 24 horas de anticipación.</li>
                        <li>Trae tu documento de identidad y tarjeta de salud.</li>
                      </ul>
                    </div>

                    <!-- CTA -->
                    <div style="margin-top: 30px; text-align: center;">
                      <a href="http://localhost:8080/api#/Citas" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 12px 40px; border-radius: 4px; font-weight: 600; font-size: 16px;">Ver mis Citas</a>
                    </div>

                    <p style="color: #999999; margin: 30px 0 0 0; font-size: 14px; line-height: 1.6;">
                      Si tienes alguna pregunta o necesitas cambios, por favor contacta con nuestro equipo de soporte.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f5f5f5; padding: 20px 30px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e0e0e0;">
                    <p style="color: #999999; margin: 0; font-size: 12px;">
                      © 2026 MediControl. Todos los derechos reservados.
                    </p>
                    <p style="color: #999999; margin: 10px 0 0 0; font-size: 12px;">
                      <a href="https://medicontrol.com/privacidad" style="color: #667eea; text-decoration: none;">Política de Privacidad</a> | 
                      <a href="https://medicontrol.com/terminos" style="color: #667eea; text-decoration: none;">Términos de Servicio</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  }
}
