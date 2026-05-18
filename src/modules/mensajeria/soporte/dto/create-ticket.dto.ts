import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateTicketDto {
  @ApiProperty({
    example: 'No puedo ver mis citas programadas',
    description: 'Descripción del problema o consulta',
    minLength: 10,
    maxLength: 500,
  })
  @IsString({ message: 'La descripción debe ser texto' })
  @MinLength(10, { message: 'La descripción debe tener mínimo 10 caracteres' })
  @MaxLength(500, { message: 'La descripción no puede superar 500 caracteres' })
  descripcion!: string;
}