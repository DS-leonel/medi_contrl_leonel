import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'test.test@example.com' })
  @IsEmail({}, { message: 'El email no tiene un formato válido' })
  email: string;

  @ApiProperty({ example: 'password123' })
  @Transform(({ value }) => value.trim())
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  password: string;
}
