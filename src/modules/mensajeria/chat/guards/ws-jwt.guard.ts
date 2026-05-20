import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    // En WebSocket el token llega por handshake, NO por header HTTP
    const client: Socket = context.switchToWs().getClient();
    const token =
      client.handshake.auth?.token ||
      client.handshake.headers?.authorization?.split(' ')[1];

    if (!token) {
      throw new WsException('Token no proporcionado');
    }

    try {
      const payload = this.jwtService.verify(token);
      // Guardamos el usuario en el socket para usarlo después
      client.data.user = payload as { id: number; email: string; role: string }; // { id, email, role }
      return true;
    } catch {
      throw new WsException('Token inválido o expirado');
    }
  }
}