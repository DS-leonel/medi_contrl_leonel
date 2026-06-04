import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEstudianteDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  apellido: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  cedula: string;
}