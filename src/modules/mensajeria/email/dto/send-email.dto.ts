import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendEmailDto {
  @ApiProperty({
    description: 'Correo electrónico del destinatario',
    example: 'usuario@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  to: string;

  @ApiProperty({
    description: 'Asunto del correo',
    example: 'Confirmación de tu cita médica',
  })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    description: 'Contenido HTML del correo',
    example: '<h1>Hola</h1><p>Tu cita ha sido confirmada</p>',
  })
  @IsString()
  @IsNotEmpty()
  html: string;

  @ApiProperty({
    description: 'Correo del remitente (opcional)',
    example: 'noreply@medicontrol.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  from?: string;

  @ApiProperty({
    description: 'Contenido de texto plano (opcional)',
    example: 'Tu cita ha sido confirmada',
    required: false,
  })
  @IsString()
  @IsOptional()
  text?: string;
}
