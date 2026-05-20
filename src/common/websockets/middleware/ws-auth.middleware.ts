import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { Role } from 'src/common/enum/roles.enum';
import {
  SocketJwtPayload,
  SocketUserPayload,
} from '../types/socket-user-payload.type';

@Injectable()
export class WsAuthMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(server: Server) {
    server.use((client: Socket, next) => {
      try {
        const token = this.getHandshakeToken(client);

        if (!token) {
          return next(new Error('Token no proporcionado'));
        }

        client.data.user = this.verifyToken(token);
        next();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Token invalido';
        next(new Error(message));
      }
    });
  }

  private verifyToken(token: string): SocketUserPayload {
    const payload = this.jwtService.verify<SocketJwtPayload>(token);
    const { id, role } = payload;

    if (Number.isNaN(id) || !Object.values(Role).includes(role)) {
      throw new Error('Usuario de socket invalido');
    }

    return { id, role };
  }

  private getHandshakeToken(client: Socket): string | null {
    const header = client.handshake.headers.authorization;
    return header ? header.replace(/^Bearer\s+/i, '') : null;
  }
}
