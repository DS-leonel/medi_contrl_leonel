import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/common/enum/roles.enum';

export class RegisterDto {
  @ApiProperty({ example: 'Carlos' })
  @Transform(({ value }) => value.trim())
  @IsString()
  primerNombre: string;

  @ApiProperty({ example: 'Lopez' })
  @Transform(({ value }) => value.trim())
  @IsString()
  primerApellido: string;

  @ApiPropertyOptional({ example: 'Andres' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsOptional()
  @IsString()
  segundoNombre?: string;

  @ApiPropertyOptional({ example: 'Gomez' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsOptional()
  @IsString()
  segundoApellido?: string;

  @ApiProperty({ example: 'test.test@example.com' })
  @IsEmail({}, { message: 'El email no tiene un formato válido' })
  email: string;

  @ApiProperty({ example: 'password123' })
  @Transform(({ value }) => value.trim())
  @IsString()
  password: string;

  @ApiProperty({ enum: Role, example: Role.PACIENTE })
  @IsEnum(Role, {
    message:
      'El rol debe ser uno de los siguientes: ' +
      Object.values(Role).join(', '),
  })
  role: Role;
}
