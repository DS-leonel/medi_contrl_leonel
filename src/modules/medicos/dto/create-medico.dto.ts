import { IsNotEmpty, IsString, IsOptional, IsInt, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMedicoDto {
  @ApiProperty({ example: 'Cardiología' })
  @IsNotEmpty({ message: 'La especialidad es obligatoria' })
  @IsString()
  @Length(3, 100)
  especialidad: string;

  @ApiProperty({ example: '3001234567', required: false })
  @IsOptional()
  @IsString()
  @Length(7, 20)
  telefono?: string;

  @ApiProperty({ example: 1, description: 'ID del usuario con rol MEDICO' })
  @IsNotEmpty({ message: 'El usuarioId es obligatorio' })
  @IsInt()
  usuarioId: number;
}