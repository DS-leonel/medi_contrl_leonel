import { Cita } from 'src/modules/citas/entities/cita.entity';

export class RecordatorioCitaTemplate {
  static generate(cita: Cita, horasRestantes: number): string {
    // Construir nombres a partir de las propiedades de Usuario
    const nombrePaciente = cita.paciente?.usuario
      ? `${cita.paciente.usuario.primerNombre} ${cita.paciente.usuario.primerApellido}`.trim()
      : 'Estimado/a Paciente';

    const nombreMedico = cita.medico?.usuario
      ? `${cita.medico.usuario.primerNombre} ${cita.medico.usuario.primerApellido}`.trim()
      : 'Médico';

    const especialidad = cita.medico?.especialidad || 'Medicina General';
    const fecha = new Date(cita.fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const hora = cita.hora;

    const tiempoRestante =
      horasRestantes < 24
        ? `en ${Math.round(horasRestantes)} horas`
        : `el ${fecha}`;

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recordatorio de Cita Médica</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5;">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">🔔 Recordatorio</h1>
                    <p style="color: #ffe0e6; margin: 5px 0 0 0; font-size: 14px;">Sistema de Gestión Médica - MediControl</p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">¡Recordatorio de tu Cita!</h2>
                    
                    <p style="color: #666666; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
                      Hola <strong>${nombrePaciente}</strong>,
                    </p>

                    <p style="color: #666666; margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">
                      Te recordamos que tienes una cita médica programada <strong style="color: #f5576c;">${tiempoRestante}</strong>. No olvides los detalles importantes:
                    </p>

                    <!-- Details Box -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); border-left: 4px solid #f5576c; padding: 20px; border-radius: 4px;">
                          <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="padding-bottom: 15px;">
                                <p style="color: #c41e3a; margin: 0; font-size: 12px; font-weight: 600; text-transform: uppercase;">Médico</p>
                                <p style="color: #333333; margin: 5px 0 0 0; font-size: 16px; font-weight: 600;">${nombreMedico}</p>
                                <p style="color: #666666; margin: 3px 0 0 0; font-size: 14px;">${especialidad}</p>
                              </td>
                            </tr>
                            <tr>
                              <td style="border-top: 1px solid #f5d6d3; padding: 15px 0;">
                                <p style="color: #c41e3a; margin: 0; font-size: 12px; font-weight: 600; text-transform: uppercase;">📅 Fecha</p>
                                <p style="color: #333333; margin: 5px 0 0 0; font-size: 16px; font-weight: 600;">${fecha}</p>
                              </td>
                            </tr>
                            <tr>
                              <td style="border-top: 1px solid #f5d6d3; padding: 15px 0;">
                                <p style="color: #c41e3a; margin: 0; font-size: 12px; font-weight: 600; text-transform: uppercase;">⏰ Hora</p>
                                <p style="color: #333333; margin: 5px 0 0 0; font-size: 16px; font-weight: 600;">${hora}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Pre-appointment Tips -->
                    <div style="margin-top: 30px; padding: 20px; background-color: #e3f2fd; border-radius: 4px; border-left: 4px solid #2196f3;">
                      <p style="color: #1565c0; margin: 0; font-size: 14px; font-weight: 600;">✓ Preparativos</p>
                      <ul style="color: #1565c0; margin: 10px 0 0 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
                        <li>Llega 10 minutos antes de la hora programada.</li>
                        <li>Trae tu documento de identidad.</li>
                        <li>Trae tu tarjeta de seguro o referencia médica.</li>
                        <li>Anota cualquier pregunta que desees hacer.</li>
                      </ul>
                    </div>

                    <!-- Cancellation Info -->
                    <div style="margin-top: 20px; padding: 15px; background-color: #f3e5f5; border-radius: 4px; border-left: 4px solid #9c27b0;">
                      <p style="color: #6a1b9a; margin: 0; font-size: 14px;">
                        <strong>¿Necesitas cambiar tu cita?</strong> Si necesitas cancelar o reprogramar, por favor hazlo con al menos 24 horas de anticipación a través de tu cuenta.
                      </p>
                    </div>

                    <!-- CTA -->
                    <div style="margin-top: 30px; text-align: center;">
                      <a href="https://medicontrol.com/mis-citas" style="display: inline-block; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: #ffffff; text-decoration: none; padding: 12px 40px; border-radius: 4px; font-weight: 600; font-size: 16px;">Ver Detalles de la Cita</a>
                    </div>

                    <p style="color: #999999; margin: 30px 0 0 0; font-size: 14px; line-height: 1.6;">
                      Estamos listos para atenderte. Si tienes dudas, no dudes en contactarnos.
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
                      <a href="https://medicontrol.com/privacidad" style="color: #f5576c; text-decoration: none;">Política de Privacidad</a> | 
                      <a href="https://medicontrol.com/terminos" style="color: #f5576c; text-decoration: none;">Términos de Servicio</a>
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
