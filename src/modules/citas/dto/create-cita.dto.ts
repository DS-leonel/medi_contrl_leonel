import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsMilitaryTime, IsInt, IsPositive } from 'class-validator';

export class CreateCitaDto {
  @ApiProperty({
    example: '2025-06-15',
    description: 'Fecha de la cita en formato YYYY-MM-DD',
  })
  @IsDateString({}, { message: 'La fecha debe tener el formato YYYY-MM-DD' })
  fecha!: string;

  @ApiProperty({
    example: '09:30',
    description: 'Hora de la cita en formato HH:mm (24h)',
  })
  @IsMilitaryTime({ message: 'La hora debe tener el formato HH:mm (ej: 09:30)' })
  hora!: string;

  @ApiProperty({
    example: 2,
    description: 'ID del médico al que se agenda la cita',
  })
  @IsInt({ message: 'El ID del médico debe ser un número entero' })
  @IsPositive({ message: 'El ID del médico debe ser un número positivo' })
  medicoId!: number;
}