import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../entities/user.entity';

export class AssignRoleDto {

  @ApiProperty({ enum: Role, example: Role.MEDICO })
  @IsEnum(Role, { message: 'El rol debe ser ADMIN, MEDICO o PACIENTE' })
  role!: Role;
}