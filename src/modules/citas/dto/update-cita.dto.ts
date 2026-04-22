import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { CitaStatus } from 'src/common/enum/CitaStatus.enum'; 
 
export class UpdateCitaStatusDto {
  @ApiProperty({
    enum: CitaStatus,
    example: CitaStatus.COMPLETADA,
    description: 'Nuevo estado de la cita',
  })
  @IsEnum(CitaStatus, {
    message:
      'El estado debe ser uno de: ' + Object.values(CitaStatus).join(', '),
  })
  estado!: CitaStatus;
}
 