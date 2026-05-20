import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from './guards/ws-jwt.guard';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { JoinRoomDto } from './dto/join-room.dto';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/chat',
})
@UseGuards(WsJwtGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinRoomDto,
  ) {
    const { citaId } = payload;
    const user = client.data.user as { id: number; role: string };

    // Validar acceso (los admins pueden entrar a cualquier sala si se desea, 
    // pero el service proveido solo valida medico/paciente)
    const tieneAcceso = user.role === 'admin' || await this.chatService.validarAccesoSala(
      citaId,
      user.id,
    );

    if (!tieneAcceso) {
      client.emit('error', { message: 'No tienes acceso a esta sala' });
      return;
    }

    const salaId = `cita-${citaId}`;
    client.join(salaId);

    // Enviar historial
    const historial = await this.chatService.obtenerHistorial(salaId);
    client.emit('history', historial);
    
    console.log(`Usuario ${user.id} unido a sala ${salaId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SendMessageDto,
  ) {
    const { citaId, contenido } = payload;
    const user = client.data.user as { id: number; role: string };
    const salaId = `cita-${citaId}`;

    // Validar acceso antes de guardar
    const tieneAcceso = user.role === 'admin' || await this.chatService.validarAccesoSala(
      citaId,
      user.id,
    );

    if (!tieneAcceso) {
      client.emit('error', { message: 'No tienes permiso para enviar mensajes en esta sala' });
      return;
    }

    const mensaje = await this.chatService.guardarMensaje(
      salaId,
      contenido,
      user.id,
      citaId,
    );

    // Emitir a todos en la sala
    this.server.to(salaId).emit('receiveMessage', mensaje);
  }
}
