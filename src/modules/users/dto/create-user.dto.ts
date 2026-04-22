import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from 'src/common/enum/roles.enum';

export class CreateUserDto {

  @ApiProperty({ example: 'usuario@email.com' })
  @IsEmail({}, { message: 'El email no tiene un formato válido' })
  email!: string;

  @ApiProperty({ example: 'miPassword123', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener mínimo 6 caracteres' })
  password!: string;

  @ApiPropertyOptional({ enum: Role, example: Role.PACIENTE })
  @IsOptional()
  @IsEnum(Role, { message: 'El rol debe ser ADMIN, MEDICO o PACIENTE' })
  role?: Role;
}