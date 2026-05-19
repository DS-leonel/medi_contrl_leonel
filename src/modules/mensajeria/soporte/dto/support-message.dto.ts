import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class OpenTicketMessageDto {
  @IsString({ message: 'La descripcion debe ser texto' })
  @IsNotEmpty({ message: 'La descripcion es obligatoria' })
  @MaxLength(2000, {
    message: 'La descripcion no puede superar los 2000 caracteres',
  })
  descripcion: string;
}

export class TicketRoomDto {
  @Type(() => Number)
  @IsNumber({}, { message: 'El ticketId debe ser numerico' })
  ticketId: number;
}

export class SupportMessageDto extends TicketRoomDto {
  @IsString({ message: 'El contenido debe ser texto' })
  @IsNotEmpty({ message: 'El contenido es obligatorio' })
  @MaxLength(4000, {
    message: 'El contenido no puede superar los 4000 caracteres',
  })
  contenido: string;
}
