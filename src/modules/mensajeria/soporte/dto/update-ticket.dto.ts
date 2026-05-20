import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { TicketStatus } from 'src/common/enum/TicketStatus.enum';

export class UpdateTicketDto {
  @ApiProperty({
    enum: TicketStatus,
    example: TicketStatus.EN_ATENCION,
    description: 'Nuevo estado del ticket',
  })
  @IsEnum(TicketStatus, {
    message:
      'El estado debe ser uno de: ' + Object.values(TicketStatus).join(', '),
  })
  estado!: TicketStatus;
}