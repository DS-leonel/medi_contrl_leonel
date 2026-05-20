import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';

@ApiTags('Email')
@Controller('email')
export class EmailController {
  private readonly logger = new Logger(EmailController.name);

  constructor(private readonly emailService: EmailService) {}

  /**
   * Endpoint para enviar un correo genérico (testing)
   * POST /email/test
   */
  @Post('test')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Enviar correo de prueba',
    description: 'Endpoint para testing - envía un correo de prueba a una dirección',
  })
  @ApiResponse({
    status: 200,
    description: 'Correo enviado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Error en los datos enviados',
  })
  async enviarCorreoTest(
    @Body() sendEmailDto: SendEmailDto,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.emailService.enviarCorreo(sendEmailDto);
      return {
        success: true,
        message: `Correo enviado exitosamente a ${sendEmailDto.to}`,
      };
    } catch (error) {
      this.logger.error(
        `Error al enviar correo de prueba: ${error.message}`,
      );
      return {
        success: false,
        message: `Error al enviar correo: ${error.message}`,
      };
    }
  }

  /**
   * Endpoint para enviar confirmación de cita (testing)
   * POST /email/confirmacion
   * Payload: { citaId: number }
   */
  @Post('confirmacion')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Enviar confirmación de cita',
    description: 'Endpoint para testing - envía email de confirmación para una cita existente',
  })
  @ApiResponse({
    status: 200,
    description: 'Email de confirmación enviado',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  async enviarConfirmacion(
    @Body() body: { citaId: number },
  ): Promise<{ success: boolean; message: string }> {
    try {
      const cita = { id: body.citaId } as any;
      await this.emailService.enviarConfirmacionCita(cita);
      return {
        success: true,
        message: `Confirmación enviada para la cita ID: ${body.citaId}`,
      };
    } catch (error) {
      this.logger.error(
        `Error al enviar confirmación: ${error.message}`,
      );
      return {
        success: false,
        message: `Error al enviar confirmación: ${error.message}`,
      };
    }
  }

  /**
   * Endpoint para enviar recordatorio de cita (testing)
   * POST /email/recordatorio
   * Payload: { citaId: number }
   */
  @Post('recordatorio')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Enviar recordatorio de cita',
    description: 'Endpoint para testing - envía email de recordatorio para una cita existente',
  })
  @ApiResponse({
    status: 200,
    description: 'Email de recordatorio enviado',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  async enviarRecordatorio(
    @Body() body: { citaId: number },
  ): Promise<{ success: boolean; message: string }> {
    try {
      const cita = { id: body.citaId } as any;
      await this.emailService.enviarRecordatorioCita(cita);
      return {
        success: true,
        message: `Recordatorio enviado para la cita ID: ${body.citaId}`,
      };
    } catch (error) {
      this.logger.error(
        `Error al enviar recordatorio: ${error.message}`,
      );
      return {
        success: false,
        message: `Error al enviar recordatorio: ${error.message}`,
      };
    }
  }
}
