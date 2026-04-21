import { PartialType, OmitType } from '@nestjs/swagger';
import { CreatePacienteDto } from './create-paciente.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO para actualización de paciente.
 * Se excluye `usuarioId` porque no debe cambiarse después del registro.
 * Todos los campos heredados de CreatePacienteDto son opcionales.
 */
export class UpdatePacienteDto extends PartialType(
  OmitType(CreatePacienteDto, ['usuarioId'] as const),
) {
  @ApiPropertyOptional({
    description: 'Activar o desactivar el paciente en el sistema',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'El campo activo debe ser un booleano' })
  activo?: boolean;
}