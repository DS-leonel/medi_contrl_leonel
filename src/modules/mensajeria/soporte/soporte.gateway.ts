import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  ForbiddenException,
  Logger,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/common/enum/roles.enum';
import { TicketStatus } from 'src/common/enum/TicketStatus.enum';
import { SoporteService } from './soporte.service';
import {
  OpenTicketMessageDto,
  SupportMessageDto,
  TicketRoomDto,
} from './dto/support-message.dto';
import { mapMensaje, mapTicket, mapUsuario } from './soporte.mappers';

type SocketUserPayload = {
  id: number;
  role: Role;
};

type SocketJwtPayload = SocketUserPayload & {
  sub?: number;
  email: string;
};

@WebSocketGateway({namespace: '/soporte' })
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class SoporteGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(SoporteGateway.name);
  private readonly ADMIN_CHANNEL = 'admin-notifications';
  private readonly INITIAL_EVENT_DELAY_MS = 100;
  private readonly ERROR_DISCONNECT_DELAY_MS = 250;

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly soporteService: SoporteService,
    private readonly jwtService: JwtService,
  ) {}

  handleConnection(client: Socket) {
    try {
      const user = this.requireSocketUser(client);

      if (user.role === Role.ADMIN) {
        void client.join(this.ADMIN_CHANNEL);
      }

      this.emitInitialEvent(client, 'connected', {
        message: 'Conectado al soporte',
        user,
      });
    } catch (error) {
      this.handleConnectionError(client, error);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Socket desconectado: socketId=${client.id}`);
  }

  @SubscribeMessage('openTicket')
  async openTicket(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: OpenTicketMessageDto,
  ) {
    const user = this.requireSocketUser(client);
    const ticket = await this.soporteService.crearTicket(payload, user.id);

    await client.join(ticket.salaId);

    const data = {
      ticket: mapTicket(ticket),
      sala: ticket.salaId,
      usuario: mapUsuario(ticket.usuario),
    };

    client.emit('ticketOpened', data);
    this.server.to(this.ADMIN_CHANNEL).emit('ticketNotification', {
      ...data,
      message: 'Nuevo ticket de soporte',
    });
  }

  @SubscribeMessage('joinTicket')
  async joinTicket(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: TicketRoomDto,
  ) {
    const user = this.requireSocketUser(client);
    const ticket = await this.soporteService.findById(payload.ticketId);

    this.soporteService.validarParticipante(
      ticket.usuario.id,
      user.id,
      user.role,
    );

    await client.join(ticket.salaId);

    const historial = await this.soporteService.obtenerHistorial(ticket.salaId);

    const data = {
      ticket: mapTicket(ticket),
      sala: ticket.salaId,
      mensajes: historial.map(mapMensaje),
    };

    client.emit('ticketHistory', data);
  }

  @SubscribeMessage('sendSupportMessage')
  async sendSupportMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SupportMessageDto,
  ) {
    const user = this.requireSocketUser(client);
    const { mensaje, ticket } = await this.soporteService.procesarMensaje(
      payload.ticketId,
      payload.contenido,
      user.id,
      user.role,
    );

    await client.join(ticket.salaId);

    const data = {
      ticket: mapTicket(ticket),
      sala: ticket.salaId,
      mensaje: mapMensaje(mensaje),
    };

    this.server.to(ticket.salaId).emit('receiveMessage', data);
  }

  @SubscribeMessage('closeTicket')
  async closeTicket(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: TicketRoomDto,
  ) {
    const user = this.requireSocketUser(client);

    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException(
        'Solo un administrador puede cerrar tickets',
      );
    }

    const ticket = await this.soporteService.cambiarEstado(
      payload.ticketId,
      TicketStatus.RESUELTO,
      user.role,
    );

    const data = {
      ticket: mapTicket(ticket),
      sala: ticket.salaId,
      message: 'Ticket cerrado correctamente',
    };

    this.server.to(ticket.salaId).emit('ticketClosed', data);
  }

  // ── Autenticación ──────────────────────────────────────────
  private requireSocketUser(client: Socket): SocketUserPayload {
    const token = this.getHandshakeToken(client);
    if (!token) throw new ForbiddenException('Token no proporcionado');

    const payload = this.jwtService.verify<SocketJwtPayload>(token);
    const id = Number(payload.id ?? payload.sub);
    const { role } = payload;

    if (Number.isNaN(id) || !Object.values(Role).includes(role)) {
      throw new ForbiddenException('Usuario de socket invalido');
    }

    return { id, role };
  }

  private getHandshakeToken(client: Socket): string | null {
    const header = client.handshake.headers.authorization;
    return header ? header.replace(/^Bearer\s+/i, '') : null;
  }

  // ── Utilidades ─────────────────────────────────────────────
  private handleConnectionError(client: Socket, error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Error de conexion';
    this.emitInitialEvent(client, 'connectionError', { message });
    setTimeout(() => client.disconnect(true), this.ERROR_DISCONNECT_DELAY_MS);
  }

  private emitInitialEvent<TPayload>(
    client: Socket,
    event: string,
    payload: TPayload,
  ) {
    setTimeout(() => {
      if (client.connected) {
        client.emit(event, payload);
      }
    }, this.INITIAL_EVENT_DELAY_MS);
  }
}
