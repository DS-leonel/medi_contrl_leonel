import { Mensaje } from '../chat/entities/mensaje.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { UsuarioResponseDto } from './dto/usuario-response.dto';
import { Ticket } from './entities/ticket.entity';
import { TicketResponseDto } from './dto/ticket-response.dto';
import { TicketConUsuarioResponseDto } from './dto/ticket-con-usuario-response.dto';
import { MensajeResponseDto } from './dto/mensaje-response.dto';

export class SoporteMapper {
  static toUsuarioDto(user?: User | null): UsuarioResponseDto | null {
    if (!user) return null;

    const nombre = [
      user.primerNombre,
      user.segundoNombre,
      user.primerApellido,
      user.segundoApellido,
    ]
      .filter(Boolean)
      .join(' ');

    const dto = new UsuarioResponseDto();
    dto.id = user.id;
    dto.nombre = nombre;
    dto.role = user.role;
    return dto;
  }

  static toTicketDto(ticket: Ticket): TicketResponseDto {
    const dto = new TicketResponseDto();
    dto.id = ticket.id;
    dto.descripcion = ticket.descripcion;
    dto.estado = ticket.estado;
    return dto;
  }

  static toTicketConUsuarioDto(ticket: Ticket): TicketConUsuarioResponseDto {
    const dto = new TicketConUsuarioResponseDto();
    dto.id = ticket.id;
    dto.descripcion = ticket.descripcion;
    dto.estado = ticket.estado;
    dto.usuario = SoporteMapper.toUsuarioDto(ticket.usuario);
    return dto;
  }

  static toMensajeDto(mensaje: Mensaje): MensajeResponseDto {
    const dto = new MensajeResponseDto();
    dto.id = mensaje.id;
    dto.contenido = mensaje.contenido;
    dto.remitente = SoporteMapper.toUsuarioDto(mensaje.remitente);
    return dto;
  }
}
