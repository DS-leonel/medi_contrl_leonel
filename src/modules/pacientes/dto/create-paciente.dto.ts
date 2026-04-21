import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum Genero {
  MASCULINO = 'masculino',
  FEMENINO = 'femenino',
  OTRO = 'otro',
}

export enum TipoSangre {
  A_POSITIVO = 'A+',
  A_NEGATIVO = 'A-',
  B_POSITIVO = 'B+',
  B_NEGATIVO = 'B-',
  AB_POSITIVO = 'AB+',
  AB_NEGATIVO = 'AB-',
  O_POSITIVO = 'O+',
  O_NEGATIVO = 'O-',
}

export class CreatePacienteDto {
  @ApiProperty({
    description: 'ID del usuario con rol PACIENTE',
    example: 5,
  })
  @IsNumber({}, { message: 'El usuarioId debe ser un número' })
  @IsNotEmpty({ message: 'El usuarioId es obligatorio' })
  usuarioId: number;

  @ApiProperty({
    description: 'Fecha de nacimiento del paciente (YYYY-MM-DD)',
    example: '1990-05-15',
  })
  @IsDateString({}, { message: 'La fecha de nacimiento debe tener formato YYYY-MM-DD' })
  @IsNotEmpty({ message: 'La fecha de nacimiento es obligatoria' })
  fechaNacimiento: string;

  @ApiProperty({
    description: 'Género del paciente',
    enum: Genero,
    example: Genero.MASCULINO,
  })
  @IsEnum(Genero, { message: 'El género debe ser: masculino, femenino u otro' })
  @IsNotEmpty({ message: 'El género es obligatorio' })
  genero: Genero;

  @ApiProperty({
    description: 'Teléfono de contacto del paciente',
    example: '3001234567',
  })
  @IsString()
  @IsNotEmpty({ message: 'El teléfono de contacto es obligatorio' })
  @Length(7, 20, { message: 'El teléfono debe tener entre 7 y 20 caracteres' })
  @Matches(/^[0-9+\-\s()]+$/, { message: 'El teléfono solo puede contener dígitos y caracteres +, -, (, )' })
  telefonoContacto: string;

  @ApiProperty({
    description: 'Dirección de residencia del paciente',
    example: 'Calle 45 # 12-30, Bogotá',
  })
  @IsString()
  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  @Length(5, 255, { message: 'La dirección debe tener entre 5 y 255 caracteres' })
  direccion: string;

  @ApiPropertyOptional({
    description: 'Tipo de sangre del paciente',
    enum: TipoSangre,
    example: TipoSangre.O_POSITIVO,
  })
  @IsOptional()
  @IsEnum(TipoSangre, { message: 'Tipo de sangre inválido. Valores: A+, A-, B+, B-, AB+, AB-, O+, O-' })
  tipoSangre?: TipoSangre;

  @ApiPropertyOptional({
    description: 'Alergias conocidas del paciente',
    example: 'Penicilina, mariscos',
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000, { message: 'Las alergias no pueden exceder 1000 caracteres' })
  alergias?: string;

  @ApiPropertyOptional({
    description: 'Enfermedades crónicas del paciente',
    example: 'Diabetes tipo 2, hipertensión',
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000, { message: 'Las enfermedades crónicas no pueden exceder 1000 caracteres' })
  enfermedadesCronicas?: string;

  @ApiPropertyOptional({
    description: 'Nombre del contacto de emergencia',
    example: 'María García',
  })
  @IsOptional()
  @IsString()
  @Length(2, 150, { message: 'El nombre del contacto debe tener entre 2 y 150 caracteres' })
  contactoEmergenciaNombre?: string;

  @ApiPropertyOptional({
    description: 'Teléfono del contacto de emergencia',
    example: '3109876543',
  })
  @IsOptional()
  @IsString()
  @Length(7, 20, { message: 'El teléfono de emergencia debe tener entre 7 y 20 caracteres' })
  @Matches(/^[0-9+\-\s()]+$/, { message: 'El teléfono solo puede contener dígitos y caracteres +, -, (, )' })
  contactoEmergenciaTelefono?: string;
}