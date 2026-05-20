import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as nodemailer from 'nodemailer';

import { Cita } from 'src/modules/citas/entities/cita.entity';
import { SendEmailDto } from './dto/send-email.dto';
import { ConfirmacionCitaTemplate } from './templates/confirmacion-cita.template';
import { RecordatorioCitaTemplate } from './templates/recordatorio-cita.template';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  private readonly logger = new Logger(EmailService.name);

  private citasEnviadas: Set<number> = new Set();

  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(Cita)
    private readonly citaRepository: Repository<Cita>,
  ) {
    this.initializeTransporter();
  }

  /**
   * Inicializar Nodemailer
   */
  private initializeTransporter(): void {
    const mailHost =
      this.configService.get<string>('MAIL_HOST') ||
      'smtp.gmail.com';

    const mailPort = Number(
      this.configService.get<string>('MAIL_PORT') || '587',
    );

    const mailUser =
      this.configService.get<string>('MAIL_USER');

    const mailPass =
      this.configService.get<string>('MAIL_PASS');

    this.transporter = nodemailer.createTransport({
      host: mailHost,

      port: mailPort,

      secure: false,

      auth: {
        user: mailUser,
        pass: mailPass,
      },

      tls: {
        rejectUnauthorized: false,
      },
    });

    /**
     * Verificar conexión SMTP
     */
    this.transporter.verify((error, success) => {
      if (error) {
        this.logger.error(
          `Error conexión SMTP: ${error.message}`,
        );
      } else {
        this.logger.log(
          'Servidor SMTP listo para enviar correos',
        );
      }
    });

    this.logger.log(
      'Nodemailer transporter inicializado correctamente',
    );
  }

  /**
   * Método genérico para enviar correos
   */
  async enviarCorreo(
    sendEmailDto: SendEmailDto,
  ): Promise<void> {
    try {
      const mailFrom =
        sendEmailDto.from ||
        this.configService.get<string>('MAIL_FROM');

      const mailOptions = {
        from: mailFrom,
        to: sendEmailDto.to,
        subject: sendEmailDto.subject,
        html: sendEmailDto.html,
        text: sendEmailDto.text || '',
      };

      const info =
        await this.transporter.sendMail(mailOptions);

      this.logger.log(
        `Email enviado correctamente: ${info.messageId}`,
      );
    } catch (error) {
      this.logger.error(
        `Error al enviar email a ${sendEmailDto.to}: ${error}`,
        error,
      );

      throw error;
    }
  }

  /**
   * Enviar confirmación de cita
   */
  async enviarConfirmacionCita(
    cita: Cita,
  ): Promise<void> {
    try {
      const citaCompleta =
        await this.citaRepository.findOne({
          where: { id: cita.id },

          relations: [
            'paciente',
            'paciente.usuario',
            'medico',
            'medico.usuario',
          ],
        });

      if (!citaCompleta) {
        throw new Error(
          'Cita no encontrada para enviar confirmación',
        );
      }

      const emailPaciente =
        citaCompleta.paciente?.usuario?.email;

      if (!emailPaciente) {
        this.logger.warn(
          `No se encontró email del paciente para la cita ${citaCompleta.id}`,
        );

        return;
      }

      const htmlTemplate =
        ConfirmacionCitaTemplate.generate(
          citaCompleta,
        );

      await this.enviarCorreo({
        to: emailPaciente,

        subject:
          'Confirmación de tu Cita Médica - MediControl',

        html: htmlTemplate,
      });

      this.logger.log(
        `Confirmación enviada a ${emailPaciente}`,
      );
    } catch (error) {
      this.logger.error(
        `Error enviando confirmación: ${error}`,
        error,
      );

      throw error;
    }
  }

  /**
   * Enviar recordatorio de cita
   */
  async enviarRecordatorioCita(
    cita: Cita,
  ): Promise<void> {
    try {
      const citaCompleta =
        await this.citaRepository.findOne({
          where: { id: cita.id },

          relations: [
            'paciente',
            'paciente.usuario',
            'medico',
            'medico.usuario',
          ],
        });

      if (!citaCompleta) {
        throw new Error(
          'Cita no encontrada para enviar recordatorio',
        );
      }

      const emailPaciente =
        citaCompleta.paciente?.usuario?.email;

      if (!emailPaciente) {
        this.logger.warn(
          `No se encontró email del paciente para la cita ${citaCompleta.id}`,
        );

        return;
      }

      const fechaHoraCita = new Date(
        `${citaCompleta.fecha}T${citaCompleta.hora}`,
      );

      const ahora = new Date();

      const msRestantes =
        fechaHoraCita.getTime() - ahora.getTime();

      const horasRestantes =
        msRestantes / (1000 * 60 * 60);

      const htmlTemplate =
        RecordatorioCitaTemplate.generate(
          citaCompleta,
          horasRestantes,
        );

      await this.enviarCorreo({
        to: emailPaciente,

        subject:
          '🔔 Recordatorio de Cita Médica - MediControl',

        html: htmlTemplate,
      });

      this.logger.log(
        `Recordatorio enviado a ${emailPaciente}`,
      );
    } catch (error) {
      this.logger.error(
        `Error enviando recordatorio: ${error}`,
        error,
      );

      throw error;
    }
  }

  /**
   * Cron Job cada hora
   */
  @Cron(process.env.EMAIL_REMINDER_CRON || CronExpression.EVERY_HOUR)
  async verificarYEnviarRecordatorios(): Promise<void> {
    try {
      this.logger.log(
        'Verificando citas próximas...',
      );

      const ahora = new Date();

      const manana = new Date(
        ahora.getTime() + 24 * 60 * 60 * 1000,
      );

      const fechaActual =
        ahora.toISOString().split('T')[0];

      const fechaManana =
        manana.toISOString().split('T')[0];

      const citasProximas =
        await this.citaRepository
          .createQueryBuilder('cita')

          .leftJoinAndSelect(
            'cita.paciente',
            'paciente',
          )

          .leftJoinAndSelect(
            'paciente.usuario',
            'usuario',
          )

          .leftJoinAndSelect(
            'cita.medico',
            'medico',
          )

          .leftJoinAndSelect(
            'medico.usuario',
            'medicoUsuario',
          )

          .where(
            'cita.fecha >= :fechaActual',
            { fechaActual },
          )

          .andWhere(
            'cita.fecha <= :fechaManana',
            { fechaManana },
          )

          .andWhere(
            'cita.estado = :estado',
            { estado: 'PROGRAMADA' },
          )

          .orderBy('cita.fecha', 'ASC')

          .addOrderBy('cita.hora', 'ASC')

          .getMany();

      if (citasProximas.length === 0) {
        this.logger.log(
          'No hay citas próximas.',
        );

        return;
      }

      this.logger.log(
        `Se encontraron ${citasProximas.length} citas próximas`,
      );

      for (const cita of citasProximas) {
        if (!this.citasEnviadas.has(cita.id)) {
          try {
            await this.enviarRecordatorioCita(
              cita,
            );

            this.citasEnviadas.add(cita.id);
          } catch (error) {
            this.logger.error(
              `Error en cita ${cita.id}: ${error}`,
            );
          }
        }
      }

      this.logger.log(
        'Proceso de recordatorios completado',
      );
    } catch (error) {
      this.logger.error(
        `Error en cron job: ${error}`,
        error,
      );
    }
  }

  /**
   * Limpiar registros
   */
  limpiarCitasEnviadas(): void {
    this.citasEnviadas.clear();

    this.logger.log(
      'Registro de citas limpiado',
    );
  }

  /**
   * Obtener cantidad de recordatorios enviados
   */
  obtenerCitasEnviadas(): number {
    return this.citasEnviadas.size;
  }
}
