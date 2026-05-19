// soporte.mappers.ts
import { Mensaje } from '../chat/entities/mensaje.entity';
import { Ticket } from './entities/ticket.entity';
import { User } from 'src/modules/users/entities/user.entity';

export interface UsuarioResponse {
  id: number;
  nombre: string;
  role: string;
}

export interface TicketResponse {
  id: number;
  descripcion: string;
  estado: string;
}

export interface MensajeResponse {
  id: number;
  contenido: string;
  remitente: UsuarioResponse | null;
}

export function mapUsuario(user?: User | null): UsuarioResponse | null {
  if (!user) return null;

  const nombre = [
    user.primerNombre,
    user.segundoNombre,
    user.primerApellido,
    user.segundoApellido,
  ]
    .filter(Boolean)
    .join(' ');

  return { id: user.id, nombre, role: user.role };
}

export function mapTicket(ticket: Ticket): TicketResponse {
  return {
    id: ticket.id,
    descripcion: ticket.descripcion,
    estado: ticket.estado,
  };
}

export function mapMensaje(mensaje: Mensaje): MensajeResponse {
  return {
    id: mensaje.id,
    contenido: mensaje.contenido,
    remitente: mapUsuario(mensaje.remitente),
  };
}