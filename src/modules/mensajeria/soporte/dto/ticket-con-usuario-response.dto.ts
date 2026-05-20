import { Expose, Type } from 'class-transformer';
import { TicketResponseDto } from './ticket-response.dto';
import { UsuarioResponseDto } from './usuario-response.dto';

export class TicketConUsuarioResponseDto extends TicketResponseDto {
  @Expose()
  @Type(() => UsuarioResponseDto)
  usuario: UsuarioResponseDto | null;
}
