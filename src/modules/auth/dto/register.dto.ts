import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { Role } from 'src/common/enum/roles.enum';

export class RegisterDto {
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
