import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { SoporteController } from './soporte.controller';
import { SoporteService } from './soporte.service';
import { AppJwtModule } from 'src/modules/app-jwt/app-jwt.module';
import { User } from 'src/modules/users/entities/user.entity';
import { SoporteGateway } from './soporte.gateway';
import { Mensaje } from '../chat/entities/mensaje.entity';
import { WsAuthMiddleware } from 'src/common/websockets/middleware/ws-auth.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, User, Mensaje]),
    AppJwtModule, // necesario para que AuthGuard tenga el JwtService
  ],
  controllers: [SoporteController],
  providers: [SoporteService, SoporteGateway, WsAuthMiddleware],
  exports: [SoporteService], // exportado para que el Integrante 5 lo use en el gateway
})
export class SoporteModule {}
